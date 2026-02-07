import { motion, MotionValue, useTransform } from 'framer-motion';
import type { StoryBlock as StoryBlockType } from '../types/story';
import { useState } from 'react';

// --- SHARED COMPONENTS ---
interface TypewriterProps {
    text: string;
    trigger: boolean;
    delayStart?: number;
    className?: string;
}

export const TypewriterText = ({ text, trigger, delayStart = 0, className = "text-5xl" }: TypewriterProps) => {
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

// --- MAIN COMPONENT ---
interface AnimationConfig {
    enterStart: number;
    enterEnd: number;
    fadeStart: number;
    fadeEnd: number;
}

interface Props {
    data: StoryBlockType;
    mode: 'image' | 'text';
    scrollYProgress: MotionValue<number>;
    config: AnimationConfig;
    index: number; // For parity logic (alternating Scale/Side)
}

const GLOBAL_CONF = {
    SLIDE_DISTANCE: "50vw",
    ZOOM_IN: 1.05,
    ZOOM_OUT: 0.95,
};

export const StoryBlock = ({ data, mode, scrollYProgress, config, index }: Props) => {
    // --- HOOK GENERATION (Safe here) ---
    // 1. Opacity
    const opacity = useTransform(scrollYProgress,
        [config.enterStart, config.enterEnd, config.fadeStart, config.fadeEnd],
        [0, 1, 1, 0]
    );

    // 2. X Position (Slide)
    const isLeft = data.layout === 'image-left';
    const startX = isLeft ? `-${GLOBAL_CONF.SLIDE_DISTANCE}` : GLOBAL_CONF.SLIDE_DISTANCE;
    const x = useTransform(scrollYProgress,
        [config.enterStart, config.enterEnd],
        [startX, "0vw"]
    );

    // 3. Scale (Alternating Zoom In / Zoom Out)
    const isEven = index % 2 === 0; // 0, 2...
    // Even blocks (Slide 1, index 0): Zoom OUT during FADE phase (Original behavior)
    // Odd blocks (Slide 2, index 1): Zoom IN during ENTER phase (Original behavior)

    let scale;
    if (isEven) {
        scale = useTransform(scrollYProgress,
            [config.fadeStart, config.fadeEnd],
            [1, GLOBAL_CONF.ZOOM_OUT]
        );
    } else {
        scale = useTransform(scrollYProgress,
            [config.enterStart, config.enterEnd],
            [GLOBAL_CONF.ZOOM_IN, 1]
        );
    }

    // 4. Typing Trigger (State)
    const [triggerTyping, setTriggerTyping] = useState(false);

    // We can use a lightweight listener instead of useTransform loop in parent
    useTransform(scrollYProgress, (v) => {
        const shouldType = (v > config.enterEnd && v < config.fadeEnd);
        if (triggerTyping !== shouldType) {
            setTriggerTyping(shouldType);
        }
        return v;
    });

    // --- RENDER ---
    const isLayoutLeft = data.layout === 'image-left';

    // Configurable Delays
    const textLen = data.text ? data.text.length : 0;
    const quoteDuration = textLen * 0.03;
    const signatureDelay = quoteDuration + 0.5;

    // Surgical Mask Replication
    const getMaskStyle = () => {
        if (data.id === 'slide-1') return "radial-gradient(circle at center, black 30%, transparent 85%)";
        if (data.id === 'slide-2') return "radial-gradient(circle at center, black 40%, transparent 85%)";
        return "radial-gradient(circle at center, black 35%, transparent 85%)";
    };

    return (
        <motion.div
            style={{ opacity, x, scale }}
            className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
        >
            <div className={`w-full h-full md:max-w-[90%] flex flex-col md:flex-row items-center justify-center md:justify-between ${!isLayoutLeft ? 'md:flex-row-reverse' : ''}`}>

                {/* 1. Image Container */}
                <div className={`w-full md:w-[45%] h-[40vh] md:h-[70vh] flex items-center justify-center md:${isLayoutLeft ? 'justify-end pr-10' : 'justify-start pl-10'}`}>
                    {mode === 'image' && data.image && (
                        <img
                            src={data.image}
                            alt="Visual"
                            className="h-full w-auto object-contain drop-shadow-2xl"
                            style={{
                                maxWidth: '100%',
                                maskImage: getMaskStyle(),
                                WebkitMaskImage: getMaskStyle()
                            }}
                        />
                    )}
                </div>

                {/* 2. Text Container */}
                <div className={`w-full md:w-[45%] text-white flex flex-col items-center md:items-start text-center md:text-left ${!isLayoutLeft ? 'md:items-end md:text-right' : ''} ${isLayoutLeft ? 'md:pl-10' : 'md:pr-10'}`}>
                    {mode === 'text' && data.text && (
                        <div className="px-6 md:px-0 mt-4 md:mt-0">
                            <TypewriterText
                                text={data.text}
                                trigger={triggerTyping}
                                className="text-3xl md:text-5xl"
                            />
                            {data.signature && (
                                <div className="mt-4 md:mt-6">
                                    <TypewriterText
                                        text={data.signature}
                                        trigger={triggerTyping}
                                        delayStart={signatureDelay}
                                        className="text-xl md:text-3xl opacity-80"
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
