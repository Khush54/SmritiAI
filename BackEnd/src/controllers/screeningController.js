const Assessment = require("../models/Assessment");
const Patient = require("../models/Patient");

exports.addAssessment = async (req, res) => {
  try {
    const { patientId, answers } = req.body;
    
    // Naive scoring logic for demo (Will be replaced with AI later)
    let score = 100;
    if (answers.memoryAns && answers.memoryAns !== "30 Oct") score -= 20; 
    if (answers.beh1 === "Often") score -= 30;
    if (answers.beh1 === "Slight") score -= 15;

    // Determine Risk
    let risk = "Low";
    if (score < 50) risk = "High";
    else if (score < 75) risk = "Moderate"; 

    // Determine Trend
    // This is naive, ideally we check previous assessments
    let trend = "stable";
    if (score < 70) trend = "down";

    // 1. Create Assessment Record
    const newAssessment = await Assessment.create({
      userId: req.user.id,
      patientId,
      score,
      riskLevel: risk,
      details: answers
    });

    // 2. Update Patient's current score and risk
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId, 
      { score, risk, trend },
      { returnDocument: 'after' }
    );

    // Map _id to id for frontend
    const mappedPatient = updatedPatient.toObject();
    mappedPatient.id = mappedPatient._id.toString();

    res.status(201).json({
      success: true,
      data: {
         assessment: newAssessment,
         patient: mappedPatient
      }
    });
  } catch (error) {
    console.error("Add assessment error:", error);
    res.status(500).json({ success: false, message: "Failed to add assessment" });
  }
};

exports.getAssessmentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log("Fetching assessments for patientId:", patientId, "userId:", req.user.id);
    const assessments = await Assessment.find({ 
      patientId, 
      userId: req.user.id 
    }).sort({ createdAt: -1 });

    console.log("Found assessments:", assessments.length);

    const mappedAssessments = assessments.map(a => {
      const obj = a.toObject();
      obj.id = obj._id.toString();
      return obj;
    });

    res.status(200).json({
      success: true,
      data: mappedAssessments
    });
  } catch (error) {
    console.error("Get assessments error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch assessments" });
  }
};
