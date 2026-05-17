require("dotenv").config({  path: "./.env"});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const patientRoutes = require("./src/routes/patientRoutes");
const screeningRoutes = require("./src/routes/screeningRoutes");
const moodRoutes = require("./src/routes/moodRoutes");
const alertRoutes = require("./src/routes/alertRoutes");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for profile photos

app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/patients",
  patientRoutes
);

app.use(
  "/api/assessments",
  screeningRoutes
);

app.use(
  "/api/mood-logs",
  moodRoutes
);

app.use(
  "/api/alerts",
  alertRoutes
);

app.get("/", (req, res) => {
  res.send("Backend Running...");
});

mongoose.connect(
  process.env.MONGO_URI
).then(() => {
  console.log("MongoDB Connected");
}).catch((error) => {
  console.log(error);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});