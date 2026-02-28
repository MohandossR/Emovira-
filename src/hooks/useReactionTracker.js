import { useCallback, useEffect, useRef, useState } from 'react';
import { APP_STATES, useAppState } from '../context/AppStateContext';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const formatTime = () =>
  new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());

const buildEvent = (label, detail, tone = 'neutral') => {
  const timestamp = Date.now();
  return {
    id: `${timestamp}-${Math.random().toString(16).slice(2)}`,
    timestamp,
    label,
    detail,
    tone,
    time: formatTime(),
  };
};

export const useReactionTracker = () => {
  const { state, dispatch } = useAppState();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const frameTimerRef = useRef(null);
  const detectorRef = useRef(null);
  const previousVectorRef = useRef(null);
  const currentReactionRef = useRef('Idle');
  const missingFaceFramesRef = useRef(0);
  const analyzingRef = useRef(false);
  const lastSampleAtRef = useRef(0);

  const [permission, setPermission] = useState('idle');
  const [streamActive, setStreamActive] = useState(false);
  const [facesDetected, setFacesDetected] = useState(0);
  const [attentionScore, setAttentionScore] = useState(0);
  const [engagementScore, setEngagementScore] = useState(0);
  const [motionLevel, setMotionLevel] = useState(0);
  const [luminance, setLuminance] = useState(0);
  const [reaction, setReaction] = useState('Idle');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [faceBox, setFaceBox] = useState(null);
  const [events, setEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const pushEvent = useCallback(
    (label, detail, tone = 'neutral') => {
      const event = buildEvent(label, detail, tone);
      setEvents((prev) => [event, ...prev].slice(0, 8));
      dispatch({ type: 'ADD_REACTION_EVENT', payload: event });
    },
    [dispatch]
  );

  const stopTracking = useCallback(() => {
    if (frameTimerRef.current) {
      clearInterval(frameTimerRef.current);
      frameTimerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    detectorRef.current = null;
    previousVectorRef.current = null;
    missingFaceFramesRef.current = 0;
    analyzingRef.current = false;
    lastSampleAtRef.current = 0;

    setStreamActive(false);
    setFacesDetected(0);
    setAttentionScore(0);
    setEngagementScore(0);
    setMotionLevel(0);
    setLuminance(0);
    setFaceBox(null);
    setLastUpdated(null);
    setReaction('Idle');
    currentReactionRef.current = 'Idle';
  }, []);

  const analyzeFrame = useCallback(async () => {
    if (analyzingRef.current) {
      return;
    }

    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      return;
    }

    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvasRef.current = canvas;
    }

    const width = 176;
    const ratio = video.videoWidth > 0 && video.videoHeight > 0 ? video.videoWidth / video.videoHeight : 16 / 9;
    const height = Math.max(96, Math.round(width / ratio));

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      return;
    }

    analyzingRef.current = true;

    try {
      ctx.drawImage(video, 0, 0, width, height);
      const frame = ctx.getImageData(0, 0, width, height).data;

      const grayscaleVector = [];
      let luminanceAccumulator = 0;

      for (let i = 0; i < frame.length; i += 20) {
        const gray = Math.round(frame[i] * 0.299 + frame[i + 1] * 0.587 + frame[i + 2] * 0.114);
        grayscaleVector.push(gray);
        luminanceAccumulator += gray;
      }

      const avgLuminance = grayscaleVector.length ? luminanceAccumulator / grayscaleVector.length : 0;
      setLuminance(Math.round(avgLuminance));

      let computedMotion = 0;
      if (previousVectorRef.current && previousVectorRef.current.length === grayscaleVector.length) {
        let diff = 0;
        for (let i = 0; i < grayscaleVector.length; i += 1) {
          diff += Math.abs(grayscaleVector[i] - previousVectorRef.current[i]);
        }
        computedMotion = clamp((diff / grayscaleVector.length / 255) * 100 * 3.4, 0, 100);
      }

      previousVectorRef.current = grayscaleVector;
      setMotionLevel(Math.round(computedMotion));

      let faces = [];
      if (detectorRef.current) {
        try {
          faces = await detectorRef.current.detect(canvas);
        } catch {
          faces = [];
        }
      }

      const faceCount = faces.length;
      setFacesDetected(faceCount);

      let computedAttention = 0;

      if (faceCount > 0) {
        missingFaceFramesRef.current = 0;
        const box = faces[0].boundingBox;
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;

        const centerDistanceX = Math.abs(centerX - width / 2) / (width / 2);
        const centerDistanceY = Math.abs(centerY - height / 2) / (height / 2);
        const centeredScore = clamp(1 - (centerDistanceX + centerDistanceY) / 2, 0, 1);
        const relativeFaceSize = (box.width * box.height) / (width * height);
        const sizeScore = clamp(relativeFaceSize / 0.2, 0, 1);

        computedAttention = Math.round((centeredScore * 0.8 + sizeScore * 0.2) * 100);

        setFaceBox({
          x: clamp((box.x / width) * 100, 0, 100),
          y: clamp((box.y / height) * 100, 0, 100),
          width: clamp((box.width / width) * 100, 0, 100),
          height: clamp((box.height / height) * 100, 0, 100),
        });
      } else {
        missingFaceFramesRef.current += 1;
        setFaceBox(null);

        if (avgLuminance > 48 && computedMotion < 16) {
          computedAttention = 38;
        } else if (avgLuminance <= 48) {
          computedAttention = 24;
        } else {
          computedAttention = 30;
        }
      }

      setAttentionScore(computedAttention);

      const stateBoost =
        state.status === APP_STATES.LISTENING || state.status === APP_STATES.THINKING
          ? 8
          : state.status === APP_STATES.SPEAKING
            ? 5
            : 0;

      const motionBoost = computedMotion > 55 ? 20 : computedMotion > 28 ? 12 : 4;
      const faceBoost = faceCount > 0 ? 14 : -6;

      const computedEngagement = clamp(
        Math.round(computedAttention * 0.45 + motionBoost + stateBoost + faceBoost),
        0,
        100
      );

      setEngagementScore(computedEngagement);

      let nextReaction = 'Calm';
      let tone = 'safe';

      if (faceCount === 0 && missingFaceFramesRef.current > 2) {
        nextReaction = 'Face Not Visible';
        tone = 'warn';
      } else if (state.status === APP_STATES.CRISIS) {
        nextReaction = 'High Distress';
        tone = 'critical';
      } else if (state.status === APP_STATES.CONCERN && computedMotion > 35) {
        nextReaction = 'Elevated Stress';
        tone = 'warn';
      } else if (computedMotion > 60) {
        nextReaction = 'High Activation';
        tone = 'warn';
      } else if (computedMotion > 26) {
        nextReaction = 'Engaged';
        tone = 'safe';
      }

      setReaction(nextReaction);
      setLastUpdated(new Date());

      const now = Date.now();
      if (now - lastSampleAtRef.current > 2800) {
        lastSampleAtRef.current = now;
        dispatch({
          type: 'ADD_REACTION_SAMPLE',
          payload: {
            id: `${now}-${Math.random().toString(16).slice(2)}`,
            timestamp: now,
            attention: computedAttention,
            engagement: computedEngagement,
            motion: Math.round(computedMotion),
            luminance: Math.round(avgLuminance),
            reaction: nextReaction,
            facesDetected: faceCount,
            status: state.status,
          },
        });
      }

      if (currentReactionRef.current !== nextReaction) {
        currentReactionRef.current = nextReaction;
        pushEvent(nextReaction, `Attention ${computedAttention}% · Motion ${Math.round(computedMotion)}%`, tone);
      }

      if (faceCount === 0 && missingFaceFramesRef.current === 3) {
        pushEvent('No face detected', 'Adjust camera angle or room lighting.', 'warn');
      }
    } finally {
      analyzingRef.current = false;
    }
  }, [dispatch, pushEvent, state.status]);

  const startTracking = useCallback(async () => {
    if (streamRef.current || permission === 'requesting') {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setPermission('error');
      setErrorMessage('Camera API not available in this browser.');
      pushEvent('Camera unsupported', 'Use a modern Chromium browser for full tracker support.', 'critical');
      return;
    }

    setErrorMessage('');
    setPermission('requesting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 960 },
          height: { ideal: 540 },
          frameRate: { ideal: 24, max: 30 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      if (typeof window !== 'undefined' && 'FaceDetector' in window) {
        try {
          detectorRef.current = new window.FaceDetector({ maxDetectedFaces: 1, fastMode: true });
        } catch {
          detectorRef.current = null;
        }
      } else {
        detectorRef.current = null;
      }

      setPermission('granted');
      setStreamActive(true);
      lastSampleAtRef.current = 0;
      pushEvent('Camera tracking started', 'Reaction inference runs locally on this device.', 'safe');

      frameTimerRef.current = setInterval(() => {
        analyzeFrame();
      }, 900);

      analyzeFrame();
    } catch (error) {
      const denied = error?.name === 'NotAllowedError' || error?.name === 'SecurityError';
      setPermission(denied ? 'denied' : 'error');
      setStreamActive(false);
      setErrorMessage(error?.message || 'Unable to access camera stream.');
      pushEvent(
        denied ? 'Camera access denied' : 'Camera startup failed',
        denied ? 'Grant browser camera permission to enable tracking.' : 'Check camera device availability.',
        'critical'
      );
    }
  }, [analyzeFrame, permission, pushEvent]);

  const retryTracking = useCallback(() => {
    setPermission('idle');
    setErrorMessage('');
  }, []);

  useEffect(() => {
    if (!state.isCameraActive) {
      stopTracking();
      setPermission('idle');
      return;
    }

    if (permission === 'idle') {
      startTracking();
    }
  }, [permission, startTracking, state.isCameraActive, stopTracking]);

  useEffect(() => () => stopTracking(), [stopTracking]);

  return {
    videoRef,
    permission,
    streamActive,
    facesDetected,
    attentionScore,
    engagementScore,
    motionLevel,
    luminance,
    reaction,
    lastUpdated,
    faceBox,
    events,
    errorMessage,
    retryTracking,
  };
};

export default useReactionTracker;
