const MoodLog = require("../models/MoodLog");
const Patient = require("../models/Patient");
const { createAlert } = require("./alertController");

exports.addMoodLog = async (req, res) => {
  try {
    const { patientId, mood, date, notes, sleep, appetite } = req.body;
    
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

    const updatedPatient = await Patient.findByIdAndUpdate(patientId, {
      mood,
      sleep,
      appetite,
      lastLogDate: date
    }, { returnDocument: 'after' });

    const patientObj = updatedPatient.toObject();
    patientObj.id = patientObj._id.toString();

    // Create an alert for the mood log
    if (req.user) {
      await createAlert(req.user.id, {
        patientId: patientId,
        patientName: updatedPatient.name,
        title: 'Daily Mood Log Saved',
        message: `${updatedPatient.name} is feeling ${mood} today. Notes: ${notes ? notes : 'None'}`,
        type: (mood === '😔' || mood === '😤' || mood === '😰') ? 'warning' : 'info'
      });
    }

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
