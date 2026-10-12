# MyAiScheduler - AI-Powered Adaptive Engineering Scheduler & DSA Mentor

An intelligent, full-stack developer learning and productivity platform designed for software engineers. Features real **Google OAuth 2.0 authentication**, an **energy-aware study planner**, **110 curated LeetCode problems** across 11 algorithmic patterns, **11 production technology roadmaps**, and **cross-platform cloud deployment**.

---

## 🌟 Key Features

### 1. Enterprise Multi-User Authentication & Security
- **Real Google OAuth 2.0**: Integrated with Google Identity Services (GIS) token client popup.
- **Dual-Layer Token Authentication**:
  - Secure **HttpOnly session cookies** with dynamic `SameSite=None` on HTTPS for cross-origin hosting.
  - **`Authorization: Bearer <token>`** request interceptors in Axios for seamless cloud deployment.
- **BCrypt Password Hashing**: Zero plaintext password storage.
- **Protected Endpoints**: Strict user-level isolation (`findByIdAndUser`) preventing unauthorized data access.

### 2. LeetCode Practice Playground
- **110 Seeded LeetCode Problems**: Categorized across 11 core interview patterns (Two Pointers, Sliding Window, Dynamic Programming, Fast & Slow Pointers, Tree BFS/DFS, etc.).
- **Blueprint Starter Code**: Language templates and starter boilerplates.
- **Walkthrough Guides**: Core intuition, step-by-step algorithms, edge cases, and direct links to LeetCode.
- **User Progress Tracking**: Tracks `SOLVED`, `IN_PROGRESS`, and `NEEDS_REVISION` statuses isolated per user in MySQL.

### 3. Technology Roadmaps & Courses
- **11 Role-Based Roadmaps**: Full Stack Java & React, Backend Spring Boot, Frontend React, AI/ML Engineering, DevOps & Cloud, DSA, System Design, and more.
- **Interactive Flowcharts**: Visual topic trees with subtopic breakdowns.
- **Interactive AI Study Mentor**: Q&A, topic quizzes, and hands-on coding challenges for any milestone.

### 4. Smart AI Scheduler
- **Energy-Aware Daily Scheduling**: Allocates deep-focus coding during peak energy hours and architecture reading during low energy blocks.
- **Pomodoro Rhythm Integration**: Automated time block planning with instant task creation and in-app notifications.

---

## 🛠️ Tech Stack

- **Backend**: Java 17, Spring Boot 3.4/4.0, Spring Security 6, Spring Data JPA, Hibernate, MySQL.
- **Frontend**: React 18, Vite, Lucide Icons, Modern CSS.
- **DevOps**: Docker (multi-stage Alpine), Netlify, Railway / Render.

---

## 🚀 Running Locally

### Backend
1. Ensure MySQL is running on port 3306 with database `ai_scheduler`.
2. Configure credentials in `backend/src/main/resources/application-local.properties`:
   ```properties
   app.oauth.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
   ```
3. Run Spring Boot:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

### Frontend
1. Install dependencies and start the Vite dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open [http://localhost:5173](http://localhost:5173).

---

## ☁️ Cloud Deployment

- **Frontend**: Deployed on [Netlify](https://myaischeduler.netlify.app).
- **Backend**: Containerized via `backend/Dockerfile` ready for Railway or Render.

*Last Updated & Verified: October 12, 2026*
