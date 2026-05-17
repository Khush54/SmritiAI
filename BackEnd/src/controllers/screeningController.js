const Assessment = require("../models/Assessment");
const Patient = require("../models/Patient");
const { createAlert } = require("./alertController");

exports.addAssessment = async (req, res) => {
  try {
    const { patientId, answers } = req.body;
    
    const today = new Date().toLocaleDateString('en-CA'); 
    
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
        message: "An assessment has already been completed for this patient today. Please try again tomorrow."
      });
    }
    
    let score = 100;
    if (answers.memoryAns && answers.memoryAns !== "30 Oct") score -= 20; 
    if (answers.beh1 === "Often") score -= 30;
    if (answers.beh1 === "Slight") score -= 15;

    let risk = "Low";
    if (score < 50) risk = "High";
    else if (score < 75) risk = "Moderate"; 

    let trend = "stable";
    if (score < 70) trend = "down";

    const newAssessment = await Assessment.create({
      userId: req.user.id,
      patientId,
      score,
      riskLevel: risk,
      details: answers
    });

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId, 
      { score, risk, trend, lastTestDate: today },
      { returnDocument: 'after' }
    );

    await createAlert(req.user.id, {
      patientId: patientId,
      patientName: updatedPatient.name,
      title: 'Assessment Completed',
      message: `${updatedPatient.name} completed a cognitive test with a score of ${score}/100 (${risk} Risk).`,
      type: risk === 'High' ? 'critical' : risk === 'Moderate' ? 'warning' : 'success'
    });

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
