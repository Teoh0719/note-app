Note App 📝

A full-stack, secure note-taking application built as a technical assessment project. It features user authentication, a protected dashboard, and real-time database updates with a modern, responsive UI.

## ✨ Features
* **Secure Authentication:** User registration and login powered by Firebase Auth.
* **Protected Dashboard:** Private routes that ensure only authenticated users can access the application.
* **Real-Time CRUD Operations:** Users can create, read, update, and delete their own notes instantly without page reloads.
* **Color Customization:** Users can select distinct color themes for individual notes.
* **Modern UI/UX:** Built with Tailwind CSS featuring responsive design, glassmorphism effects, smooth hover animations, and intuitive empty states.
* **Data Privacy:** Backend database rules ensure notes are strictly locked to the specific user who created them.

## 🛠️ Tech Stack
* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend & Database:** Firebase Authentication, Cloud Firestore
* **Language:** TypeScript
* **Deployment:** Vercel

**1. Clone the repository:**
```bash
git clone [Insert your GitHub Repo URL here]
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up environment variables:**
```bash
create a .env.local file in the root directory and add your Firebase configuration keys:
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
```

**4. Start the development server:**
```bash
npm run dev
```

**5. Open the application:**
```bash
Navigate to http://localhost:3000 in your browser.
```
