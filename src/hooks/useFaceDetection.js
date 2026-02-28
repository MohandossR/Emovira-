import { useState, useEffect, useRef } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export const useFaceDetection = (isActive = true) => {
  const [isFacePresent, setIsFacePresent] = useState(false);
  const [faceEmotion, setFaceEmotion] = useState('Neutral 😐');
  const [cameraWarning, setCameraWarning] = useState(null);

  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rafId = useRef(null);
  const streamRef = useRef(null);
  const lastVideoTime = useRef(-1);

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        if (!active) return;

        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });

        if (!active) return;
        landmarkerRef.current = faceLandmarker;

        // Initialize webcam
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        const video = document.createElement('video');
        video.srcObject = stream;
        video.playsInline = true;
        video.autoplay = true;
        video.muted = true;
        videoRef.current = video;

        video.addEventListener('loadeddata', () => {
          if (active && isActive) {
            video.play();
            analyzeFrame();
          }
        });

      } catch (err) {
        console.error("Camera access denied or MediaPipe failed:", err);
        if (active) setCameraWarning("⚠️ Camera access denied. Face detection disabled.");
      }
    };

    if (isActive) {
      init();
    }

    return () => {
      active = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
    };
  }, [isActive]);

  const analyzeFrame = () => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;

    if (!video || !landmarker || video.readyState < 2) {
      if (isActive) rafId.current = requestAnimationFrame(analyzeFrame);
      return;
    }

    if (lastVideoTime.current !== video.currentTime) {
      lastVideoTime.current = video.currentTime;
      const startTimeMs = performance.now();

      try {
        const results = landmarker.detectForVideo(video, startTimeMs);

        if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
          setIsFacePresent(true);
          setCameraWarning(null);

          const blendshapes = results.faceBlendshapes[0].categories;

          const getScore = (name) => blendshapes.find(s => s.categoryName === name)?.score || 0;

          const smileLeft = getScore('mouthSmileLeft');
          const smileRight = getScore('mouthSmileRight');
          const smileScore = (smileLeft + smileRight) / 2;

          const frownLeft = getScore('mouthFrownLeft');
          const frownRight = getScore('mouthFrownRight');
          const browDownLeft = getScore('browDownLeft');
          const browDownRight = getScore('browDownRight');
          const frownScore = (frownLeft + frownRight + browDownLeft + browDownRight) / 4;

          if (smileScore > 0.4) {
            setFaceEmotion('Smiling 😊');
          } else if (frownScore > 0.15) {
            setFaceEmotion('Sad/Concerned 😥');
          } else {
            setFaceEmotion('Neutral 😐');
          }
        } else {
          setIsFacePresent(false);
          setFaceEmotion('Not detected');
          setCameraWarning("⚠️ No face detected.");
        }
      } catch (e) {
        console.error("Error detecting face:", e);
      }
    }

    if (isActive) {
      rafId.current = requestAnimationFrame(analyzeFrame);
    }
  };

  return { isFacePresent, faceEmotion, cameraWarning, videoRef };
};
