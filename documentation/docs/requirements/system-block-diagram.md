---
sidebar_position: 2
---

# System Block Diagram

![SystemDesign](https://github.com/user-attachments/assets/3a744e34-2de4-457b-a338-1575c9ef13fd)
high-level overview of **Feedstack’s system architecture**, ensuring smooth integration between the **frontend, backend, AI services, and real-time collaboration tools**:

## 🏗️ System Components

### 🚀 Frontend (React)
- Handles all **user interactions**, from **design uploads** to managing **feedback and collaboration sessions**.
- Built with **React** for a **responsive and dynamic UI**.

### 🖥️ Backend (Django REST Framework)
- Manages **API requests, processes data, and handles user authentication**.
- Acts as the bridge between the **frontend and AI service**.

### 🧠 AI Integration (OpenAI GPT-4o API)
- Powers the **design analysis engine**.
- Generates AI-driven **feedback** based on uploaded designs.

### 📦 Database (Firebase)
- Stores **user data, chat history**, and supports **real-time synchronization** for collaboration.

### ☁️ Deployment
- **Grok, Vercel, and Netlify** are used to host different parts of the application.
- Ensures **fast performance, scalability, and seamless updates**.

## 🔧 Modular & Scalable Architecture
The system is **modularly designed**, making it **easy to maintain and expand** as we introduce **new features**.

---
