const MoodLog = require("../models/MoodLog");
const Patient = require("../models/Patient");

exports.addMoodLog = async (req, res) => {
  try {
    const { patientId, mood, date, notes, sleep, appetite } = req.body;
    
    // Check if a log already exists for this patient and date
    const existingLog = await MoodLog.findOne({ patientId, date });
    if (existingLog) {
      return res.status(400).json({
        success: false,
        message: "A daily log has already been submitted for this patient today."
      });
    }
    
    const newLog = await MoodLog.create({
      patientId,
      mood,
      date,
      notes,
      sleep,
      appetite
    });

    // Update patient current metrics
    const updatedPatient = await Patient.findByIdAndUpdate(patientId, {
      mood,
      sleep,
      appetite,
      lastLogDate: date
    }, { new: true });

    const patientObj = updatedPatient.toObject();
    patientObj.id = patientObj._id.toString();

    res.status(201).json({
      success: true,
      message: "Mood log saved successfully",
      data: newLog,
      patient: patientObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMoodLogsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const logs = await MoodLog.find({ patientId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
