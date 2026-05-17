const Patient = require("../models/Patient");
const { createAlert } = require("./alertController");

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

    const patientObj = newPatient.toObject();
    patientObj.id = patientObj._id.toString();

    // Create persistent alert
    await createAlert(req.user.id, {
      patientId: patientObj.id,
      patientName: patientObj.name,
      title: 'Profile Created',
      message: `Successfully added ${patientObj.name} to monitoring.`,
      type: 'success'
    });

    res.status(201).json({
      success: true,
      data: patientObj
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

exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const patient = await Patient.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    const patientObj = patient.toObject();
    patientObj.id = patientObj._id.toString();

    res.status(200).json({
      success: true,
      data: patientObj
    });
  } catch (error) {
    console.error("Update patient error:", error);
    res.status(500).json({ success: false, message: "Failed to update patient" });
  }
};
