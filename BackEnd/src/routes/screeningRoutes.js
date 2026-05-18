const express = require("express");
const router = express.Router();

// 1. Controller se specific functions ko destructure karke nikaalo
const { generateDynamicTest, evaluateHighAccuracyTest, getPatientAssessments } = require("../controllers/screeningController");

// 2. Auth middleware/controller se direct 'protect' function ko destructure karo
const { protect } = require("../middleware/authMiddleware"); 

// --- FAIL-SAFE SANITY CHECK ---
// Yeh logs check karenge ki imports memory mein functions hain ya nahi
if (typeof protect !== "function") {
    console.error("❌ CRITICAL ERROR: protect middleware is NOT a function! Check auth file export.");
}
if (typeof generateDynamicTest !== "function") {
    console.error("❌ CRITICAL ERROR: generateDynamicTest is NOT a function! Check controller file.");
}
if (typeof evaluateHighAccuracyTest !== "function") {
    console.error("❌ CRITICAL ERROR: evaluateHighAccuracyTest is NOT a function! Check controller file.");
}

// 3. Bind routes using the correct 'protect' function variable
// Route A: Generate dynamic non-repetitive test vectors
router.get("/generate-dynamic-test", protect, generateDynamicTest);

// Route B: Evaluate high accuracy multimodal payload
router.post("/high-accuracy-eval", protect, evaluateHighAccuracyTest);

// Route C: Fetch history of assessments for a patient
router.get("/:patientId", protect, getPatientAssessments);

module.exports = router;