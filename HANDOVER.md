# Handover Documentation: Neuval Scroll Experience

> **STATUS:** STABLE / PRODUCTION-READY
> **VERSION:** 2.0.0 (Mobile Optimized)

## 1. Project Overview
This is a **high-end, award-winning scroll experience** built with **React, TypeScript, Tailwind CSS, and Framer Motion**. usage of any other styling libraries is strictly forbidden.

**Core Philosophy:** "Simplicity is the ultimate sophistication."
The site features a continuous SVG path that draws itself as the user scrolls, unlocking a narrative sequence of images and text.

## 2. Global Rules (GEMINI.md Compatibility)
**CRITICAL:** The next agent *MUST* read `~/.gemini/GEMINI.md` immediately.
- **Persona:** Strict Mentor & Realist.
- **Standards:** Awwwards/FWA Quality only. No cheap hacks.
- **Workflow:** Mobile First. Centralized Configs. No Magic Numbers.

## 3. Architecture & Key Components

### `src/App.tsx` (Entry Point)
- **Role:** Orchestrator. Manages the layout container (black background, sticky positioning).
- **Structure:**
  - `ScrollPathAnimation`: The background SVG layer.
  - `ScrollStory`: The foreground narrative layer.
  - `Intro Section`: The "SCROLL" hero text.

### `src/components/ScrollPathAnimation.tsx`
- **Role:** Draws the central "lifeline" curve.
- **Physics:** Controlled by `useSpring` (stiffness: 100, damping: 30).
- **Configuration:** `PATH_CONFIG` object (Centralized).
- **Responsiveness:** Stroke width adapts (8px mobile -> 12px desktop).

### `src/components/ScrollStory.tsx`
- **Role:** Handles the narrative reveal (Images, Typewriter Text, Word Sequence).
- **Logic:**
  - Uses `useScroll` tracking on a `800vh` container.
  - **Magic Numbers:** All tuning values (trigger points, fade start/end) are locked in `ANIMATION_CONFIG`.
  - **Mobile Layout:** "Editorial Stack" (Vertical) vs Desktop (Horizontal).
- **Components:**
  - `StorySlide`: Reusable component for Images/Text with directional logic.
  - `TypewriterText`: Staggered letter animation.
  - `WordSequence`: Final "Continuity -> Consistency -> Connection" fade sequence.

## 4. Configuration Points

| Component | Config Object | Purpose |
|Distilling|---|---|
| `ScrollPathAnimation` | `PATH_CONFIG` | SVG path data, Spring physics, Stroke widths. |
| `ScrollStory` | `ANIMATION_CONFIG` | Scroll trigger % (enter/fade), Zoom levels, Timing. |

## 5. Known "Gotchas"
1.  **Sticky Positioning:** `App.tsx` must typically avoid `overflow-hidden` on the *scroll container* itself for `sticky` to work, but here we use `min-h-screen` and `fixed` backgrounds. `ScrollStory` relies on `h-[800vh]`.
2.  **Mix-Blend-Mode:** We use `mix-blend-difference` for text over images/white backgrounds. This requires `z-index` management.
3.  **Mobile Masks:** Radial gradients are tuned differently for mobile to avoid hard edges.

## 6. Next Steps for Development
- **Thread the Needle:** This feature was *cancelled*. Do not implement unless explicitly re-requested.
- **Performance:** Watch out for heavy image assets. Currently using pngs.

## 7. Commands
- `npm run dev`: Start local server.
- **DO NOT** auto-browse. Only verify if requested.
