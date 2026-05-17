const mongoose = require('mongoose');
const Patient = require('./src/models/Patient');
require('dotenv').config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smritiai');
    const today = new Date().toLocaleDateString('en-CA');
    
    // Find the first patient and set their lastTestDate to today
    const patient = await Patient.findOne();
    if (patient) {
      patient.lastTestDate = today;
      patient.score = 85;
      patient.risk = 'Low';
      await patient.save();
      console.log(`Updated ${patient.name} with lastTestDate: ${today}`);
    } else {
      console.log("No patients found.");
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

test();
