
# 🧠 Smriti AI – AI-Powered Dementia Care Platform

> A vernacular AI healthcare platform focused on early-stage dementia detection, cognitive monitoring, patient management, and caregiver support. Smriti AI bridges the gap between technology and elderly care, providing tools for caregivers and doctors to track cognitive health effectively.

---

## 🌟 Overview

Smriti AI is a healthcare platform designed to help caregivers, families, and doctors monitor cognitive health and behavioral changes in elderly patients using AI-assisted tools and smart dashboards. The platform transitions from static data to a dynamic, record-driven analysis tool.

### Key Pillars:
- **Multi-Patient Management**: Caregivers can manage multiple elderly family members from a single account.
- **Role-Based Dashboards**: Tailored experiences for both Caregivers (Users) and Healthcare Professionals (Doctors).
- **Cognitive Health Tracking**: Persistent storage of patient assessments and clinical reports.
- **Vernacular Accessibility**: Designed to support regional languages (Hindi, Punjabi) to reach a broader audience.

---

## 🚀 Core Features

### 🔐 Advanced Authentication System
- **Provider**: Firebase Authentication integration.
- **Methods**: Google Sign-In (Primary) and Email/Password authentication.
- **Secure Sessions**: JWT-based backend authentication for protected API routes.
- **Role Selection**: Forced role selection (User/Doctor) during onboarding to ensure data privacy and relevant UI.

### 👨‍👩‍👧 User (Caregiver) Portal
- **Patient Profiles**: Create and manage detailed profiles for multiple patients.
- **Cognitive Monitoring**: Track risk indicators and health summaries over time.
- **Behavioral Logs**: Monitor mood, sleep quality, appetite, and daily patterns.
- **History Tracking**: Seamlessly switch between patients to view their individual medical history.

### 🏥 Doctor Dashboard
- **Patient Analysis**: Deep dive into patient cognitive history and behavioral insights.
- **Progress Monitoring**: Analyze patient progress through longitudinal data.
- **Test Review**: Access and review results from AI-powered cognitive assessments.

### 🧠 Cognitive Assessment System (In Development)
- **Persistent Storage**: Save and retrieve screening results for each patient.
- **Dynamic Reports**: Clinical reports that update based on the latest test responses.
- **Metric Engine**: Mock metric breakdown engine for granular health insights.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js
- **State Management**: React Context API
- **Styling**: Vanilla CSS (Custom UI), Tailwind CSS (Utilities)
- **Auth**: Firebase Client SDK

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Security**: JSON Web Tokens (JWT), Auth Middleware
- **Environment**: Dotenv for configuration

---

## 📂 Project Structure

```text
Smriti-AI/
├── FrontEnd/             # React Application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Dashboard and Auth views
│   │   ├── Services/     # API integration logic
│   │   └── Firebase/     # Firebase configuration
├── BackEnd/              # Node.js API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints
│   │   └── middleware/   # Auth and error handling
│   └── app.js            # Entry point
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Khush54/SmritiAI.git
cd SmritiAI
```

### 2. Backend Setup
```bash
cd BackEnd
npm install
# Create a .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret
npm start
```

### 3. Frontend Setup
```bash
cd FrontEnd
npm install
# Ensure Firebase config is updated in src/Firebase/firebase.js
npm run dev
```

---

## 🔜 Roadmap
- [ ] **AI Test Modules**: Voice-based memory assessments and drawing analysis.
- [ ] **Longitudinal Visualization**: Chart.js integration for cognitive decline tracking.
- [ ] **Smart Notifications**: Behavioral anomaly alerts and medication reminders.
- [ ] **Full Vernacular Support**: Complete UI translation for Hindi and Punjabi.

---

## 📌 Note
This project is currently in active development. Features, API endpoints, and UI components are subject to change as we refine the dementia detection algorithms.

## 👩‍💻 Author
**Khushpreet Kaur**