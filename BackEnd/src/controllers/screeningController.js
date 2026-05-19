const Assessment = require("../models/Assessment");
const Patient = require("../models/Patient");
const User = require("../models/User");
const { createAlert } = require("./alertController");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Guardrail: Ensure API key exists before boot
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ CRITICAL: GEMINI_API_KEY is missing in your .env configuration!");
}

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const normalizeLocation = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const normalizeLocationText = (value = "") => normalizeLocation(value).join(" ");

const getLocationScore = (doctor, patient) => {
  const patientLocation = normalizeLocationText(patient?.location || patient?.city || "");
  const patientCity = normalizeLocationText(patient?.city || "");
  const patientTokens = normalizeLocation(`${patient?.city || ""} ${patient?.location || ""}`)
    .filter(token => token.length > 2 && !["city", "near", "area", "clinic", "hospital"].includes(token));
  if (!patientLocation && !patientCity && !patientTokens.length) return 0;

  const doctorTokens = normalizeLocation(`${doctor.city || ""} ${doctor.location || ""} ${doctor.clinic || ""}`);
  if (!doctorTokens.length) return 0;

  const doctorText = doctorTokens.join(" ");
  let score = 0;
  if (patientLocation && doctorText.includes(patientLocation)) score += 3;
  if (patientCity && doctorText.includes(patientCity)) score += 3;
  const matchedTokens = patientTokens.filter(token => doctorTokens.includes(token) || doctorText.includes(token));
  return score + matchedTokens.length;
};

const selectRecommendedDoctor = async (patient) => {
  const doctors = await User.find({ role: "doctor" }).sort({ createdAt: 1 }).lean();
  if (!doctors.length) return null;

  const rankedDoctors = doctors
    .map((doctor, index) => ({
      doctor,
      index,
      locationScore: getLocationScore(doctor, patient)
    }))
    .sort((a, b) => b.locationScore - a.locationScore || a.index - b.index);

  const { doctor, locationScore } = rankedDoctors[0];
  if (!doctor) return null;

  return {
    id: doctor._id,
    name: doctor.fullName || "Assigned Doctor",
    specialty: doctor.specialization || "Cognitive Care Specialist",
    contact: doctor.phone || "",
    email: doctor.email || "",
    clinic: doctor.clinic || "",
    location: doctor.location || doctor.city || "",
    isNearby: locationScore > 0,
    matchScore: locationScore,
    availabilityNote: locationScore > 0
      ? "Nearby doctor matched from patient location."
      : "No nearby doctor found. This available doctor can be visited for consultation."
  };
};

/**
 * Advanced JSON Extractor: Extracts valid JSON content even if Gemini 
 * accidentally wraps it in markdown blocks or loose prose text.
 */
const cleanAndExtractJson = (rawText) => {
  if (!rawText) return "";
  let text = rawText.trim();
  
  // 1. Remove markdown fences if present
  if (text.startsWith("```")) {
    text = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
  }
  
  // 2. Fallback: Isolate content between the first '{' and last '}'
  const startIdx = text.indexOf("{");
  const endIdx = text.lastIndexOf("}");
  
  if (startIdx !== -1 && endIdx !== -1) {
    return text.substring(startIdx, endIdx + 1);
  }
  
  return text;
};

const buildDailyClinicalFallbackTest = (seedText = "") => {
  const seed = [...seedText].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const pick = (items, count) => {
    const rotated = items.map((item, index) => ({ item, rank: (index * 37 + seed) % 997 }))
      .sort((a, b) => a.rank - b.rank)
      .map(entry => entry.item);
    return rotated.slice(0, count);
  };

  const clinicalQuestions = [
    {
      id: "m1",
      domain: "orientation",
      question: "Without looking at a calendar, which part of the day is it right now?",
      options: ["Morning or afternoon", "The middle of the night", "I am not sure"],
      correct: "Morning or afternoon"
    },
    {
      id: "m2",
      domain: "delayed_recall",
      question: "Please remember these words: lemon, key, river. Which set matches the three words?",
      options: ["lemon, key, river", "lemon, door, river", "orange, key, garden"],
      correct: "lemon, key, river"
    },
    {
      id: "m3",
      domain: "attention",
      question: "If you start at 20 and count backward by 3, what comes next?",
      options: ["17", "18", "16"],
      correct: "17"
    },
    {
      id: "m4",
      domain: "executive_function",
      question: "If you need tea, a cup, and hot water, what should you do first?",
      options: ["Put tea in the cup", "Drink before adding water", "Leave the cup in another room"],
      correct: "Put tea in the cup"
    },
    {
      id: "m5",
      domain: "language",
      question: "Which word best names something used to tell time?",
      options: ["Clock", "Spoon", "Pillow"],
      correct: "Clock"
    },
    {
      id: "m6",
      domain: "visuospatial",
      question: "If a clock's minute hand points to 12 and hour hand points to 3, what time is it?",
      options: ["3 o'clock", "12 o'clock", "6 o'clock"],
      correct: "3 o'clock"
    },
    {
      id: "m7",
      domain: "judgment",
      question: "If you smell smoke in the kitchen, what is the safest first action?",
      options: ["Turn off the stove and call for help", "Ignore it", "Open medicine bottles"],
      correct: "Turn off the stove and call for help"
    }
  ];

  const behaviorQuestions = [
    { id: "b1", question: "In the last week, have you misplaced familiar items in unusual places?", options: ["Never", "Sometimes", "Often"] },
    { id: "b2", question: "In the last week, have you repeated the same question without realizing it?", options: ["Never", "Sometimes", "Often"] },
    { id: "b3", question: "In the last week, have you felt unsure about the date, day, or routine?", options: ["Never", "Sometimes", "Often"] },
    { id: "b4", question: "In the last week, have you found familiar tasks harder to finish in the right order?", options: ["Never", "Sometimes", "Often"] },
    { id: "b5", question: "In the last week, have family members noticed changes in your memory or attention?", options: ["Never", "Sometimes", "Often"] },
    { id: "b6", question: "In the last week, have you had trouble finding common words while speaking?", options: ["Never", "Sometimes", "Often"] }
  ];

  return {
    voicePhrase: "Today I will calmly remember the small blue cup near the window.",
    cognitiveGame: pick([0, 1, 2, 3, 4, 5, 6, 7, 8], 4),
    memoryQuestions: pick(clinicalQuestions, 5).map((question, index) => ({ ...question, id: `m${index + 1}` })),
    behaviorQuestions: pick(behaviorQuestions, 5).map((question, index) => ({ ...question, id: `b${index + 1}` }))
  };
};

const validateGeneratedTest = (testData) => {
  if (!testData || typeof testData !== "object") return false;
  if (!testData.voicePhrase || typeof testData.voicePhrase !== "string") return false;
  if (!Array.isArray(testData.cognitiveGame) || testData.cognitiveGame.length < 3 || testData.cognitiveGame.length > 4) return false;
  if (!Array.isArray(testData.memoryQuestions) || testData.memoryQuestions.length !== 5) return false;
  if (!Array.isArray(testData.behaviorQuestions) || testData.behaviorQuestions.length !== 5) return false;

  return testData.memoryQuestions.every(q => q.id && q.question && Array.isArray(q.options) && q.options.length === 3 && q.correct)
    && testData.behaviorQuestions.every(q => q.id && q.question && Array.isArray(q.options) && q.options.length === 3);
};

const clampScore = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number(value) || 0)));

const buildClinicalScreeningScore = ({ speechDuration, gameScore, gameTimeSec, memoryAnswer, behaviorAnswer }) => {
  const memoryAnswers = memoryAnswer?.answers || memoryAnswer || {};
  const memoryQuestions = Array.isArray(memoryAnswer?.questions) ? memoryAnswer.questions : [];
  const answeredMemory = Object.keys(memoryAnswers).length;
  const correctMemory = memoryQuestions.length
    ? memoryQuestions.filter(question => memoryAnswers[question.id] === question.correct).length
    : answeredMemory;

  const voiceDuration = Number(speechDuration || 0);
  const voice = voiceDuration <= 0
    ? 8
    : voiceDuration < 2
      ? 12
      : voiceDuration <= 20
        ? 22
        : 16;

  const speedPenalty = Number(gameTimeSec || 0) > 15 ? 3 : Number(gameTimeSec || 0) > 10 ? 1 : 0;
  const game = clampScore((Number(gameScore || 0) / 100) * 25 - speedPenalty, 0, 25);
  const memory = clampScore((correctMemory / Math.max(memoryQuestions.length || 5, 1)) * 25, 0, 25);

  const behaviorValues = Object.values(behaviorAnswer || {});
  const behaviorPenalty = behaviorValues.reduce((sum, answer) => {
    const normalized = String(answer).toLowerCase();
    if (normalized.includes("often")) return sum + 5;
    if (normalized.includes("sometimes")) return sum + 2;
    return sum;
  }, 0);
  const behavior = clampScore(25 - behaviorPenalty, 0, 25);
  const total = clampScore(voice + game + memory + behavior);

  const risk = total < 50 ? "High" : total < 75 ? "Moderate" : "Low";
  const breakdown = {
    memory: clampScore((memory / 25) * 100),
    language: clampScore((voice / 25) * 100),
    attention: clampScore(((game + memory) / 50) * 100),
    spatial: clampScore((game / 25) * 100),
    logic: clampScore(((memory + behavior) / 50) * 100),
    behavior: clampScore((behavior / 25) * 100)
  };

  return {
    total,
    risk,
    phaseScores: { voice, game, memory, behavior },
    clinicalRiskScore: clampScore(100 - total),
    breakdown,
    correctMemory,
    answeredMemory
  };
};

// @desc    Generate Unique Dynamic Multi-Modal Test Questions for Patient Self-Assessment
// @route   GET /api/assessments/generate-dynamic-test
const generateDynamicTest = async (req, res) => {
  try {
    const langCode = req.query.lang || 'en';
    const patientId = req.query.patientId;
    const patientAge = Number(req.query.age || 65);
    
    // Map language codes to names for the AI
    const langMap = {
      'en': 'English',
      'hi': 'Hindi (in Devanagari script)',
      'pa': 'Punjabi',
      'bn': 'Bengali',
      'ta': 'Tamil',
      'te': 'Telugu',
      'mr': 'Marathi',
      'gu': 'Gujarati',
      'kn': 'Kannada',
      'ml': 'Malayalam',
      'ur': 'Urdu'
    };
    const lang = langMap[langCode] || 'English';
    const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric', weekday: 'long' });
    const dailySeed = `${new Date().toLocaleDateString('en-CA')}|${req.user.id}|${patientId || "no-patient"}|${langCode}`;
    const patient = patientId
      ? await Patient.findOne({ _id: patientId, userId: req.user.id }).lean()
      : null;

    const systemInstruction = `
    You are a senior clinical neurologist and neuro-geriatrician creating a brief digital screening module for early-stage dementia risk.
    The patient is taking this test ALONE on a screen. Every question must be direct, clear, and easy to interact with.

    CRITICAL CLINICAL GUIDELINES:
    1. This is a SCREENING tool, not a diagnosis. Questions should detect early cognitive change and support referral decisions.
    2. Questions must be suitable for an older adult around age ${patient?.age || patientAge || 65}; avoid advanced education, trivia, politics, math puzzles, and culturally narrow facts.
    3. The 5 memoryQuestions must cover five different clinical domains used in early dementia screening:
       - orientation to time or situation,
       - attention / working memory,
       - delayed recall or learning of simple words,
       - language / naming / comprehension,
       - executive function / judgment / sequencing.
    4. Questions should feel like a neurologist or memory-clinic doctor would ask in a brief screen. Use everyday tasks, time awareness, recall, safety judgment, naming, and simple sequencing.
    5. Every memory question must have exactly one clinically correct answer and two plausible incorrect choices.
    6. Do not ask generic trivia such as capital cities, colors of the sky, fruit identification, celebrity names, or school-style GK questions.
    7. Daily uniqueness is mandatory. Use this seed to vary today's question set and wording: ${dailySeed}. Do not repeat the exact examples or wording from previous days.
    8. The generated content must be in the language: ${lang}. If Hindi, use clear Devanagari script.
    9. Today's date is: ${today}. If you ask orientation questions about the current day, month, season, or year, you MUST use this information and ensure the correct answer is among the options and marked correctly.

    CRITICAL GENERATION METRICS:
    1. voicePhrase: A simple, comforting sentence in ${lang} with mixed consonant sounds and natural rhythm to screen articulation, fluency, and speech planning.
    2. cognitiveGame: An array of exactly 3 or 4 unique indices (0 to 8) for a 3x3 grid pattern.
    3. memoryQuestions: Exactly 5 direct patient-facing clinical screening questions, in ${lang}, with 3 options each and one correct option.
    4. behaviorQuestions: 5 self-awareness questions about symptoms from the last 7 days, in ${lang}, with options corresponding to: ["Never", "Sometimes", "Often"].

    Return strictly a valid JSON object matching the exact schema requested. Do not include markdown wraps.
    `;

    const prompt = `
    Generate today's unique patient-facing early dementia screening payload in ${lang}.
    Patient context:
    - Patient name: ${patient?.name || "Patient"}
    - Patient age: ${patient?.age || patientAge || "unknown"}
    - Daily seed: ${dailySeed}

    Follow this exact structural JSON schema:
    {
      "voicePhrase": "Clear string for the patient to read aloud.",
      "cognitiveGame": [1, 5, 8],
      "memoryQuestions": [
        { "id": "m1", "domain": "orientation", "question": "Question text...", "options": ["Opt1", "Opt2", "Opt3"], "correct": "Opt1" },
        { "id": "m2", "domain": "attention", "question": "Question text...", "options": ["Opt1", "Opt2", "Opt3"], "correct": "Opt2" },
        { "id": "m3", "domain": "delayed_recall", "question": "Question text...", "options": ["Opt1", "Opt2", "Opt3"], "correct": "Opt3" },
        { "id": "m4", "domain": "language", "question": "Question text...", "options": ["Opt1", "Opt2", "Opt3"], "correct": "Opt1" },
        { "id": "m5", "domain": "executive_function", "question": "Question text...", "options": ["Opt1", "Opt2", "Opt3"], "correct": "Opt2" }
      ],
      "behaviorQuestions": [
        { "id": "b1", "question": "Self-awareness question text...", "options": ["Never", "Sometimes", "Often"] },
        { "id": "b2", "question": "Self-awareness question text...", "options": ["Never", "Sometimes", "Often"] },
        { "id": "b3", "question": "Self-awareness question text...", "options": ["Never", "Sometimes", "Often"] },
        { "id": "b4", "question": "Self-awareness question text...", "options": ["Never", "Sometimes", "Often"] },
        { "id": "b5", "question": "Self-awareness question text...", "options": ["Never", "Sometimes", "Often"] }
      ]
    }`;

    let response;
    let rawText;
    
    try {
      const model = ai.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: systemInstruction 
      });
      response = await model.generateContent(prompt);
      // FIXED: Await response text compilation to guard async framework pipelines
      rawText = await response.response.text();
    } catch (apiError) {
      console.warn("Gemini 2.5 Flash failed or busy. Falling back to Gemini Pro...", apiError.message);
      try {
        const fallbackModel = ai.getGenerativeModel({ 
          model: "gemini-pro",
          systemInstruction: systemInstruction 
        });
        response = await fallbackModel.generateContent(prompt);
        rawText = await response.response.text();
      } catch (geminiProError) {
        console.warn("Gemini Pro failed too. Falling back to Groq...", geminiProError.message);
        
        try {
          if (!process.env.GROK_API_KEY) throw new Error("GROK_API_KEY is missing (used for Groq)");
          const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.GROK_API_KEY}`
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt }
              ]
            })
          });
          const groqData = await groqResponse.json();
          if (!groqResponse.ok) throw new Error(groqData.error?.message || "Groq API error");
          rawText = groqData.choices[0].message.content;
        } catch (groqError) {
          console.warn("Groq failed too. Falling back to OpenRouter...", groqError.message);
          
          try {
            if (!process.env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is missing");
            const openrouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "https://smriti-ai.com",
                "X-Title": "Smriti AI"
              },
              body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                  { role: "system", content: systemInstruction },
                  { role: "user", content: prompt }
                ]
              })
            });
            const openrouterData = await openrouterResponse.json();
            if (!openrouterResponse.ok) throw new Error(openrouterData.error?.message || "OpenRouter API error");
            rawText = openrouterData.choices[0].message.content;
          } catch (openrouterError) {
            console.error("All AI services failed in generateDynamicTest.", openrouterError.message);
            throw openrouterError;
          }
        }
      }
    }
    const cleanedJson = cleanAndExtractJson(rawText);
    
    try {
      const dynamicTestData = JSON.parse(cleanedJson);
      if (!validateGeneratedTest(dynamicTestData)) {
        throw new Error("Generated test did not match clinical screening schema.");
      }
      return res.status(200).json({
        success: true,
        testData: dynamicTestData
      });
    } catch (parseError) {
      console.error("🚨 Gemini JSON Parsing Failed. Raw Output was:\n", rawText);
      return res.status(200).json({
        success: true,
        testData: buildDailyClinicalFallbackTest(dailySeed),
        message: "AI returned an invalid schema. Loaded today's clinical fallback screen."
      });
    }

  } catch (error) {
    console.error("Dynamic test generation orchestration error:", error);
    
    const staticTestData = buildDailyClinicalFallbackTest(`${new Date().toLocaleDateString('en-CA')}|${req.user?.id || ""}|${req.query.patientId || ""}|${req.query.lang || "en"}`);

    return res.status(200).json({
      success: true,
      testData: staticTestData,
      message: "AI was busy. Loaded standard clinical fallback test."
    });
  }
};

// @desc    High-Accuracy Multi-Modal AI Fusion Evaluation
// @route   POST /api/assessments/high-accuracy-eval
const evaluateHighAccuracyTest = async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const { 
    patientId, 
    patientAge, 
    speechDuration, 
    memoryAnswer, 
    behaviorAnswer, 
    gameScore,
    gameTimeSec 
  } = req.body;

  const today = new Date().toLocaleDateString('en-CA');

  try {
    if (!userId) {
      return res.status(401).json({ success: false, message: "User context not identified." });
    }
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingAssessment = await Assessment.findOne({
      patientId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingAssessment) {
      return res.status(400).json({
        success: false,
        message: "An assessment has already been completed for this patient today."
      });
    }

    const targetPatient = await Patient.findOne({ _id: patientId, userId });
    if (!targetPatient) {
      return res.status(404).json({
        success: false,
        message: "Target patient tracking profile not found."
      });
    }

    const deterministicScore = buildClinicalScreeningScore({
      speechDuration,
      gameScore,
      gameTimeSec,
      memoryAnswer,
      behaviorAnswer
    });

    const systemInstruction = `
    You are a senior expert neuro-geriatrician evaluating a patient's digital multi-modal cognitive self-assessment.
    Analyze the incoming parameters derived dynamically to trace signals of early-stage cognitive degradation, memory gaps, or speech markers.
    Calculate an absolute clinical risk index from 0 to 100%. 
    Focus extensively on delivering a profile layout that eliminates language bias and outlines strong protective digital safety nets.
    You MUST respond strictly with a valid JSON string object match.
    `;

    // FIXED: Clean validation checking if input parameters are already parsed objects or strings
    const stringifiedMemory = typeof memoryAnswer === 'object' ? JSON.stringify(memoryAnswer) : memoryAnswer;
    const stringifiedBehavior = typeof behaviorAnswer === 'object' ? JSON.stringify(behaviorAnswer) : behaviorAnswer;
    const prompt = `
    Evaluate the following clinical self-assessment metrics for the patient:
    - Patient Age: ${patientAge}
    - Visual Memory Pattern Recall Score: ${gameScore}/100
    - Pattern Recall Match Speed: ${gameTimeSec} seconds
    - Vocal Reading Track Duration: ${speechDuration} seconds
    - Patient Memory Test Logging Matrix: ${stringifiedMemory}
    - Patient Emotional Self-Awareness Tracking: ${stringifiedBehavior}
 
    Generate a complete report matching this exact structural schema. 
    CRITICAL: You must independently calculate a score for each of the 4 phases of the test out of 25 marks each (summing up to a max of 100).
    Ensure you generate 3 to 5 highly specific, actionable, and personalized 'recommendations' based on the patient's performance in the evaluation:
    {
      "phaseScores": {
        "voice": 20,
        "game": 15,
        "memory": 22,
        "behavior": 18
      },
      "clinicalRiskScore": 34,
      "riskLevel": "Low Risk",
      "breakdown": {
        "memory": 85,
        "language": 92,
        "attention": 78,
        "spatial": 88,
        "logic": 74,
        "behavior": 80
      },
      "clinicalSummary": "Detailed diagnostics text highlighting language-bias elimination and preventative care safety nets.",
      "recommendations": [
        { "icon": "💧", "color": "#3B82F6", "priority": "Daily Habit", "text": "Ensure patient drinks at least 1.5 liters of water daily." }
      ]
    }`;

    let response;
    let rawText;
    
    try {
      const model = ai.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: systemInstruction 
      });
      response = await model.generateContent(prompt);
      // FIXED: Added await for text extraction to stop payload stream breaks
      rawText = await response.response.text();
    } catch (apiError) {
      console.warn("Gemini 2.5 Flash failed or busy. Falling back to Gemini Pro...", apiError.message);
      try {
        const fallbackModel = ai.getGenerativeModel({ 
          model: "gemini-pro",
          systemInstruction: systemInstruction 
        });
        response = await fallbackModel.generateContent(prompt);
        rawText = await response.response.text();
      } catch (geminiProError) {
        console.warn("Gemini Pro failed too. Falling back to Groq...", geminiProError.message);
        
        try {
          if (!process.env.GROK_API_KEY) throw new Error("GROK_API_KEY is missing (used for Groq)");
          const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.GROK_API_KEY}`
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt }
              ]
            })
          });
          const groqData = await groqResponse.json();
          if (!groqResponse.ok) throw new Error(groqData.error?.message || "Groq API error");
          rawText = groqData.choices[0].message.content;
        } catch (groqError) {
          console.warn("Groq failed too. Falling back to OpenRouter...", groqError.message);
          
          try {
            if (!process.env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is missing");
            const openrouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "https://smriti-ai.com",
                "X-Title": "Smriti AI"
              },
              body: JSON.stringify({
                model: "openai/gpt-4o",
                messages: [
                  { role: "system", content: systemInstruction },
                  { role: "user", content: prompt }
                ]
              })
            });
            const openrouterData = await openrouterResponse.json();
            if (!openrouterResponse.ok) throw new Error(openrouterData.error?.message || "OpenRouter API error");
            rawText = openrouterData.choices[0].message.content;
          } catch (openrouterError) {
            console.error("All AI services failed in evaluateHighAccuracyTest.", openrouterError.message);
            throw openrouterError;
          }
        }
      }
    }
    const cleanedJson = cleanAndExtractJson(rawText);

    let evaluationReport;
    try {
      evaluationReport = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("🚨 Gemini Evaluation Parsing Failed. Raw Output was:\n", rawText);
      console.warn("Falling back to standard fallback report due to parsing failure.");
      
      const legacyCalculatedScore = req.body.gameScore || 50;
      let risk = "Low";
      if (legacyCalculatedScore < 50) risk = "High";
      else if (legacyCalculatedScore < 75) risk = "Moderate";

      evaluationReport = {
        "clinicalRiskScore": 100 - legacyCalculatedScore,
        "riskLevel": risk + " Risk",
        "breakdown": {
          "memory": legacyCalculatedScore,
          "language": legacyCalculatedScore,
          "attention": legacyCalculatedScore,
          "spatial": legacyCalculatedScore,
          "logic": legacyCalculatedScore,
          "behavior": legacyCalculatedScore
        },
        "clinicalSummary": "Fallback report generated due to AI payload parsing failure.",
        "recommendations": [
          { "icon": "💧", "color": "#3B82F6", "priority": "Daily Habit", "text": "Ensure patient drinks at least 1.5 liters of water daily." }
        ]
      };
    }

    evaluationReport.phaseScores = deterministicScore.phaseScores;
    evaluationReport.clinicalRiskScore = deterministicScore.clinicalRiskScore;
    evaluationReport.riskLevel = `${deterministicScore.risk} Risk`;
    evaluationReport.breakdown = {
      ...(evaluationReport.breakdown || {}),
      ...deterministicScore.breakdown
    };
    evaluationReport.screeningBasis = {
      method: "Deterministic clinical screening score with AI narrative support",
      correctMemory: deterministicScore.correctMemory,
      answeredMemory: deterministicScore.answeredMemory,
      note: "This is not a diagnosis. It flags possible cognitive risk for clinical review."
    };

    const legacyCalculatedScore = deterministicScore.total;
    let risk = deterministicScore.risk;

    let trend = legacyCalculatedScore < 70 ? "down" : "stable";
    const recommendedDoctor = risk === "High" || risk === "Moderate"
      ? await selectRecommendedDoctor(targetPatient)
      : null;

    if (recommendedDoctor) {
      evaluationReport.recommendedDoctors = [recommendedDoctor];
      evaluationReport.actionRequired = risk === "High"
        ? (recommendedDoctor.isNearby ? "Immediate consultation recommended with a nearby specialist." : "No nearby doctor found. Please visit the suggested available specialist.")
        : (recommendedDoctor.isNearby ? "Specialist follow-up recommended with a nearby doctor." : "No nearby doctor found. Please visit the suggested available doctor.");
      evaluationReport.nearbyDoctorAvailable = recommendedDoctor.isNearby;
    } else {
      evaluationReport.recommendedDoctors = [];
      evaluationReport.actionRequired = risk === "Low"
        ? "Routine check-up in 6 months."
        : "Clinical referral recommended. Add a doctor account to enable referral assignment.";
      evaluationReport.nearbyDoctorAvailable = false;
    }

    // Write assessment payload straight into database
    const newAssessment = await Assessment.create({
      userId,
      patientId,
      score: legacyCalculatedScore,
      riskLevel: risk,
      details: {
        ...req.body,
        aiReport: evaluationReport
      }
    });

    const patientUpdate = { 
        score: legacyCalculatedScore, 
        risk, 
        trend, 
        lastTestDate: today,
        recommendations: evaluationReport.recommendations || []
      };

    if (recommendedDoctor) {
      patientUpdate.assignedDoctorId = recommendedDoctor.id;
      patientUpdate.assignedDoctorName = recommendedDoctor.name;
      patientUpdate.assignedDoctorSpecialty = recommendedDoctor.specialty;
      patientUpdate.assignedDoctorLocation = recommendedDoctor.location;
      patientUpdate.doctor = recommendedDoctor.name;
      patientUpdate.doctorRecommendationReason = evaluationReport.actionRequired;
      patientUpdate.doctorReferralStatus = "assigned";
      patientUpdate.doctorAssignedAt = new Date();
    } else if (risk === "Low") {
      patientUpdate.assignedDoctorId = null;
      patientUpdate.assignedDoctorName = "";
      patientUpdate.assignedDoctorSpecialty = "";
      patientUpdate.assignedDoctorLocation = "";
      patientUpdate.doctor = "";
      patientUpdate.doctorRecommendationReason = "";
      patientUpdate.doctorReferralStatus = "none";
    }

    const updatedPatient = await Patient.findOneAndUpdate(
      { _id: patientId, userId },
      patientUpdate,
      { returnDocument: 'after' }
    );

    if (!updatedPatient) {
      return res.status(404).json({ success: false, message: "Target patient tracking profile not found." });
    }

    await createAlert(userId, {
      patientId: patientId,
      patientName: updatedPatient.name,
      title: 'Advanced Self-Assessment Complete',
      message: `${updatedPatient.name} completed the automated screening. Risk Status: ${evaluationReport.riskLevel} (${evaluationReport.clinicalRiskScore}% Score).`,
      type: risk === 'High' ? 'critical' : risk === 'Moderate' ? 'warning' : 'success'
    });

    if (recommendedDoctor && !recommendedDoctor.isNearby) {
      await createAlert(userId, {
        patientId,
        patientName: updatedPatient.name,
        title: 'No Nearby Doctor Found',
        message: `${recommendedDoctor.name} has been suggested as an available specialist. No doctor matched ${updatedPatient.location || updatedPatient.city || "the patient location"}, so the patient may need to visit them.`,
        type: 'warning'
      });
    }

    const mappedPatient = updatedPatient.toObject();
    mappedPatient.id = mappedPatient._id.toString();

    return res.status(201).json({
      success: true,
      report: evaluationReport,
      data: {
        assessment: newAssessment,
        patient: mappedPatient
      }
    });
  } catch (error) {
    console.error("Advanced AI Evaluation controller error:", error);
    
    const fallbackScore = buildClinicalScreeningScore(req.body);
    const legacyCalculatedScore = fallbackScore.total;
    let risk = fallbackScore.risk;

    const fallbackReport = {
      "clinicalRiskScore": 100 - legacyCalculatedScore,
      "riskLevel": risk + " Risk",
      "phaseScores": fallbackScore.phaseScores,
      "breakdown": fallbackScore.breakdown,
      "clinicalSummary": "Screening report generated from deterministic clinical scoring because the AI narrative service was unavailable. Please use this as a screening signal and consult a licensed clinician for diagnosis.",
      "screeningBasis": {
        "method": "Deterministic clinical screening score",
        "correctMemory": fallbackScore.correctMemory,
        "answeredMemory": fallbackScore.answeredMemory,
        "note": "This is not a diagnosis. It flags possible cognitive risk for clinical review."
      },
      "recommendations": [
        { "icon": "💧", "color": "#3B82F6", "priority": "Daily Habit", "text": "Ensure patient drinks at least 1.5 liters of water daily." }
      ]
    };

    try {
      // Save to DB anyway so user doesn't lose progress!
      const newAssessment = await Assessment.create({
        userId,
        patientId,
        score: legacyCalculatedScore,
        riskLevel: risk,
        details: {
          ...req.body,
          aiReport: fallbackReport
        }
      });

      const fallbackPatient = await Patient.findOne({ _id: patientId, userId }).lean();
      const recommendedDoctor = risk === "High" || risk === "Moderate"
        ? await selectRecommendedDoctor(fallbackPatient || { _id: patientId })
        : null;
      const fallbackPatientUpdate = { score: legacyCalculatedScore, risk, lastTestDate: today };

      if (recommendedDoctor) {
        fallbackReport.recommendedDoctors = [recommendedDoctor];
        fallbackReport.actionRequired = recommendedDoctor.isNearby
          ? "Clinical consultation recommended with a nearby doctor."
          : "No nearby doctor found. Please visit the suggested available doctor.";
        fallbackReport.nearbyDoctorAvailable = recommendedDoctor.isNearby;
        fallbackPatientUpdate.assignedDoctorId = recommendedDoctor.id;
        fallbackPatientUpdate.assignedDoctorName = recommendedDoctor.name;
        fallbackPatientUpdate.assignedDoctorSpecialty = recommendedDoctor.specialty;
        fallbackPatientUpdate.assignedDoctorLocation = recommendedDoctor.location;
        fallbackPatientUpdate.doctor = recommendedDoctor.name;
        fallbackPatientUpdate.doctorRecommendationReason = fallbackReport.actionRequired;
        fallbackPatientUpdate.doctorReferralStatus = "assigned";
        fallbackPatientUpdate.doctorAssignedAt = new Date();
      }

      const updatedPatient = await Patient.findOneAndUpdate(
        { _id: patientId, userId },
        fallbackPatientUpdate,
        { returnDocument: 'after' }
      );

      const mappedPatient = updatedPatient ? updatedPatient.toObject() : { _id: patientId, name: "Patient" };
      if (mappedPatient._id) mappedPatient.id = mappedPatient._id.toString();

      if (updatedPatient && recommendedDoctor && !recommendedDoctor.isNearby) {
        await createAlert(userId, {
          patientId,
          patientName: updatedPatient.name,
          title: 'No Nearby Doctor Found',
          message: `${recommendedDoctor.name} has been suggested as an available specialist. No doctor matched ${updatedPatient.location || updatedPatient.city || "the patient location"}, so the patient may need to visit them.`,
          type: 'warning'
        });
      }

      return res.status(201).json({
        success: true,
        report: fallbackReport,
        data: {
          assessment: newAssessment,
          patient: mappedPatient
        }
      });
    } catch (dbError) {
      console.error("Failed to save fallback assessment:", dbError);
      return res.status(500).json({ success: false, message: "Failed to compile screening metrics and save data" });
    }
  }
};

// @desc    Get all assessments for a specific patient
// @route   GET /api/assessments/:patientId
const getPatientAssessments = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Guardrail against undefined or null strings from frontend routing edge cases
    if (!patientId || patientId === 'undefined' || patientId === 'null') {
      return res.status(200).json({ success: true, data: [] });
    }

    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Sort by descending date to get newest first
    const assessments = await Assessment.find({ patientId }).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      data: assessments
    });
  } catch (error) {
    console.error("Failed to fetch assessments:", error);
    return res.status(500).json({ success: false, message: "Error loading latest neurological reports profiles" });
  }
};

module.exports = {
  generateDynamicTest,
  evaluateHighAccuracyTest,
  getPatientAssessments
};
