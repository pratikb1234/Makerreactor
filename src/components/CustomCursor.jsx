import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, animate } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [autoPilot, setAutoPilot] = useState(true);
  const autoPilotCancelled = useRef(false);
  const initialMousePos = useRef(null);
  
  const mouseX = useMotionValue(-40);
  const mouseY = useMotionValue(-40);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      setAutoPilot(false);
      autoPilotCancelled.current = true;
      return;
    }

    const cancelAutoPilot = () => {
      if (!autoPilotCancelled.current) {
        autoPilotCancelled.current = true;
        setAutoPilot(false);
      }
    };

    // Track initial mouse position — only cancel if user moves > 30px (intentional)
    const trackMouse = (e) => {
      if (autoPilotCancelled.current) return;
      if (!initialMousePos.current) {
        initialMousePos.current = { x: e.clientX, y: e.clientY };
        return;
      }
      const dx = e.clientX - initialMousePos.current.x;
      const dy = e.clientY - initialMousePos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 30) {
        cancelAutoPilot();
        window.removeEventListener('mousemove', trackMouse);
      }
    };

    window.addEventListener('mousemove', trackMouse);

    const timer = setTimeout(() => {
      if (autoPilotCancelled.current) return;

      const btn = document.getElementById('power-switch-btn');
      if (!btn) {
        cancelAutoPilot();
        return;
      }

      const rect = btn.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      // Start from top-center of viewport
      mouseX.set(window.innerWidth / 2);
      mouseY.set(-20);

      const duration = 1.8;
      const xAnim = animate(mouseX, targetX, {
        duration,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          if (autoPilotCancelled.current) return;
          
          setIsHovering(true);
          
          setTimeout(() => {
            if (autoPilotCancelled.current) return;
            btn.click();
            
            setTimeout(() => {
              setIsHovering(false);
              cancelAutoPilot();
              window.removeEventListener('mousemove', trackMouse);
            }, 300);
          }, 400);
        }
      });

      const yAnim = animate(mouseY, targetY, {
        duration,
        ease: [0.22, 1, 0.36, 1],
      });

      // If user intentionally moves mouse during flight, abort
      const abortOnMove = (e) => {
        if (autoPilotCancelled.current) {
          xAnim.stop();
          yAnim.stop();
        }
      };
      window.addEventListener('mousemove', abortOnMove);
      
      // Clean up abort listener when animation ends
      const cleanup = setTimeout(() => {
        window.removeEventListener('mousemove', abortOnMove);
      }, (duration + 1) * 1000);

    }, 1500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', trackMouse);
    };
  }, []);

  useEffect(() => {
    const updateMousePosition = (e) => {
      if (autoPilot) return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (autoPilot) return;
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
  }, [autoPilot, mouseX, mouseY]);

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
      {/* Inner Dot */}
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
