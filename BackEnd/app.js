require("dotenv").config({  path: "./.env"});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use(
  "/api/auth",
  authRoutes
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