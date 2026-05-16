const Patient = require("../models/Patient");

exports.addPatient = async (req, res) => {
  try {
    const { name, relation, age, location, doctor, notes } = req.body;

    const newPatient = await Patient.create({
      userId: req.user.id,
      name,
      relation,
      age,
      location,
      doctor,
      notes
    });

    res.status(201).json({
      success: true,
      data: newPatient
    });
  } catch (error) {
    console.error("Add patient error:", error);
    res.status(500).json({ success: false, message: "Failed to add patient" });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    // Map _id to id for frontend compatibility
    const mappedPatients = patients.map(p => {
      const patientObj = p.toObject();
      patientObj.id = patientObj._id.toString();
      return patientObj;
    });

    res.status(200).json({
      success: true,
      data: mappedPatients
    });
  } catch (error) {
    console.error("Get patients error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch patients" });
  }
};
