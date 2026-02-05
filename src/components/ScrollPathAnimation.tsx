import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollPathAnimation = () => {
  // Track global scroll progress (no target = global window)
  const { scrollYProgress } = useScroll();

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
         <svg className="w-full h-full" viewBox="0 0 400 1200" preserveAspectRatio="none">
          <motion.path
            d="M 200 0 C 200 200, 100 400, 100 600 C 100 800, 300 1000, 200 1200"
            fill="none"
            stroke="white"
            strokeWidth="12"
            strokeLinecap="round"
            style={{ pathLength }}
          />
        </svg>
    </div>
  );
};
