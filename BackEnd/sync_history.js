const mongoose = require('mongoose');
const Patient = require('./src/models/Patient');
const Assessment = require('./src/models/Assessment');
const MoodLog = require('./src/models/MoodLog');
require('dotenv').config();

const sync = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smritiai');
    console.log("Connected to DB...");

    const patients = await Patient.find();
    console.log(`Processing ${patients.length} patients...`);

    for (let patient of patients) {
      const lastAssessment = await Assessment.findOne({ patientId: patient._id }).sort({ createdAt: -1 });
      if (lastAssessment) {
        patient.lastTestDate = lastAssessment.createdAt.toLocaleDateString('en-CA');
        patient.score = lastAssessment.score;
        patient.risk = lastAssessment.riskLevel;
      }

      const lastLog = await MoodLog.findOne({ patientId: patient._id }).sort({ date: -1 });
      if (lastLog) {
        patient.lastLogDate = lastLog.date;
        patient.mood = lastLog.mood;
        patient.sleep = lastLog.sleep;
        patient.appetite = lastLog.appetite;
      }

      await patient.save();
      console.log(`Synced ${patient.name}`);
    }

    console.log("Sync complete!");
    process.exit(0);
  } catch (error) {
    console.error("Sync failed:", error);
    process.exit(1);
  }
};

sync();
