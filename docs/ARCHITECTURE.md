# Architecture & Animation Guide

## The "Split-Layer" Strategy

To achieve the effect where **Text inverts** (white text turns black on white backgrounds) but **Images do not** (they stay full color), we use a "Split-Stack" architecture in `ScrollStory.tsx`.

### The Problem

Applying `mix-blend-difference` to a parent container affects _everything_ inside it, including images (making them look like negatives).

### The Solution

We render two identical, overlapping coordinate systems (Stacks):

1.  **Stack 1 (Bottom): Images**
    - Contains only `<img>` elements.
    - **No Blend Mode.**
    - Images render normally.

2.  **Stack 2 (Top): Text**
    - Contains only Text elements.
    - **`mix-blend-difference` applied to the Container.**
    - Since the text is white, it inverts against whatever is behind it (the images from Stack 1 or the background).
    - Has `-mt-[100vh]` to pull it visually on top of Stack 1.

> **CRITICAL:** Both stacks share the exact same `MotionValues` (`x`, `opacity`, `scale`). This ensures they move fully synchronized, appearing as one unified element to the user.

---

## Animation Configuration

All timing logic is centralized in the `ANIMATION_CONFIG` constant at the top of `ScrollStory.tsx`.

```typescript
const ANIMATION_CONFIG = {
  SLIDE_1: {
    ENTER_START: 0.05, // Scroll % (0.0 - 1.0)
    ENTER_END: 0.25,
    FADE_START: 0.3,
    FADE_END: 0.4,
    // ...
  },
  // ...
};
```

### How to Tune

- **To make a slide appear earlier:** Decrease `ENTER_START`.
- **To make a slide stay longer (Hold):** Increase the gap between `ENTER_END` and `FADE_START`.
- **To slow down the whole experience:** Increase the `h-[800vh]` class in the main container.

---

## Word Sequence (The "Pin")

At the bottom of the scroll (approx 80%-100%), the layout stops moving ("Pinned") and a sequence of words cycle through.
This is controlled by the `WordSequence` sub-component.

- **Logic:** Uses specific `useTransform` ranges to toggle `display: block/none` and animate `opacity`.
- **Editing:** To change words, edit the hardcoded render in `<WordSequence />` and adjust `ANIMATION_CONFIG.WORD_SEQUENCE` timings.

## Future Scalability

Currently, slides are manually declared (`opacity1`, `opacity2`).
**Recommendation:** For 5+ slides, refactor to a `.map()` based approach using a configuration array to auto-generate the motion hooks.
