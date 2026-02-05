import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, useState } from 'react';
import revealImage from '../assets/reveal-image.png';
import revealImage2 from '../assets/reveal-image-2.png';

// --- CONFIGURATION ---
// Centralized "Magic Numbers" for easy tuning
const ANIMATION_CONFIG = {
    // Scroll Triggers (0.0 - 1.0 of container height)
    SLIDE_1: {
        ENTER_START: 0.05,
        ENTER_END: 0.25,
        FADE_START: 0.30,
        FADE_END: 0.40,
        TYPING_TRIGGER: 0.25,
    },
    SLIDE_2: {
        ENTER_START: 0.45,
        ENTER_END: 0.65,
        FADE_START: 0.70,
        FADE_END: 0.75, // Fades out completely before sequence
        TYPING_TRIGGER: 0.65,
    },
    WORD_SEQUENCE: {
        START: 0.80, // Sequence starts here (huge buffer now)
        // Split the remaining 20% into 3 chunks
        WORD_1_START: 0.80, WORD_1_END: 0.86, // Continuity
        WORD_2_START: 0.86, WORD_2_END: 0.92, // Consistency
        WORD_3_START: 0.92, WORD_3_END: 1.0,  // Connection
    },
    // Visual Settings
    SLIDE_DISTANCE: "50vw",
    ZOOM_IN: 1.05,
    ZOOM_OUT: 0.95,
};

// --- TYPES ---
interface StorySlideProps {
    image: string;
    text: string;
    signature?: string; // Optional signature
    opacity: MotionValue<number>;
    x: MotionValue<string>;
    scale: MotionValue<number>;
    direction: 'left' | 'right';
    triggerTyping: boolean;
    maskStyle: string;
    mode: 'image' | 'text'; // New prop to split rendering
}

// --- SUB-COMPONENTS ---
interface TypewriterProps {
    text: string;
    trigger: boolean;
    delayStart?: number;
    className?: string; // Allow custom styling (size, margins)
}

const TypewriterText = ({ text, trigger, delayStart = 0, className = "text-5xl" }: TypewriterProps) => {
    if (!trigger) return <span className="opacity-0">{text}</span>;

    const letters = Array.from(text);
    return (
        <h2 className={`${className} font-serif leading-tight italic inline-block`}>
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.01, delay: delayStart + (index * 0.03) }}
                >
                    {letter}
                </motion.span>
            ))}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.8, delay: delayStart }}
                className="inline-block w-[2px] h-[1em] bg-white ml-2 align-middle"
            />
        </h2>
    );
};

const StorySlide = ({ image, text, signature, opacity, x, scale, direction, triggerTyping, maskStyle, mode }: StorySlideProps) => {
    const isLeft = direction === 'left';
    
    // Calculate delay for signature
    const quoteDuration = text.length * 0.03;
    const signatureDelay = quoteDuration + 0.5;

    return (
        <motion.div 
            style={{ opacity, x, scale }}
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
        >
            {/* Mobile: Flex-col (Vertical Stack), Desktop: Flex-row (Horizontal) */}
            <div className={`w-full h-full md:max-w-[90%] flex flex-col md:flex-row items-center justify-center md:justify-between ${!isLeft ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Image Side - Only Render in Image Mode */}
                {/* Mobile: Full Width, Top Half. Desktop: 45% Width, Full Height */}
                <div className={`w-full md:w-[45%] h-[40vh] md:h-[70vh] flex items-center justify-center md:${isLeft ? 'justify-end pr-10' : 'justify-start pl-10'}`}>
                    {mode === 'image' && (
                        <img 
                            src={image} 
                            alt="Portrait" 
                            className="h-full w-auto object-contain drop-shadow-2xl"
                            style={{ 
                                maxWidth: '100%',
                                maskImage: maskStyle,
                                WebkitMaskImage: maskStyle
                            }}
                        />
                    )}
                </div>

                {/* Text Side - Only Render in Text Mode */}
                {/* Mobile: Full Width, Bottom Half. Desktop: 45% Width, Full Height */}
                <div className={`w-full md:w-[45%] text-white flex flex-col items-center md:items-start text-center md:text-left ${!isLeft ? 'md:items-end md:text-right' : ''} ${isLeft ? 'md:pl-10' : 'md:pr-10'}`}>
                     {mode === 'text' && (
                        <div className="px-6 md:px-0 mt-4 md:mt-0">
                            <TypewriterText 
                                text={text} 
                                trigger={triggerTyping} 
                                className="text-3xl md:text-5xl" // Mobile: 3xl, Desktop: 5xl
                            />
                            {signature && (
                                <div className="mt-4 md:mt-6">
                                    <TypewriterText 
                                        text={signature} 
                                        trigger={triggerTyping} 
                                        delayStart={signatureDelay}
                                        className="text-xl md:text-3xl opacity-80" // Mobile: xl, Desktop: 3xl
                                    />
                                </div>
                            )}
                        </div>
                     )}
                </div>
            </div>
        </motion.div>
    );
};

const WordSequence = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
    // Word 1: Continuity
    const opacity1 = useTransform(scrollYProgress, 
        [ANIMATION_CONFIG.WORD_SEQUENCE.WORD_1_START, ANIMATION_CONFIG.WORD_SEQUENCE.WORD_1_END],
        [1, 0] // Fades OUT as we move to next
    );
    // Initial opacity for Word 1 (needs to be visible immediately as Section 2 fades out)
    const display1 = useTransform(scrollYProgress, (v) => 
        (v >= ANIMATION_CONFIG.WORD_SEQUENCE.WORD_1_START && v < ANIMATION_CONFIG.WORD_SEQUENCE.WORD_1_END) ? 'block' : 'none'
    );

    // Word 2: Consistency
    const opacity2 = useTransform(scrollYProgress, 
        [ANIMATION_CONFIG.WORD_SEQUENCE.WORD_1_END, ANIMATION_CONFIG.WORD_SEQUENCE.WORD_2_START, ANIMATION_CONFIG.WORD_SEQUENCE.WORD_2_END],
        [0, 1, 0] // Fade In -> Fade Out
    );
    const display2 = useTransform(scrollYProgress, (v) => 
        (v >= ANIMATION_CONFIG.WORD_SEQUENCE.WORD_1_END && v < ANIMATION_CONFIG.WORD_SEQUENCE.WORD_2_END) ? 'block' : 'none'
    );

    // Word 3: Connection (Final)
    const opacity3 = useTransform(scrollYProgress, 
        [ANIMATION_CONFIG.WORD_SEQUENCE.WORD_2_END, ANIMATION_CONFIG.WORD_SEQUENCE.WORD_3_START],
        [0, 1] // Fade In -> Stay
    );
    const display3 = useTransform(scrollYProgress, (v) => 
        (v >= ANIMATION_CONFIG.WORD_SEQUENCE.WORD_2_END) ? 'block' : 'none'
    );

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-difference">
            <motion.h2 
                style={{ display: display1, opacity: opacity1 }}
                className="text-4xl font-serif text-white italic"
            >
                Continuity
            </motion.h2>

            <motion.h2 
                style={{ display: display2, opacity: opacity2 }}
                className="text-4xl font-serif text-white italic"
            >
                Consistency
            </motion.h2>

            <motion.h2 
                style={{ display: display3, opacity: opacity3 }}
                className="text-4xl font-serif text-white italic"
            >
                Connection
            </motion.h2>
        </div>
    );
};

// --- MAIN COMPONENT ---
export const ScrollStory = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // -- ANIMATION LOGIC --
    // Slide 1 Transforms
    const opacity1 = useTransform(scrollYProgress, 
        [
            ANIMATION_CONFIG.SLIDE_1.ENTER_START, 
            ANIMATION_CONFIG.SLIDE_1.ENTER_END,
            ANIMATION_CONFIG.SLIDE_1.FADE_START,
            ANIMATION_CONFIG.SLIDE_1.FADE_END
        ], 
        [0, 1, 1, 0]
    );
    const x1 = useTransform(scrollYProgress, 
        [ANIMATION_CONFIG.SLIDE_1.ENTER_START, ANIMATION_CONFIG.SLIDE_1.ENTER_END],
        [`-${ANIMATION_CONFIG.SLIDE_DISTANCE}`, "0vw"]
    );
    const scale1 = useTransform(scrollYProgress, 
        [ANIMATION_CONFIG.SLIDE_1.FADE_START, ANIMATION_CONFIG.SLIDE_1.FADE_END],
        [1, ANIMATION_CONFIG.ZOOM_OUT]
    );

    // Slide 2 Transforms
    const opacity2 = useTransform(scrollYProgress, 
        [ANIMATION_CONFIG.SLIDE_2.ENTER_START, ANIMATION_CONFIG.SLIDE_2.ENTER_END, ANIMATION_CONFIG.SLIDE_2.FADE_START, ANIMATION_CONFIG.SLIDE_2.FADE_END],
        [0, 1, 1, 0] // Now fades out too!
    );
    const x2 = useTransform(scrollYProgress, 
        [ANIMATION_CONFIG.SLIDE_2.ENTER_START, ANIMATION_CONFIG.SLIDE_2.ENTER_END],
        [ANIMATION_CONFIG.SLIDE_DISTANCE, "0vw"]
    );
    const scale2 = useTransform(scrollYProgress, 
        [ANIMATION_CONFIG.SLIDE_2.ENTER_START, ANIMATION_CONFIG.SLIDE_2.ENTER_END],
        [ANIMATION_CONFIG.ZOOM_IN, 1]
    );

    // Typing Logic
    const [startTyping1, setStartTyping1] = useState(false);
    const [startTyping2, setStartTyping2] = useState(false);

    useTransform(scrollYProgress, (value) => {
        // Slide 1
        if (value > ANIMATION_CONFIG.SLIDE_1.TYPING_TRIGGER && value < ANIMATION_CONFIG.SLIDE_1.FADE_END && !startTyping1) setStartTyping1(true);
        if ((value < ANIMATION_CONFIG.SLIDE_1.TYPING_TRIGGER || value > ANIMATION_CONFIG.SLIDE_1.FADE_END) && startTyping1) setStartTyping1(false);

        // Slide 2
        if (value > ANIMATION_CONFIG.SLIDE_2.TYPING_TRIGGER && value < ANIMATION_CONFIG.SLIDE_2.FADE_END && !startTyping2) setStartTyping2(true);
        if ((value < ANIMATION_CONFIG.SLIDE_2.TYPING_TRIGGER || value > ANIMATION_CONFIG.SLIDE_2.FADE_END) && startTyping2) setStartTyping2(false);
        return value;
    });

    return (
        <div ref={containerRef} className="h-[800vh] relative">

            {/* STACK 1: IMAGES */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                 <StorySlide 
                    mode="image"
                    direction="left"
                    image={revealImage2} // Swapped: was revealImage
                    text="" 
                    opacity={opacity1}
                    x={x1}
                    scale={scale1}
                    triggerTyping={false}
                    maskStyle="radial-gradient(circle at center, black 30%, transparent 85%)" // Swapped: matched to image 2
                />
                <StorySlide 
                    mode="image"
                    direction="right"
                    image={revealImage} // Swapped: was revealImage2
                    text=""
                    opacity={opacity2}
                    x={x2}
                    scale={scale2}
                    triggerTyping={false}
                    maskStyle="radial-gradient(circle at center, black 40%, transparent 85%)" // Swapped: matched to image 1
                />
            </div>

            {/* STACK 2: TEXT */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden mix-blend-difference -mt-[100vh]">
                 <StorySlide 
                    mode="text"
                    direction="left"
                    image=""
                    text="Simplicity is the ultimate sophistication." // Swapped
                    signature="~ CTM" // Swapped
                    opacity={opacity1}
                    x={x1}
                    scale={scale1}
                    triggerTyping={startTyping1}
                    maskStyle=""
                />
                <StorySlide 
                    mode="text"
                    direction="right"
                    image=""
                    text="Chasing the truth means chasing your dream." // Swapped
                    signature="~ JHB" // Swapped
                    opacity={opacity2}
                    x={x2}
                    scale={scale2}
                    triggerTyping={startTyping2}
                    maskStyle=""
                />

                {/* FINAL WORD SEQUENCE */}
                <WordSequence scrollYProgress={scrollYProgress} />
            </div>

        </div>
    );
};
