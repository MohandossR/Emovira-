import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const MouseFollower = () => {
  const [supportsFinePointer, setSupportsFinePointer] = useState(false);
  const [isHoveringAction, setIsHoveringAction] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cursorX = useSpring(mouseX, { damping: 28, stiffness: 260 });
  const cursorY = useSpring(mouseY, { damping: 28, stiffness: 260 });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia('(pointer: fine)');
    setSupportsFinePointer(media.matches);

    const updatePointerCapability = (event) => {
      setSupportsFinePointer(event.matches);
    };

    const handleMouseMove = (event) => {
      mouseX.set(event.clientX - 12);
      mouseY.set(event.clientY - 12);
    };

    const handleMouseOver = (event) => {
      const isAction =
        event.target.tagName === 'BUTTON' ||
        event.target.tagName === 'A' ||
        event.target.closest('button') ||
        event.target.closest('a');
      setIsHoveringAction(Boolean(isAction));
    };

    media.addEventListener('change', updatePointerCapability);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      media.removeEventListener('change', updatePointerCapability);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!supportsFinePointer) {
    return null;
  }

  return (
    <>
      <motion.div
        style={{ translateX: cursorX, translateY: cursorY }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-6 w-6 rounded-full border border-primary/80 mix-blend-multiply"
        animate={{
          scale: isHoveringAction ? 1.9 : 1,
          backgroundColor: isHoveringAction ? 'rgba(26, 115, 232, 0.18)' : 'transparent',
        }}
        transition={{ type: 'spring', damping: 22, stiffness: 220 }}
      />
      <motion.div
        style={{ translateX: mouseX, translateY: mouseY }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-primary"
      />
    </>
  );
};

export default MouseFollower;
