import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { APP_STATES, useAppState } from '../context/AppStateContext';
import { createTrainedDomainModel, createTrainedIntentModel } from '../ml/intentModel';

const CRISIS_TERMS = [
  'suicide',
  'kill myself',
  'hurt myself',
  'self harm',
  'end my life',
  'i want to die',
];

const PLAYBOOK = {
  anxiety: {
    title: 'Anxiety',
    response: "I hear the anxiety in your voice, and that's completely understandable. Try taking a slow, deep breath with me. Inhale... and exhale. What's the main thought causing this right now?",
  },
  overwhelm: {
    title: 'Overwhelm',
    response: "It sounds like you have so much on your plate right now. Let's not worry about everything at once. What's just one small thing we can tackle together in the next ten minutes?",
  },
  sadness: {
    title: 'Sadness',
    response: "I'm so sorry you're feeling this way. Sometimes things are just really heavy, and it's okay to feel sad. I'm right here with you. Do you want to talk more about what happened?",
  },
  self_worth: {
    title: 'Self-worth',
    response: "You are being so hard on yourself, but I see how much you're trying. You are doing the best you can. Can you tell me one small thing you handled well today?",
  },
  anger: {
    title: 'Anger',
    response: "Your frustration is completely valid. It's okay to be angry when things feel unfair. Take a second to pause. What exactly do you need right now to feel heard?",
  },
  sleep: {
    title: 'Sleep',
    response: "You sound exhausted. Your mind and body really need a break. Let's focus on just winding down for tonight. What's one relaxing thing you can do before bed?",
  },
  focus: {
    title: 'Focus',
    response: "It's so hard to focus when your brain is pulled in a hundred directions. Let's try a quick reset. If you had to pick just one thing to look at right now, what would it be?",
  },
  relationship: {
    title: 'Relationship',
    response: "Relationship stress can feel so personal and painful. It makes sense that you feel this way. How would you want this to be resolved if you could choose?",
  },
  motivation: {
    title: 'Motivation',
    response: "I know it feels like you're stuck, but just talking to me means you're trying to move forward. That counts. What is the smallest possible step you could take today?",
  },
  general: {
    title: 'General',
    response: "Thank you so much for sharing that with me. I'm here to listen and help you through this. What feels like the most urgent thing on your mind right now?",
  },
};

const DOMAIN_PLAYBOOK = {
  student: {
    title: 'Student Life',
    bridge: "School can put so much pressure on you. Let's take it one assignment at a time.",
  },
  work: {
    title: 'Work Life',
    bridge: "Work sounds really draining right now. Let's figure out how to give you some breathing room.",
  },
  relationship: {
    title: 'Relationships',
    bridge: "Dealing with people is rarely simple. Your feelings about this are completely valid.",
  },
  general: {
    title: 'Life',
    bridge: "I appreciate you opening up. We'll take this one step at a time.",
  },
};

const VOICE_STYLE_CONFIG = {
  calm: { rate: 0.9, pitch: 1.1, volume: 1 },
  coach: { rate: 1.0, pitch: 1.0, volume: 1 },
  gentle: { rate: 0.85, pitch: 1.2, volume: 1 },
  clinical: { rate: 0.95, pitch: 1.0, volume: 1 },
};

const mapSpeechError = (code) => {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone permission is blocked. Allow access to use live dictation.';
    case 'audio-capture':
      return 'No microphone input detected. Check your audio device.';
    case 'no-speech':
      return 'No speech was detected. Please try again.';
    case 'network':
      return 'Speech service network error. Falling back to guided prompt mode.';
    default:
      return 'Speech recognition failed. Please try again.';
  }
};

const formatLabel = (value) =>
  String(value || 'general')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const buildResponseFromIntent = ({ query, intent, domain, history, model }) => {
  const intentPlan = PLAYBOOK[intent] || PLAYBOOK.general;
  let responseText = intentPlan.response;

  // Mix in a domain bridge occasionally to make it feel contextual, but not always so it's not robotic
  if (domain && domain !== 'general' && Math.random() > 0.5) {
    const domainPlan = DOMAIN_PLAYBOOK[domain] || DOMAIN_PLAYBOOK.general;
    responseText = `${domainPlan.bridge} ${responseText}`;
  }

  return {
    text: responseText,
    title: `${intentPlan.title}`,
    actionStep: "Supportive response delivered.",
    followUp: "Waiting for user context.",
    intent,
    domain,
  };
};

export const useVoice = () => {
  const { state, dispatch } = useAppState();

  const intentModel = useMemo(() => createTrainedIntentModel(), []);
  const domainModel = useMemo(() => createTrainedDomainModel(), []);
  const modelRef = useRef(intentModel);
  const domainModelRef = useRef(domainModel);

  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const listenTimerRef = useRef(null);
  const thinkingTimerRef = useRef(null);
  const speakingTimerRef = useRef(null);
  const latestStatusRef = useRef(state.status);
  const latestMutedRef = useRef(state.isMuted);
  const latestVoiceStyleRef = useRef(state.voiceStyle);
  const latestHistoryRef = useRef(state.history);
  const latestProfileRef = useRef(state.coachingProfile);
  const lastQueryRef = useRef('');

  const [isRecognizing, setIsRecognizing] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [lastInference, setLastInference] = useState(null);
  const [modelSummary, setModelSummary] = useState(() => {
    const intentSummary = modelRef.current.getTrainingSummary();
    const domainSummary = domainModelRef.current.getTrainingSummary();
    return {
      totalDocs: intentSummary.totalDocs,
      vocabularySize: intentSummary.vocabularySize,
      domainDocs: domainSummary.totalDocs,
      domainVocabulary: domainSummary.vocabularySize,
    };
  });

  const isSpeechSupported = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  useEffect(() => {
    latestStatusRef.current = state.status;
  }, [state.status]);

  useEffect(() => {
    latestMutedRef.current = state.isMuted;
    if (typeof window !== 'undefined' && state.isMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [state.isMuted]);

  useEffect(() => {
    latestVoiceStyleRef.current = state.voiceStyle;
  }, [state.voiceStyle]);

  useEffect(() => {
    latestHistoryRef.current = state.history;
  }, [state.history]);

  useEffect(() => {
    latestProfileRef.current = state.coachingProfile;
  }, [state.coachingProfile]);

  const refreshModelSummary = useCallback(() => {
    const intentSummary = modelRef.current.getTrainingSummary();
    const domainSummary = domainModelRef.current.getTrainingSummary();

    setModelSummary({
      totalDocs: intentSummary.totalDocs,
      vocabularySize: intentSummary.vocabularySize,
      domainDocs: domainSummary.totalDocs,
      domainVocabulary: domainSummary.vocabularySize,
    });
  }, []);

  const clearTimers = useCallback(() => {
    if (listenTimerRef.current) {
      clearTimeout(listenTimerRef.current);
      listenTimerRef.current = null;
    }
    if (thinkingTimerRef.current) {
      clearTimeout(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }
    if (speakingTimerRef.current) {
      clearTimeout(speakingTimerRef.current);
      speakingTimerRef.current = null;
    }
  }, []);

  const speakResponse = useCallback((text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text || latestMutedRef.current) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    const preferredVoice =
      voices.find((voice) => /female|samantha|serena|ava|aria|natural/i.test(voice.name) && /^en/i.test(voice.lang)) ||
      voices.find((voice) => /google uk english female/i.test(voice.name)) ||
      voices.find((voice) => /^en/i.test(voice.lang));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    const style = VOICE_STYLE_CONFIG[latestVoiceStyleRef.current] || VOICE_STYLE_CONFIG.calm;
    utterance.rate = style.rate;
    utterance.pitch = style.pitch;
    utterance.volume = style.volume;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const completeResponseCycle = useCallback(
    (query, useAlternativeIntent = false) => {
      const cleanedQuery = String(query || '').trim();

      setVoiceError('');
      setFeedbackMessage('');
      dispatch({ type: 'SET_LAST_QUERY', payload: cleanedQuery });
      dispatch({ type: 'SET_STATUS', payload: APP_STATES.THINKING });
      lastQueryRef.current = cleanedQuery;

      thinkingTimerRef.current = setTimeout(() => {
        if (latestStatusRef.current === APP_STATES.CRISIS) {
          return;
        }

        if (CRISIS_TERMS.some((term) => cleanedQuery.toLowerCase().includes(term))) {
          const emergencyResponse =
            'I am really glad you told me. Your safety matters most. Please call or text 988 right now, and if immediate danger exists call emergency services.';

          dispatch({ type: 'SET_STATUS', payload: APP_STATES.CRISIS });
          dispatch({ type: 'RECORD_INTERACTION', payload: { query: cleanedQuery, response: emergencyResponse } });
          setLastInference({
            title: 'Crisis Safety',
            intent: 'crisis',
            confidence: 100,
            domain: 'crisis',
            domainConfidence: 100,
            profileMode: latestProfileRef.current || 'auto',
            actionStep: 'Immediate escalation to emergency support.',
            followUp: 'Are you safe right now?',
            alternatives: [],
            domainAlternatives: [],
          });
          speakResponse(emergencyResponse);
          return;
        }

        const prediction = modelRef.current.predict(cleanedQuery);
        const ranked = prediction.rankedIntents;
        const domainPrediction = domainModelRef.current.predict(cleanedQuery);
        const rankedDomains = domainPrediction.rankedIntents;
        const primary = ranked[0]?.intent || 'general';
        const secondary = ranked[1]?.intent || 'general';
        const primaryDomain = rankedDomains[0]?.intent || 'general';
        const secondaryDomain = rankedDomains[1]?.intent || primaryDomain;
        const selectedIntent = useAlternativeIntent ? secondary : primary;
        const selectedConfidence = useAlternativeIntent
          ? Math.round((ranked[1]?.probability || ranked[0]?.probability || 0) * 100)
          : prediction.confidence;
        const profileMode = latestProfileRef.current || 'auto';
        const selectedDomain = profileMode === 'auto' ? (useAlternativeIntent ? secondaryDomain : primaryDomain) : profileMode;
        const selectedDomainConfidence = profileMode === 'auto'
          ? useAlternativeIntent
            ? Math.round((rankedDomains[1]?.probability || rankedDomains[0]?.probability || 0) * 100)
            : domainPrediction.confidence
          : 100;

        modelRef.current.trainExample(cleanedQuery, selectedIntent);
        domainModelRef.current.trainExample(cleanedQuery, selectedDomain);
        refreshModelSummary();

        const responsePack = buildResponseFromIntent({
          query: cleanedQuery,
          intent: selectedIntent,
          confidence: selectedConfidence,
          domain: selectedDomain,
          domainConfidence: selectedDomainConfidence,
          profileMode,
          history: latestHistoryRef.current,
          model: modelRef.current,
        });

        dispatch({ type: 'SET_STATUS', payload: APP_STATES.SPEAKING });
        dispatch({
          type: 'RECORD_INTERACTION',
          payload: { query: cleanedQuery, response: responsePack.text },
        });

        setLastInference({
          title: responsePack.title,
          intent: responsePack.intent,
          confidence: responsePack.confidence,
          domain: responsePack.domain,
          domainConfidence: responsePack.domainConfidence,
          profileMode: responsePack.profileMode,
          actionStep: responsePack.actionStep,
          followUp: responsePack.followUp,
          alternatives: ranked.slice(0, 3).map((entry) => ({
            intent: entry.intent,
            confidence: Math.round(entry.probability * 100),
          })),
          domainAlternatives: rankedDomains.slice(0, 3).map((entry) => ({
            intent: entry.intent,
            confidence: Math.round(entry.probability * 100),
          })),
        });

        speakResponse(responsePack.text);

        speakingTimerRef.current = setTimeout(() => {
          if (latestStatusRef.current !== APP_STATES.CRISIS) {
            dispatch({ type: 'SET_STATUS', payload: APP_STATES.IDLE });
          }
        }, 4200);
      }, 1200);
    },
    [dispatch, refreshModelSummary, speakResponse]
  );

  const reinforceLastResponse = useCallback(
    (helpful) => {
      if (!lastInference || !lastQueryRef.current) {
        return;
      }

      const targetIntent = helpful
        ? lastInference.intent
        : lastInference.alternatives?.[1]?.intent || 'general';
      const targetDomain = helpful
        ? lastInference.domain || 'general'
        : lastInference.domainAlternatives?.[1]?.intent || 'general';
      const profileMode = latestProfileRef.current || 'auto';
      const effectiveDomain = profileMode === 'auto' ? targetDomain : profileMode;

      modelRef.current.trainExample(lastQueryRef.current, targetIntent);
      domainModelRef.current.trainExample(lastQueryRef.current, effectiveDomain);
      refreshModelSummary();
      setFeedbackMessage(
        helpful
          ? 'Thanks. Intent and coaching-profile model signals were reinforced for this pattern.'
          : 'Got it. Intent and profile interpretation were updated to try a better response next time.'
      );
    },
    [lastInference, refreshModelSummary]
  );

  const requestAlternativeResponse = useCallback(() => {
    if (!lastQueryRef.current || state.status === APP_STATES.THINKING) {
      return;
    }

    clearTimers();
    completeResponseCycle(lastQueryRef.current, true);
  }, [clearTimers, completeResponseCycle, state.status]);

  const runFallbackCapture = useCallback(() => {
    const placeholderQuery = 'I feel stressed and I need support right now.';

    dispatch({ type: 'SET_STATUS', payload: APP_STATES.LISTENING });
    listenTimerRef.current = setTimeout(() => {
      completeResponseCycle(placeholderQuery);
    }, 1000);
  }, [completeResponseCycle, dispatch]);

  const ensureRecognition = useCallback(() => {
    if (!isSpeechSupported || typeof window === 'undefined') {
      return null;
    }

    if (recognitionRef.current) {
      return recognitionRef.current;
    }

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      return null;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceError('');
      setIsRecognizing(true);
      dispatch({ type: 'SET_STATUS', payload: APP_STATES.LISTENING });
    };

    recognition.onresult = (event) => {
      let interim = '';
      let finalChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0]?.transcript?.trim() || '';
        if (event.results[i].isFinal) {
          finalChunk += `${transcript} `;
        } else {
          interim += `${transcript} `;
        }
      }

      const interimText = interim.trim();
      const finalText = finalChunk.trim();

      if (finalText) {
        finalTranscriptRef.current = `${finalTranscriptRef.current} ${finalText}`.trim();
        dispatch({ type: 'SET_LAST_QUERY', payload: finalTranscriptRef.current });
      } else if (interimText) {
        dispatch({ type: 'SET_LAST_QUERY', payload: interimText });
      }
    };

    recognition.onerror = (event) => {
      setIsRecognizing(false);
      setVoiceError(mapSpeechError(event.error));

      if (event.error === 'network') {
        runFallbackCapture();
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        dispatch({ type: 'SET_STATUS', payload: APP_STATES.IDLE });
      }
    };

    recognition.onend = () => {
      setIsRecognizing(false);
      const transcript = finalTranscriptRef.current.trim();
      finalTranscriptRef.current = '';

      if (transcript) {
        completeResponseCycle(transcript);
      } else if (latestStatusRef.current === APP_STATES.LISTENING) {
        dispatch({ type: 'SET_STATUS', payload: APP_STATES.IDLE });
      }
    };

    recognitionRef.current = recognition;
    return recognition;
  }, [completeResponseCycle, dispatch, isSpeechSupported, runFallbackCapture]);

  const simulateListening = useCallback(() => {
    if (state.status !== APP_STATES.IDLE && state.status !== APP_STATES.SPEAKING) {
      return;
    }

    if (state.isMuted) {
      setVoiceError('Unmute the assistant before starting voice capture.');
      return;
    }

    clearTimers();

    if (!isSpeechSupported) {
      runFallbackCapture();
      return;
    }

    const recognition = ensureRecognition();

    if (!recognition) {
      runFallbackCapture();
      return;
    }

    if (isRecognizing) {
      recognition.stop();
      return;
    }

    finalTranscriptRef.current = '';

    try {
      recognition.start();
    } catch {
      runFallbackCapture();
    }
  }, [clearTimers, ensureRecognition, isRecognizing, isSpeechSupported, runFallbackCapture, state.isMuted, state.status]);

  const simulateProcessing = useCallback(
    (text) => {
      const query = String(text || '').trim() || 'I need support right now.';
      clearTimers();
      completeResponseCycle(query);
    },
    [clearTimers, completeResponseCycle]
  );

  useEffect(
    () => () => {
      clearTimers();

      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;

        try {
          recognitionRef.current.stop();
        } catch {
          // no-op
        }
      }

      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    },
    [clearTimers]
  );

  return {
    simulateListening,
    simulateProcessing,
    submitMessage: simulateProcessing,
    isSpeechSupported,
    isRecognizing,
    voiceError,
    lastInference,
    modelSummary,
    feedbackMessage,
    reinforceLastResponse,
    requestAlternativeResponse,
  };
};
