import type { StoryBlock } from '../types/story';
import revealImage from '../assets/reveal-image.png';
import revealImage2 from '../assets/reveal-image-2.png';

export const STORY_DATA: StoryBlock[] = [
    // 1. Intro "HERO" Block (The "SCROLL" text)
    // Currently handled separately in App.tsx, but mapping it here for completeness if we unify completely.
    // For now, we will focus on the 'Slide 1' and 'Slide 2' equivalence.

    {
        id: "slide-1",
        type: "duo",
        layout: "image-left",
        image: revealImage2, // Matches existing Slide 1 (swapped logic in current code)
        text: "Simplicity is the ultimate sophistication.",
        signature: "~ CTM"
    },
    {
        id: "slide-2",
        type: "duo",
        layout: "image-right",
        image: revealImage, // Matches existing Slide 2
        text: "Chasing the truth means chasing your dream.",
        signature: "~ JHB"
    },
    {
        id: "outro-sequence",
        type: "sequence",
        text: "Continuity|Consistency|Connection"
    },
    {
        id: "outro-1",
        type: "outro",
        items: [
            {
                text: "The path is not linear.",
                image: "" // Empty or remove property if type allows optional
            },
            {
                text: "It extends beyond the frame.",
                image: ""
            }
        ]
    }
];
