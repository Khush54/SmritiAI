# 🧠 Smriti AI – AI Powered Dementia Care & Cognitive Monitoring Platform

> Smriti AI is an AI-powered healthcare platform focused on early-stage dementia support, cognitive monitoring, behavioral tracking, and patient management. The platform helps caregivers and doctors monitor elderly patients through smart dashboards, assessment reports, and centralized patient records.

---

# 🌟 Project Overview

Smriti AI is designed to simplify elderly cognitive healthcare by combining:

- AI-assisted cognitive monitoring
- Multi-patient management
- Doctor and user dashboards
- Health report generation
- Behavioral tracking
- Vernacular accessibility

The platform allows users to manage multiple patients from one account while enabling doctors to review patient progress, reports, and assessment history efficiently.

---

# 🚀 Main Features

## 🔐 Authentication & Security
- Firebase Authentication integration
- Google Sign-In support
- Email & Password authentication
- JWT-based secure backend authentication
- Role-based access control (User / Doctor)

---

# 👨‍👩‍👧 User Dashboard

Users can:

- Add and manage multiple patients
- Monitor patient cognitive health
- View patient history
- Track mood, sleep, appetite, and behavior
- Access AI-generated health insights
- Store patient records securely

### User Dashboard Modules
- Home Dashboard
- Patient Management
- Health Reports
- Cognitive Tracking
- Notifications
- Settings

---

# 🏥 Doctor Dashboard

Doctors can:

- Access patient medical history
- Review cognitive assessment reports
- Analyze behavioral patterns
- Monitor patient progress over time
- View AI-generated insights
- Manage multiple patient records efficiently

### Doctor Dashboard Modules
- Analytics Dashboard
- Patient Overview
- Medical Reports
- Clinical Notes
- Alerts & Notifications
- Report Review System

---

# 📄 Reports System

Smriti AI includes a report management system for storing and analyzing patient information.

## Types of Reports
- Cognitive Assessment Reports
- Behavioral Analysis Reports
- Patient Progress Reports
- Risk Evaluation Reports
- Doctor Review Reports

## Report Features
- Persistent report storage
- Dynamic report generation
- Patient-wise report history
- Doctor access to reports
- Future AI-based prediction support

---

# 🧠 Cognitive Monitoring System

The platform helps track:

- Memory-related symptoms
- Behavioral changes
- Sleep patterns
- Emotional stability
- Daily health indicators
- Cognitive risk progression

---

# 🌐 Vernacular Accessibility

Smriti AI is designed to support regional accessibility by integrating:
- 10 +  Indian language support
- Easy-to-understand UI for elderly users and caregivers

---

# 🛠️ Tech Stack

## Frontend
- React.js
- React Router
- Context API
- Tailwind CSS
- Vanilla CSS

## Backend
- Node.js
- Express.js

## Database
- MongoDB Atlas
- Mongoose ODM

## Authentication
- Firebase Authentication
- JWT Authentication

## Tools & Services
- Git & GitHub
- Postman
- Vite
- Dotenv

---

# 📂 Project Structure

```text
Smriti-AI/
│
├── FrontEnd/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── Services/
│   │   ├── Firebase/
│   │   └── assets/
│
├── BackEnd/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── config/
│   │
│   └── app.js
│
└── README.md
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
# API_KEYS
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
# 🔄 Workflow of the Platform
- User signs in using Firebase Authentication
- User selects role (User / Doctor)
- User adds patient profiles
- Patient data gets stored in MongoDB
- Doctors can review reports and analytics
- Reports and insights are generated dynamically
- Historical records are maintained for monitoring

---

# 🔮 Future Scope
- OCR-based medical document scanning

- Video consultation support
- Advanced report analytics
- Multi-language chatbot assistant

---

# 👩‍💻 Developed By
 Khushpreet Kaur

---

# 🤝 Contribution
#Contributions, improvements, and suggestions are welcome for enhancing dementia care technology and accessibility.