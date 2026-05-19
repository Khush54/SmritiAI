const Patient = require("../models/Patient");
const Assessment = require("../models/Assessment");
const User = require("../models/User");
const { createAlert } = require("./alertController");

const toPatientDTO = (patient, latestAssessment = null) => {
  const patientObj = patient.toObject ? patient.toObject() : patient;
  patientObj.id = patientObj._id.toString();
  patientObj.latestAssessment = latestAssessment;
  if (patientObj.assignedDoctorId && typeof patientObj.assignedDoctorId === "object") {
    patientObj.assignedDoctorName = patientObj.assignedDoctorName || patientObj.assignedDoctorId.fullName;
    patientObj.assignedDoctorPhone = patientObj.assignedDoctorId.phone || "";
    patientObj.assignedDoctorEmail = patientObj.assignedDoctorId.email || "";
    patientObj.assignedDoctorClinic = patientObj.assignedDoctorId.clinic || "";
    patientObj.assignedDoctorLocation = patientObj.assignedDoctorLocation || patientObj.assignedDoctorId.location || patientObj.assignedDoctorId.city || "";
    patientObj.assignedDoctorSpecialty = patientObj.assignedDoctorSpecialty || patientObj.assignedDoctorId.specialization;
    patientObj.assignedDoctorId = patientObj.assignedDoctorId._id.toString();
  }
  patientObj.tests = latestAssessment ? 1 : 0;
  patientObj.city = patientObj.city || patientObj.location || "";
  patientObj.lastTest = patientObj.lastTestDate || latestAssessment?.createdAt || null;
  patientObj.followUp = patientObj.followUpDate || null;
  patientObj.caregiver = patientObj.userId?.fullName || patientObj.relation || "";
  patientObj.flag = patientObj.risk === "High";
  patientObj.sharedClinicalNotes = (patientObj.clinicalNotes || [])
    .filter(note => note.sharedWithCaregiver)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  patientObj.latestSharedClinicalNote = patientObj.sharedClinicalNotes[0] || null;
  return patientObj;
};

const assertDoctor = (req, res) => {
  if (req.user.role !== "doctor") {
    res.status(403).json({ success: false, message: "Doctor access required" });
    return false;
  }
  return true;
};

const getLatestAssessmentsByPatient = async (patientIds) => {
  const latest = await Assessment.find({ patientId: { $in: patientIds } })
    .sort({ createdAt: -1 })
    .lean();

  return latest.reduce((acc, assessment) => {
    const patientId = assessment.patientId.toString();
    if (!acc[patientId]) acc[patientId] = assessment;
    return acc;
  }, {});
};

const getDomainValue = (assessment, key, fallback) => {
  const breakdown = assessment?.details?.aiReport?.breakdown;
  return Math.round(Number(breakdown?.[key] ?? fallback ?? 0));
};

const buildDoctorDashboard = async (doctorId) => {
  const patients = await Patient.find({ assignedDoctorId: doctorId })
    .populate("userId", "fullName email phone")
    .sort({ updatedAt: -1 });

  const latestByPatient = await getLatestAssessmentsByPatient(patients.map(p => p._id));
  const patientDTOs = patients.map(patient => toPatientDTO(patient, latestByPatient[patient._id.toString()] || null));

  const highRiskPatients = patientDTOs.filter(p => p.risk === "High");
  const moderateRiskPatients = patientDTOs.filter(p => p.risk === "Moderate");
  const assessedPatients = patientDTOs.filter(p => typeof p.score === "number");
  const averageScore = assessedPatients.length
    ? Math.round(assessedPatients.reduce((sum, p) => sum + p.score, 0) / assessedPatients.length)
    : 0;
  const averageAge = patientDTOs.length
    ? Math.round(patientDTOs.reduce((sum, p) => sum + Number(p.age || 0), 0) / patientDTOs.length)
    : 0;

  const reports = patientDTOs
    .filter(p => p.latestAssessment)
    .map(p => ({
      id: p.id,
      patientId: p.id,
      name: p.name,
      score: p.score ?? p.latestAssessment.score,
      lastTest: p.lastTestDate || p.latestAssessment.createdAt,
      city: p.city,
      risk: p.risk,
      flag: p.risk === "High",
      notes: p.latestAssessment.details?.aiReport?.clinicalSummary || p.notes || "Assessment ready for review.",
      domains: [
        getDomainValue(p.latestAssessment, "memory", p.score),
        getDomainValue(p.latestAssessment, "attention", p.score),
        getDomainValue(p.latestAssessment, "language", p.score),
        getDomainValue(p.latestAssessment, "spatial", p.score),
        getDomainValue(p.latestAssessment, "logic", p.score)
      ]
    }));

  const alerts = patientDTOs
    .filter(p => p.risk === "High" || p.risk === "Moderate")
    .map(p => ({
      id: `${p.id}-${p.updatedAt}`,
      patientId: p.id,
      pt: p.name,
      text: p.risk === "High"
        ? `High-risk cognitive profile requires clinical review. Latest score: ${p.score ?? "pending"}.`
        : `Moderate-risk profile has been assigned for specialist follow-up. Latest score: ${p.score ?? "pending"}.`,
      time: p.updatedAt,
      type: p.risk === "High" ? "critical" : "high"
    }));

  const followUps = patientDTOs.map(p => ({
    id: p.id,
    patientId: p.id,
    name: p.name,
    risk: p.risk,
    followUp: p.followUpDate,
    type: p.risk === "High" ? "Neurology" : "Clinical Review",
    status: p.followUpDate ? "UPCOMING" : "PENDING",
    notes: p.doctorRecommendationReason || p.notes || "Review latest assessment before consultation."
  }));

  const noteHistory = patientDTOs.flatMap(p =>
    (p.clinicalNotes || []).map(note => ({
      id: note._id?.toString(),
      patientId: p.id,
      name: p.name,
      risk: p.risk,
      score: p.score,
      lastTest: note.createdAt,
      notes: note.observation,
      recommendations: note.recommendations
    }))
  );

  return {
    patients: patientDTOs,
    alerts,
    reports,
    followUps,
    noteHistory,
    analytics: {
      kpis: {
        totalPatients: patientDTOs.length,
        highRisk: highRiskPatients.length,
        moderateRisk: moderateRiskPatients.length,
        averageScore,
        averageAge,
        pendingReports: reports.length
      },
      riskDistribution: {
        High: highRiskPatients.length,
        Moderate: moderateRiskPatients.length,
        Low: patientDTOs.filter(p => p.risk === "Low").length
      },
      domainAverages: ["memory", "attention", "language", "spatial", "logic"].map(domain => {
        const values = reports.map(r => {
          const index = ["memory", "attention", "language", "spatial", "logic"].indexOf(domain);
          return r.domains[index];
        }).filter(Boolean);
        return {
          domain,
          pct: values.length ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length) : 0
        };
      })
    }
  };
};

exports.addPatient = async (req, res) => {
  try {
    const { name, relation, age, location, doctor, notes } = req.body;

    const newPatient = await Patient.create({
      userId: req.user.id,
      name,
      relation,
      age,
      location,
      city: location,
      doctor,
      notes
    });

    const patientObj = newPatient.toObject();
    patientObj.id = patientObj._id.toString();

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
    const patients = await Patient.find({ userId: req.user.id })
      .populate("assignedDoctorId", "fullName email phone clinic specialization location city")
      .sort({ createdAt: -1 });
    
    const mappedPatients = patients.map(p => {
      return toPatientDTO(p);
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

exports.getDoctorPatients = async (req, res) => {
  try {
    if (!assertDoctor(req, res)) return;

    const patients = await Patient.find({ assignedDoctorId: req.user.id })
      .populate("userId", "fullName email phone")
      .sort({ updatedAt: -1 });

    const latestByPatient = await getLatestAssessmentsByPatient(patients.map(p => p._id));
    const mappedPatients = patients.map(p => toPatientDTO(p, latestByPatient[p._id.toString()] || null));

    res.status(200).json({
      success: true,
      data: mappedPatients
    });
  } catch (error) {
    console.error("Get doctor patients error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch assigned patients" });
  }
};

exports.getDoctorDashboard = async (req, res) => {
  try {
    if (!assertDoctor(req, res)) return;

    const dashboard = await buildDoctorDashboard(req.user.id);
    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error("Get doctor dashboard error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch doctor dashboard" });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData.city && !updateData.location) {
      updateData.location = updateData.city;
    }
    if (updateData.location && !updateData.city) {
      updateData.city = updateData.location;
    }

    const patient = await Patient.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { returnDocument: 'after' }
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

exports.addClinicalNote = async (req, res) => {
  try {
    if (!assertDoctor(req, res)) return;

    const { id } = req.params;
    const { noteType, observation, recommendations, sharedWithCaregiver } = req.body;
    const doctor = await User.findById(req.user.id).lean();
    const doctorName = doctor?.fullName || "Your doctor";
    const shouldShare = Boolean(sharedWithCaregiver);

    const patient = await Patient.findOneAndUpdate(
      { _id: id, assignedDoctorId: req.user.id },
      {
        $push: {
          clinicalNotes: {
            doctorId: req.user.id,
            noteType,
            observation,
            recommendations,
            sharedWithCaregiver: shouldShare
          }
        },
        doctorReferralStatus: noteType === "Referral" ? "recommended" : "assigned",
        doctorRecommendationReason: recommendations || observation || "Doctor shared a clinical update."
      },
      { returnDocument: "after" }
    );

    if (!patient) {
      return res.status(404).json({ success: false, message: "Assigned patient not found" });
    }

    if (shouldShare) {
      await createAlert(patient.userId, {
        patientId: patient._id,
        patientName: patient.name,
        title: noteType === "Referral" ? "Doctor Visit Recommended" : "Doctor Shared Clinical Note",
        message: `${doctorName} shared a ${noteType || "clinical"} note: ${recommendations || observation}`,
        type: noteType === "Referral" ? "warning" : "info"
      });
    }

    res.status(201).json({
      success: true,
      data: toPatientDTO(patient)
    });
  } catch (error) {
    console.error("Add clinical note error:", error);
    res.status(500).json({ success: false, message: "Failed to save clinical note" });
  }
};
