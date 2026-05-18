const Assessment = require("../models/Assessment");
const Patient = require("../models/Patient");
const { createAlert } = require("./alertController");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Guardrail: Ensure API key exists before boot
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ CRITICAL: GEMINI_API_KEY is missing in your .env configuration!");
}

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// @desc    Generate Unique Dynamic Multi-Modal Test Questions for Patient Self-Assessment
// @route   GET /api/assessments/generate-dynamic-test
const generateDynamicTest = async (req, res) => {
  try {
    const langCode = req.query.lang || 'en';
    
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

    const systemInstruction = `
    You are a clinical neuro-geriatrician expert creating an unpredictable, interactive cognitive self-assessment test for a patient suspected of early-stage dementia.
    The patient is taking this test ALONE on a screen. Every question must be direct, clear, and easy to interact with.

    CRITICAL CLINICAL GUIDELINES:
    1. Questions must NOT be overly difficult or require advanced education. They should be suitable for an elderly person (60+).
    2. Questions must be scientifically based on standard cognitive assessment domains used by doctors (like MMSE/MoCA) to detect early-stage dementia:
       - Orientation (e.g., questions about time, season, or place suitable for a home setting).
       - Short-term Recall (e.g., remembering items or facts).
       - Attention/Working Memory (e.g., simple counting or sequencing).
       - Language/Object Recognition (e.g., identifying common objects or their uses).
    3. Avoid trick questions, complex logic puzzles, or non-clinical trivia. Keep them different and unpredictable each time.
    4. The generated content must be in the language: ${lang}. If Hindi, use clear Devanagari script.
    5. Today's date is: ${today}. If you ask orientation questions about the current day, month, season, or year, you MUST use this information and ensure the correct answer is among the options and marked correctly.

    CRITICAL GENERATION METRICS:
    1. voicePhrase: A simple, comforting sentence in ${lang} with rhythmic words to test articulation/speech apraxia.
    2. cognitiveGame: An array of exactly 3 or 4 unique indices (0 to 8) for a 3x3 grid pattern.
    3. memoryQuestions: Exactly 5 direct patient-facing cognitive questions targeting the domains above, in ${lang}, with 3 options each and one correct option.
    4. behaviorQuestions: 5 Patient Self-Awareness/Mood tracking questions in ${lang} with options corresponding to: ["Never", "Sometimes", "Often"].

    Return strictly a valid JSON object matching the exact schema requested. Do not include markdown wraps.
    `;

    const prompt = `
    Generate a completely randomized, unique patient-facing cognitive test payload in ${lang} following this exact structural JSON schema:
    {
      "voicePhrase": "Clear string for the patient to read aloud.",
      "cognitiveGame": [1, 5, 8],
      "memoryQuestions": [
        { "id": "m1", "question": "Question text...", "options": ["Opt1", "Opt2", "Opt3"], "correct": "Opt1" },
        { "id": "m2", "question": "Question text...", "options": ["Opt1", "Opt2", "Opt3"], "correct": "Opt2" },
        { "id": "m3", "question": "Question text...", "options": ["Opt1", "Opt2", "Opt3"], "correct": "Opt3" },
        { "id": "m4", "question": "Question text...", "options": ["Opt1", "Opt2", "Opt3"], "correct": "Opt1" },
        { "id": "m5", "question": "Question text...", "options": ["Opt1", "Opt2", "Opt3"], "correct": "Opt2" }
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
      return res.status(200).json({
        success: true,
        testData: dynamicTestData
      });
    } catch (parseError) {
      console.error("🚨 Gemini JSON Parsing Failed. Raw Output was:\n", rawText);
      return res.status(502).json({ success: false, message: "AI Orchestration layer returned invalid JSON schema structure." });
    }

  } catch (error) {
    console.error("Dynamic test generation orchestration error:", error);
    
    // Ultimate Fallback: Return static test data so the app NEVER crashes
    const staticTestData = {
      "voicePhrase": "The sun rises in the east and sets in the west.",
      "cognitiveGame": [1, 4, 7],
      "memoryQuestions": [
        { "id": "m1", "question": "What is the capital of India?", "options": ["Mumbai", "New Delhi", "Kolkata"], "correct": "New Delhi" },
        { "id": "m2", "question": "Which of these is a fruit?", "options": ["Apple", "Potato", "Carrot"], "correct": "Apple" },
        { "id": "m3", "question": "How many days are in a week?", "options": ["5", "6", "7"], "correct": "7" },
        { "id": "m4", "question": "Which direction does the sun rise?", "options": ["East", "West", "North"], "correct": "East" },
        { "id": "m5", "question": "What color is the sky on a clear day?", "options": ["Green", "Blue", "Red"], "correct": "Blue" }
      ],
      "behaviorQuestions": [
        { "id": "b1", "question": "Do you often forget where you put your keys?", "options": ["Never", "Sometimes", "Often"] },
        { "id": "b2", "question": "Do you find it hard to remember names of new people?", "options": ["Never", "Sometimes", "Often"] },
        { "id": "b3", "question": "Do you feel confused in familiar places?", "options": ["Never", "Sometimes", "Often"] },
        { "id": "b4", "question": "Do you lose track of the date or season?", "options": ["Never", "Sometimes", "Often"] },
        { "id": "b5", "question": "Do you need help with daily tasks like dressing?", "options": ["Never", "Sometimes", "Often"] }
      ]
    };

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

    const systemInstruction = `
    You are a senior expert neuro-geriatrician evaluating a patient's digital multi-modal cognitive self-assessment.
    Analyze the incoming parameters derived dynamically to trace signals of early-stage cognitive degradation, memory gaps, or speech markers.
    Calculate an absolute clinical risk index from 0 to 100%. 
    Focus extensively on delivering a profile layout that eliminates language bias and outlines strong protective digital safety nets.
    You MUST respond strictly with a valid JSON string object match.
    `;

    // FIXED: Clean validation checking if input parameters are already parsed objects or strings
    const stringifiedMemory = typeof memoryAnswer === 'object' ? JSON.stringify(memoryAnswer) : memoryAnswer;
    const stringifiedBehavior = typeof behaviorAnswer === 'object' ? JSON.stringify(behaviorAnswer) : behaviorAnsw    
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

    // Doctor Allocation Matrix based on score evaluation
    if (evaluationReport.clinicalRiskScore >= 50) {
      evaluationReport.recommendedDoctors = [
        { name: "Dr. Alok Sharma", specialty: "Consultant Neurologist", contact: "+91-9988776655", clinic: "Neuro Care Clinic" },
        { name: "Dr. Meenakshi Rai", specialty: "Geriatric Psychiatrist", contact: "+91-8877665544", clinic: "Mind & Memory Hospital" }
      ];
      evaluationReport.actionRequired = "Immediate clinical consultation recommended.";
    } else {
      evaluationReport.recommendedDoctors = [];
      evaluationReport.actionRequired = "Routine check-up in 6 months.";
    }

    // Calculate total score as sum of 4 phases (25 marks each)
    let legacyCalculatedScore = 0;
    if (evaluationReport.phaseScores) {
      legacyCalculatedScore = (evaluationReport.phaseScores.voice || 0) + 
                              (evaluationReport.phaseScores.game || 0) + 
                              (evaluationReport.phaseScores.memory || 0) + 
                              (evaluationReport.phaseScores.behavior || 0);
    } else {
      legacyCalculatedScore = Math.max(0, 100 - evaluationReport.clinicalRiskScore);
    }

    let risk = "Low";
    if (legacyCalculatedScore < 50) risk = "High";
    else if (legacyCalculatedScore < 75) risk = "Moderate";"Moderate";

    let trend = legacyCalculatedScore < 70 ? "down" : "stable";

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

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId, 
      { 
        score: legacyCalculatedScore, 
        risk, 
        trend, 
        lastTestDate: today,
        recommendations: evaluationReport.recommendations || []
      },
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
    
    // Ultimate Fallback for Evaluation: Return a standard report based on the game score
    const legacyCalculatedScore = req.body.gameScore || 50;
    let risk = "Low";
    if (legacyCalculatedScore < 50) risk = "High";
    else if (legacyCalculatedScore < 75) risk = "Moderate";

    const fallbackReport = {
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
      "clinicalSummary": "Fallback report generated due to AI service timeout. Please re-evaluate later for deeper insights.",
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

      const updatedPatient = await Patient.findByIdAndUpdate(
        patientId, 
        { score: legacyCalculatedScore, risk, lastTestDate: today },
        { returnDocument: 'after' }
      );

      const mappedPatient = updatedPatient ? updatedPatient.toObject() : { _id: patientId, name: "Patient" };
      if (mappedPatient._id) mappedPatient.id = mappedPatient._id.toString();

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