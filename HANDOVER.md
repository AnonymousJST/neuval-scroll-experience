# Handover Documentation: Neuval Scroll Experience

> **STATUS:** STABLE / REFACTORED (Data-Driven)
> **VERSION:** 2.3.0 (Visual Enhancements + Cleanup)

## 1. Project Overview
This is a **high-end, award-winning scroll experience** built with **React, TypeScript, Tailwind CSS, and Framer Motion**.

**Recent Updates:**
- **v2.3.0:** Visual enhancements (radial gradient background, glowing SVG path), renamed "horizontal" section to "outro".
- **v2.2.0:** Technical debt cleanup (removed duplicate type files, unused dependencies).
- **v2.1.0:** Refactored to be Data-Driven with dynamic content generation.

## 2. Global Rules (GEMINI.md Compatibility)
**CRITICAL:** The next agent *MUST* read `~/.gemini/GEMINI.md` immediately.
- **Persona:** Strict Mentor & Realist.
- **Standards:** Awwwards/FWA Quality only. No cheap hacks.

## 3. Architecture & Key Components
> **See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the complete visual baseline, component map, and configuration details.**

### `src/config/storyData.ts` (The Brain)
- **Role:** The Single Source of Truth for all narrative content.
- **Usage:** Add new objects to the `STORY_DATA` array to automatically generate new slides.
- **Block Types:** `hero`, `duo`, `sequence`, `outro`

### `src/components/ScrollStory.tsx` (The Engine)
- **Role:** Orchestrates the "Split-Stack" rendering (Images vs Text) for proper mix-blend modes.
- **Logic:** Dynamically calculates scroll trigger points based on `STORY_DATA`.

### `src/components/StoryBlock.tsx` (The Unit)
- **Role:** Generic, reusable component that handles layout and animations for duo blocks.

### `src/components/ScrollPathAnimation.tsx` (The Visual)
- **Role:** Renders the animated SVG path with glowing effect.
- **Enhancement:** Dual-layer drop-shadow filter for premium glow.

### `src/utils/pathGenerator.ts` (The Artist)
- **Role:** Mathematically generates the SVG path data string.
- **Logic:** Extends the "Snake" curve pattern as more blocks are added.

## 4. How to Extend

### Basic: Add a Standard Slide
1. Open `src/config/storyData.ts`.
2. Add a new `duo` block object to the array.
3. **That's it.** Height, path, and animation triggers auto-adjust.

### Advanced: Create a New Block Type
1. **Define It:** Update `src/types/story.ts` to include your new type.
2. **Config It:** Add your block to `storyData.ts` with the new type.
3. **Render It:** Add conditional rendering in `ScrollStory.tsx`.

## 5. Visual Enhancements (v2.3.0)

### Radial Gradient Background
Applied to root container in `App.tsx`:
```css
background: radial-gradient(circle at 50% 40%, #0a0a0a 0%, #000000 60%);
```

### Glowing SVG Path
Applied to `<svg>` in `ScrollPathAnimation.tsx`:
```css
filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6)) 
        drop-shadow(0 0 16px rgba(255, 255, 255, 0.3));
```

## 6. Known "Gotchas"
1. **Split-Stack Synchronization:** `ScrollStory` renders blocks *twice* (images, then text). Intentional for `mix-blend-difference`.
2. **Path Parity:** `pathGenerator` has hardcoded logic for first 2 blocks for pixel-perfect matching.
3. **No Hooks in Loops:** `StoryBlock` handles its own hooks. Don't hoist `useTransform` to `ScrollStory`.

## 7. Commands
- `npm run dev`: Start local server.
- `npm run lint`: Check for code issues.
- `npm run build`: Production build.
