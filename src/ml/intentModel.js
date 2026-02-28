const DEFAULT_INTENTS = [
  'anxiety',
  'overwhelm',
  'sadness',
  'self_worth',
  'anger',
  'sleep',
  'focus',
  'relationship',
  'motivation',
  'general',
];

const DEFAULT_DOMAINS = ['student', 'work', 'relationship', 'general'];

const SEED_SAMPLES = [
  { intent: 'anxiety', text: 'I feel anxious and my chest is tight' },
  { intent: 'anxiety', text: 'my mind keeps racing and I am worried' },
  { intent: 'anxiety', text: 'I feel panic and fear right now' },
  { intent: 'anxiety', text: 'how do I calm anxiety quickly' },

  { intent: 'overwhelm', text: 'everything feels too much and I cannot cope' },
  { intent: 'overwhelm', text: 'I am overwhelmed by work and responsibilities' },
  { intent: 'overwhelm', text: 'I am burning out and mentally overloaded' },
  { intent: 'overwhelm', text: 'how to handle overload and pressure' },

  { intent: 'sadness', text: 'I feel sad and lonely' },
  { intent: 'sadness', text: 'I feel empty and hopeless today' },
  { intent: 'sadness', text: 'I cannot stop crying and feel low' },
  { intent: 'sadness', text: 'how do I deal with grief and sadness' },

  { intent: 'self_worth', text: 'I feel like a failure and not enough' },
  { intent: 'self_worth', text: 'I feel worthless and useless' },
  { intent: 'self_worth', text: 'I keep doubting myself and my value' },
  { intent: 'self_worth', text: 'how to improve confidence and self worth' },

  { intent: 'anger', text: 'I am angry and frustrated' },
  { intent: 'anger', text: 'I am irritated and losing my temper' },
  { intent: 'anger', text: 'I feel mad about what happened' },
  { intent: 'anger', text: 'how do I calm anger before reacting' },

  { intent: 'sleep', text: 'I am exhausted and cannot sleep well' },
  { intent: 'sleep', text: 'I feel tired and drained every day' },
  { intent: 'sleep', text: 'I have insomnia and my sleep is broken' },
  { intent: 'sleep', text: 'how can I improve my sleep tonight' },

  { intent: 'focus', text: 'I cannot focus and keep procrastinating' },
  { intent: 'focus', text: 'I am distracted and stuck on tasks' },
  { intent: 'focus', text: 'my attention keeps drifting and I delay work' },
  { intent: 'focus', text: 'how do I focus when my mind is scattered' },

  { intent: 'relationship', text: 'I had a fight with my partner' },
  { intent: 'relationship', text: 'my family conflict is stressing me out' },
  { intent: 'relationship', text: 'I feel hurt in this relationship' },
  { intent: 'relationship', text: 'how do I communicate in conflict better' },

  { intent: 'motivation', text: 'I need motivation to keep going' },
  { intent: 'motivation', text: 'I cannot stay consistent with my goals' },
  { intent: 'motivation', text: 'I want discipline and productive habits' },
  { intent: 'motivation', text: 'how can I build motivation and momentum' },

  { intent: 'general', text: 'I need support right now' },
  { intent: 'general', text: 'can we talk for a minute' },
  { intent: 'general', text: 'I am not sure what I am feeling' },
  { intent: 'general', text: 'help me think clearly' },
];

const DOMAIN_SAMPLES = [
  { intent: 'student', text: 'I am stressed about exams and grades' },
  { intent: 'student', text: 'I cannot keep up with assignments and deadlines' },
  { intent: 'student', text: 'I am anxious about school performance' },
  { intent: 'student', text: 'how do I study consistently and avoid procrastination' },
  { intent: 'student', text: 'my classes are overwhelming and I feel behind' },

  { intent: 'work', text: 'I am burned out at work and overloaded with tasks' },
  { intent: 'work', text: 'my manager pressure is too high and I feel stressed' },
  { intent: 'work', text: 'I have too many meetings and cannot focus' },
  { intent: 'work', text: 'how do I manage workplace stress and deadlines' },
  { intent: 'work', text: 'I am exhausted from office workload and performance expectations' },

  { intent: 'relationship', text: 'I had a conflict with my partner and feel hurt' },
  { intent: 'relationship', text: 'family arguments are affecting my mental health' },
  { intent: 'relationship', text: 'communication problems in my relationship are stressing me out' },
  { intent: 'relationship', text: 'how do I set boundaries with people I care about' },
  { intent: 'relationship', text: 'friendship tension is making me anxious and lonely' },

  { intent: 'general', text: 'I need general emotional support right now' },
  { intent: 'general', text: 'I am not sure what category this problem fits' },
  { intent: 'general', text: 'help me calm down and think clearly' },
  { intent: 'general', text: 'I need guidance for my mental health today' },
];

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'am', 'and', 'or', 'to', 'for', 'of', 'in', 'on', 'it', 'this', 'that', 'i', 'im',
  'my', 'me', 'you', 'your', 'we', 'our', 'us', 'do', 'did', 'does', 'can', 'could', 'should', 'would', 'how', 'what',
  'why', 'when', 'with', 'at', 'be', 'been', 'have', 'has', 'had', 'feel', 'feeling', 'right', 'now', 'today', 'very',
]);

const tokenize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

class NaiveBayesIntentModel {
  constructor(intents = DEFAULT_INTENTS, alpha = 1) {
    this.intents = intents;
    this.alpha = alpha;
    this.vocabulary = new Set();
    this.classDocCounts = Object.fromEntries(intents.map((intent) => [intent, 0]));
    this.classTokenCounts = Object.fromEntries(intents.map((intent) => [intent, {}]));
    this.classTotalTokens = Object.fromEntries(intents.map((intent) => [intent, 0]));
    this.totalDocs = 0;
  }

  trainExample(text, intent) {
    if (!this.intents.includes(intent)) {
      return;
    }

    const tokens = tokenize(text);

    this.classDocCounts[intent] += 1;
    this.totalDocs += 1;

    tokens.forEach((token) => {
      this.vocabulary.add(token);
      this.classTokenCounts[intent][token] = (this.classTokenCounts[intent][token] || 0) + 1;
      this.classTotalTokens[intent] += 1;
    });
  }

  trainBatch(samples) {
    samples.forEach((sample) => {
      this.trainExample(sample.text, sample.intent);
    });
  }

  predict(text) {
    const tokens = tokenize(text);

    const vocabSize = Math.max(this.vocabulary.size, 1);
    const logScores = this.intents.map((intent) => {
      const prior = (this.classDocCounts[intent] + this.alpha) / (this.totalDocs + this.alpha * this.intents.length);
      const tokenMap = this.classTokenCounts[intent];
      const tokenDenominator = this.classTotalTokens[intent] + this.alpha * vocabSize;

      let score = Math.log(prior);
      tokens.forEach((token) => {
        const tokenCount = tokenMap[token] || 0;
        score += Math.log((tokenCount + this.alpha) / tokenDenominator);
      });

      return { intent, score };
    });

    const maxScore = Math.max(...logScores.map((entry) => entry.score));
    const expScores = logScores.map((entry) => ({
      intent: entry.intent,
      probability: Math.exp(entry.score - maxScore),
    }));

    const totalProb = expScores.reduce((sum, entry) => sum + entry.probability, 0) || 1;
    const normalized = expScores
      .map((entry) => ({
        intent: entry.intent,
        probability: entry.probability / totalProb,
      }))
      .sort((a, b) => b.probability - a.probability);

    return {
      topIntent: normalized[0]?.intent || 'general',
      confidence: Math.round((normalized[0]?.probability || 0) * 100),
      rankedIntents: normalized,
      tokenCount: tokens.length,
    };
  }

  getTrainingSummary() {
    return {
      totalDocs: this.totalDocs,
      vocabularySize: this.vocabulary.size,
    };
  }
}

export const createTrainedIntentModel = () => {
  const model = new NaiveBayesIntentModel();
  model.trainBatch(SEED_SAMPLES);
  return model;
};

export const createTrainedDomainModel = () => {
  const model = new NaiveBayesIntentModel(DEFAULT_DOMAINS);
  model.trainBatch(DOMAIN_SAMPLES);
  return model;
};

export { NaiveBayesIntentModel, tokenize, SEED_SAMPLES, DEFAULT_INTENTS, DOMAIN_SAMPLES, DEFAULT_DOMAINS };
