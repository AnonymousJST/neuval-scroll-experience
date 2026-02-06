import { motion, useScroll, useSpring } from 'framer-motion';

// --- CONFIGURATION ---
const PATH_CONFIG = {
  SVG_VIEWBOX: "0 0 400 1200",
  PATH_DATA: "M 200 0 C 200 200, 100 400, 100 600 C 100 800, 300 1000, 200 1200",
  PHYSICS: {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  },
  STROKE: {
    MOBILE: "8",
    DESKTOP_CLASS: "md:stroke-[12px]"
  }
};

export const ScrollPathAnimation = () => {
  // Track global scroll progress (no target = global window)
  const { scrollYProgress } = useScroll();

  const pathLength = useSpring(scrollYProgress, PATH_CONFIG.PHYSICS);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <svg className="w-full h-full" viewBox={PATH_CONFIG.SVG_VIEWBOX} preserveAspectRatio="none">
        <motion.path
          d={PATH_CONFIG.PATH_DATA}
          fill="none"
          stroke="white"
          strokeWidth={PATH_CONFIG.STROKE.MOBILE} // Mobile default
          className={PATH_CONFIG.STROKE.DESKTOP_CLASS} // Desktop override (using tailwind class if possible, or style)
          strokeLinecap="round"
          style={{ 
            pathLength,
            strokeWidth: `var(--stroke-width, 12px)` // Fallback or CSS var
          }}
        />
      </svg>
    </div>
  );
};
