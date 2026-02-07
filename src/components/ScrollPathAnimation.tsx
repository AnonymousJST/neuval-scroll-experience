import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { generatePathData, getViewBox } from '../utils/pathGenerator';
import { STORY_DATA } from '../config/storyData';

// Filter for Duo blocks (which drive the path length)
const DUO_BLOCKS = STORY_DATA.filter(b => b.type === 'duo');

// --- CONFIGURATION ---
const PATH_CONFIG = {
  // Config is now Dynamic
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
  const { scrollYProgress } = useScroll();
  // --- PHYSICS (Spring) ---
  // We want the path to finish drawing exactly when the Vertical Section ends.
  // The ScrollStory now tracks a "Vertical Fraction". We should mirror that logic or accept it as a prop?
  // For now, simpler: ScrollStory height is bigger, so global scroll is slower.
  // If we want the path to draw at the Same Speed as before, we need to map [0, VERTICAL_FRACTION] -> [0, 1].

  // Hardcoded match to ScrollStory logic for safety:
  const VERTICAL_HEIGHT = 800; // 2 blocks * 400
  const TOTAL_HEIGHT = 1200; // +400 outro section
  const VF = VERTICAL_HEIGHT / TOTAL_HEIGHT; // 0.66...

  const scrollSpring = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Map the global scroll to just the vertical section for drawing
  const pathLength = useTransform(scrollSpring, [0, VF], [0, 1]);

  // FADE OUT at the very end of the scroll (not at VF)
  // This prevents the SVG from appearing when scrolling past the outro section
  const opacity = useTransform(scrollSpring, [0.95, 1.0], [1, 0]);

  // Dynamic Generation
  const pathData = generatePathData(DUO_BLOCKS.length);
  const viewBox = getViewBox(DUO_BLOCKS.length);

  // Determine stroke width based on screen size (using tailwind classes for desktop)
  // This is a simplified approach; a more robust solution might use useMediaQuery or similar.
  const strokeWidth = PATH_CONFIG.STROKE.MOBILE; // Default for mobile

  return (
    <svg
      viewBox={viewBox}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${PATH_CONFIG.STROKE.DESKTOP_CLASS}`}
      style={{
        opacity,
        filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.3))'
      } as any}
      preserveAspectRatio="none"
    >
      <motion.path
        d={pathData}
        fill="none"
        stroke="white"
        strokeWidth={strokeWidth}
        style={{ pathLength }}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
