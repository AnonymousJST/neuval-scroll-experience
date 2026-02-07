import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { STORY_DATA } from '../config/storyData';
import { StoryBlock } from './StoryBlock';

// --- DATA PREP ---
const DUO_BLOCKS = STORY_DATA.filter(b => b.type === 'duo');
const SEQUENCE_BLOCK = STORY_DATA.find(b => b.type === 'sequence');
const OUTRO_BLOCK = STORY_DATA.find(b => b.type === 'outro');

// --- DYNAMIC CALCULATOR ---
const HEIGHT_PER_DUO = 400; // vh
const OUTRO_SCROLL_HEIGHT = 400; // vh extra for the outro section
const TOTAL_HEIGHT_VH = (DUO_BLOCKS.length * HEIGHT_PER_DUO) + (OUTRO_BLOCK ? OUTRO_SCROLL_HEIGHT : 0);

// TIMING SAFEGUARD:
// We must ensure that the "Vertical" section finishes at the exact same physical scroll pixel as before.
// Old Total: 2 * 400 = 800vh.
// Old Ratio: 0.8.
// Effective Vertical Scroll Range: 0 to 0.8 of 800vh.

// New Total: 800 + 400 = 1200vh.
// The "Vertical" content still occupies the first 800vh.
// So the vertical section now ends at (800 / 1200) = 0.66 of the new global scroll.
const VERTICAL_FRACTION = (DUO_BLOCKS.length * HEIGHT_PER_DUO) / TOTAL_HEIGHT_VH;

// We need the vertical blocks to distribute themselves within 0 -> VERTICAL_FRACTION * CONSTANT_RATIO?
// Actually simplest way:
// Map 0 -> VERTICAL_FRACTION of global scroll to 0 -> 1 of "Vertical Progress".
// Pass this "Virtual Vertical Progress" to the blocks.


// --- SUB COMPONENTS ---

const WordSequence = ({ scrollYProgress, start, end }: { scrollYProgress: MotionValue<number>, start: number, end: number }) => {
    if (!SEQUENCE_BLOCK || !SEQUENCE_BLOCK.text) return null;

    const words = SEQUENCE_BLOCK.text.split('|');
    // Distribute words within the [start, end] range
    const rangeSize = end - start;
    const step = rangeSize / words.length; // Crude distribution

    // Hardcoded logic adaptation for parity with original "0.8 -> 1.0" relative feel
    // Word 1: 0% -> 30% of range
    // Word 2: 30% -> 60% of range
    // Word 3: 60% -> 100% of range

    const w1s = start; const w1e = start + (rangeSize * 0.3);
    const w2s = w1e; const w2e = start + (rangeSize * 0.6);
    const w3s = w2e; const w3e = end;
    // We extend the last word visibility slightly into the "hold" phase

    const wordRanges = [
        { display: [w1s, w1e], opacityInput: [w1s, w1e], opacityOutput: [1, 0] },
        { display: [w1e, w2e], opacityInput: [w1e, w1e + 0.01, w2e], opacityOutput: [0, 1, 0] },
        { display: [w2e, end + 0.05], opacityInput: [w2e, w2e + 0.05, end], opacityOutput: [0, 1, 0] } // Fade "Connection" out as it approaches the end
    ];

    const WordItem = ({ word, index }: { word: string, index: number }) => {
        const range = wordRanges[index] || wordRanges[wordRanges.length - 1];
        const opacity = useTransform(scrollYProgress, range.opacityInput, range.opacityOutput);
        const display = useTransform(scrollYProgress, (v) =>
            (v >= range.display[0] && v < range.display[1]) ? 'block' : 'none'
        );

        return (
            <motion.h2 style={{ display, opacity }} className="text-4xl font-serif text-white italic absolute">
                {word}
            </motion.h2>
        );
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-difference">
            {words.map((word, i) => <WordItem key={i} word={word} index={i} />)}
        </div>
    );
};

const OutroSection = ({ scrollYProgress, start, end, data }: { scrollYProgress: MotionValue<number>, start: number, end: number, data: any }) => {
    if (!data || !data.items) return null;

    // Calculate scroll ranges for each section (2 items, 50% each)
    const scrollRange = end - start;
    const sectionDuration = scrollRange / 2; // Divide into 2 equal sections

    // Section 1: First phrase (start → start + sectionDuration)
    const section1Start = start;
    const section1End = start + sectionDuration;
    const item1_opacity = useTransform(
        scrollYProgress,
        [section1Start, section1Start + 0.05, section1End - 0.05, section1End],
        [0, 1, 1, 0]
    );

    // Section 2: Second phrase (start + sectionDuration → end)
    const section2Start = section1End;
    const section2End = end;
    const item2_opacity = useTransform(
        scrollYProgress,
        [section2Start, section2Start + 0.05, section2End - 0.05, section2End],
        [0, 1, 1, 0]
    );

    return (
        <>
            {/* Section 1: First Phrase */}

            {/* Section 2: Second Phrase */}
            <motion.div
                style={{ opacity: item1_opacity }}
                className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black z-10"
            >
                <p className="text-4xl font-serif text-white italic text-center max-w-2xl px-20">
                    {data.items[0]?.text}
                </p>
            </motion.div>


            <motion.div
                style={{ opacity: item2_opacity }}
                className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black z-10"
            >
                <p className="text-4xl font-serif text-white italic text-center max-w-2xl px-20">
                    {data.items[1]?.text}
                </p>
            </motion.div>
        </>
    );
};


// --- MAIN COMPONENT ---
export const ScrollStory = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // VIRTUAL PROGRESS MAPPING
    // Vertical section runs from 0.0 to VERTICAL_FRACTION
    // We map that [0, VF] -> [0, 1] so the internal components behave as if they have the full scroll.
    const verticalProgress = useTransform(scrollYProgress, [0, VERTICAL_FRACTION], [0, 1]);

    // Derived Constants for Vertical Logic
    // Original logic used 0.8 as the "Content End" point relative to a full scroll.
    // We keep that ratio for the *virtual* progress.
    const CONTENT_SCROLL_RATIO = 0.8;
    const SEGMENT_SIZE = CONTENT_SCROLL_RATIO / DUO_BLOCKS.length;

    // Word Sequence usually happened from 0.8 to 1.0 (relative to vertical end)
    // Now it happens from 0.8 to 1.0 of VERTICAL_FRACTION.
    // We need to pass the *actual global* start/end points to WordSequence if we want it to be precise?
    // Actually, if we pass `verticalProgress` to WordSequence, it will think it's 0->1. 
    // BUT WordSequence in my previous code used hardcoded ranges [0.80, 0.86] etc.
    // So passing `verticalProgress` works perfectly! It preserves the relative timing.

    // WAIT. WordSequence needs `Display` toggle. 
    // If verticalProgress > 1 (which handles the Horizontal part), the words might disappear or glitch?
    // Yes, useTransform clamps by default? No.
    // We need to make sure WordSequence stays visible or hands off correctly.
    // The last word "Connection" needs to stay visible until the Horizontal Layer (z-10) covers it.

    return (
        <div ref={containerRef} className={`relative`} style={{ height: `${TOTAL_HEIGHT_VH}vh` }}>

            {/* --- VERTICAL SECTION --- */}
            {/* STACK 1: IMAGES */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                {DUO_BLOCKS.map((block, i) => {
                    const enterStart = (i * SEGMENT_SIZE) + 0.05;
                    const config = {
                        enterStart,
                        enterEnd: enterStart + 0.20,
                        fadeStart: enterStart + 0.25,
                        fadeEnd: enterStart + 0.35
                    };
                    return (
                        <StoryBlock
                            key={`img-${block.id}`}
                            data={block}
                            mode="image"
                            index={i}
                            scrollYProgress={verticalProgress} // Using Virtual Progress
                            config={config}
                        />
                    );
                })}
            </div>

            {/* STACK 2: TEXT */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden mix-blend-difference -mt-[100vh]">
                {DUO_BLOCKS.map((block, i) => {
                    const enterStart = (i * SEGMENT_SIZE) + 0.05;
                    const config = {
                        enterStart,
                        enterEnd: enterStart + 0.20,
                        fadeStart: enterStart + 0.25,
                        fadeEnd: enterStart + 0.35
                    };
                    return (
                        <StoryBlock
                            key={`txt-${block.id}`}
                            data={block}
                            mode="text"
                            index={i}
                            scrollYProgress={verticalProgress} // Using Virtual Progress
                            config={config}
                        />
                    );
                })}

                {/* FINAL WORD SEQUENCE */}
                {/* Passing virtual progress ranges: 0.8 to 1.0 */}
                <WordSequence scrollYProgress={verticalProgress} start={0.8} end={1.0} />
            </div>


            {/* --- OUTRO SECTION --- */}
            {OUTRO_BLOCK && (
                <OutroSection
                    scrollYProgress={scrollYProgress} // Uses GLOBAL progress (Real Time)
                    start={VERTICAL_FRACTION}
                    end={1.0}
                    data={OUTRO_BLOCK}
                />
            )}

        </div>
    );
};
