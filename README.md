# Emovira - Compassion Session Prototype

Welcome to the **Emovira** prototype! This project is a completely on-device, interactive AI-powered compassion and coaching session designed to help users process their emotions through natural conversations. It leverages cutting-edge web technologies and machine learning to create a safe, private space for emotional support.

## 🌟 Prototype Features

### 1. On-Device Vision and Emotion Tracking
- **Powered by MediaPipe:** Integrates Google's `@mediapipe/tasks-vision` to run a localized, optimized Face Landmarker in the browser using WebAssembly and GPU acceleration.
- **Real-Time Emotion Assessment:** Analyzes specific facial blendshapes (mouth smiles, frowns, brow positions) to continuously estimate the user's current emotional state (Smiling 😊, Sad/Concerned 😥, Neutral 😐).
- **100% Private:** No video frames or images are ever uploaded to a server. All vision processing occurs locally within the browser sandbox.

### 2. Seamless Voice & Text Interactivity
- **Continuous Listening:** Utilizes the browser's native `SpeechRecognition` API to transcribe speech in real-time, allowing for natural, hands-free conversation.
- **Adaptive Speech Synthesis:** Generates comforting audio responses using the native `SpeechSynthesis` API. The AI's voice style is customizable (Calm, Gentle, Coach, or Clinical) by adjusting volume, pitch, and rate dynamically based on context.
- **Dual-Mode Fluidity:** Users can organically switch between typing or speaking at any moment.

### 3. Trainable Dual-ML Intent & Domain Engine
- **Intent Recognition:** Analyzes user input to map inputs against 10 distinct psychological profiles (Anxiety, Overwhelm, Sadness, Anger, Self-worth, Sleep, Focus, etc.).
- **Context Domains:** Detects the overarching life context of the user (Student Life, Work Life, Relationships).
- **Online Reinforcement Learning:** As users provide feedback on whether a response was helpful, the system actively adjusts the localized models to offer more personalized and accurate responses during the session.

### 4. Crisis Intervention & Safety Layer
- **Acute Keyword Detection:** Actively scans all inputs for severe crisis markers (e.g., "self harm", "suicide"). 
- **Immediate Safeguards:** If triggered, the application suspends standard conversation branches and immediately provides an emergency intervention message, encouraging the user to contact emergency services or the 988 lifeline.

### 5. Highly Responsive, Calming UI/UX
- **Beautiful Glassmorphism:** A completely bespoke CSS/Tailwind design featuring blurred, translucent surfaces ("glass-panel") that feel soft and immersive.
- **Dynamic Animations:** Fluid component mounting, glowing ambient avatars, and breathing guides built with **Framer Motion**.
- **Visual Context Feed:** Displays the active camera feed context, conversational history, and live intent classifications without cluttering the main conversation area.

## 🚀 Technologies Used

- **Framework:** React 18, Vite
- **Styling:** TailwindCSS, Vanilla CSS (index.css)
- **Animation & Icons:** Framer Motion, Lucide-React
- **Machine Learning / Vision:** `@mediapipe/tasks-vision`
- **Speech APIs:** `window.SpeechRecognition`, `window.SpeechSynthesis`
- **Routing:** React Router v7

## 🛠️ How to Run the Prototype Locally

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Access the application:** Open the local URL provided by Vite (e.g., `http://localhost:5173`) in a supported modern browser (Chrome is recommended for optimal SpeechRecognition capabilities).
5. Open up your camera and microphone when prompted to experience the full multi-modal compassion session!
