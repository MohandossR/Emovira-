import React, { useEffect } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';

const ORB_POSITIONS = [
  { top: '12%', left: '14%', size: 10 },
  { top: '22%', left: '72%', size: 8 },
  { top: '48%', left: '22%', size: 6 },
  { top: '58%', left: '82%', size: 7 },
  { top: '78%', left: '12%', size: 9 },
  { top: '72%', left: '58%', size: 8 },
];

const ParallaxBackground = () => {
  const { scrollY } = useScroll();
  const ySlow = useTransform(scrollY, [0, 1200], [0, 220]);
  const yFast = useTransform(scrollY, [0, 1200], [0, -320]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springX = useSpring(pointerX, { damping: 40, stiffness: 240 });
  const springY = useSpring(pointerY, { damping: 40, stiffness: 240 });

  useEffect(() => {
    const handleMove = (event) => {
      pointerX.set((event.clientX - window.innerWidth / 2) * 0.06);
      pointerY.set((event.clientY - window.innerHeight / 2) * 0.06);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [pointerX, pointerY]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ y: ySlow, x: springX }}
        className="absolute -right-[16%] -top-[15%] h-[58vw] w-[58vw] rounded-full bg-primary/12 blur-[130px]"
      />

      <motion.div
        style={{ y: yFast, x: springY }}
        className="absolute -bottom-[22%] -left-[18%] h-[52vw] w-[52vw] rounded-full bg-accent/10 blur-[140px]"
      />

      <div className="data-grid absolute inset-0 opacity-[0.16]" />

      {ORB_POSITIONS.map((orb, index) => (
        <motion.span
          key={`${orb.top}-${orb.left}`}
          style={{ top: orb.top, left: orb.left }}
          className="absolute rounded-full bg-primary/20 blur-sm"
          animate={{
            y: [0, -32, 0],
            opacity: [0.25, 0.55, 0.25],
          }}
          transition={{
            duration: 6 + index,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.35,
          }}
          initial={{
            width: orb.size,
            height: orb.size,
          }}
        />
      ))}
    </div>
  );
};

export default ParallaxBackground;
