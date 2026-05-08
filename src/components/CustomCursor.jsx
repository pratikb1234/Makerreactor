import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  
  // Use MotionValues for instant updates without React re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'button' || 
          e.target.tagName.toLowerCase() === 'a' || 
          e.target.closest('button') || 
          e.target.closest('a') ||
          e.target.classList.contains('cursor-hover') ||
          e.target.closest('.cursor-hover')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#FF5A00] pointer-events-none z-[9999] hidden md:block"
        style={{
          translateX: "-50%",
          translateY: "-50%",
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          backgroundColor: isHovering ? '#FF5A00' : 'rgba(255, 90, 0, 0)',
          opacity: isHovering ? 0.2 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
      {/* Inner Dot - Zero Latency */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FF5A00] pointer-events-none z-[9999] hidden md:block"
        style={{
          translateX: "-50%",
          translateY: "-50%",
          x: mouseX,
          y: mouseY,
        }}
        animate={{
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
