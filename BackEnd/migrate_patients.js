const mongoose = require('mongoose');
const Patient = require('./src/models/Patient');
require('dotenv').config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smritiai');
    console.log("Connected to DB...");

    const result = await Patient.updateMany(
      { $or: [
        { score: 100 },
        { trend: "stable" },
        { mood: "Neutral" },
        { sleep: "Normal" },
        { appetite: "Normal" }
      ]}, 
      { $set: { score: null, trend: null, mood: null, sleep: null, appetite: null } }
    );

    console.log(`Updated ${result.modifiedCount} patients.`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrate();
