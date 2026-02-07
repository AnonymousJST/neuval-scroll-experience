# Neuval Website Test

> A high-performance, cinematic scrolling experience built with React, TypeScript, and Framer Motion.

## 🚀 Overview

This project implements a sophisticated "Scrollytelling" experience where content reveals, fades, and transforms based on user scroll position.

**Key Features:**

- **Dual-Layer Blending:** Text inverts color (`mix-blend-difference`) against the background while images remain standard.
- **Cinematic Timing:** Content "holds" in place for readability before transitioning.
- **Pinned Sequence:** A dedicated "Word Sequence" that cycles through brand values ("Continuity", "Consistency", "Connection") in place.
- **Glowing SVG Path:** A white animated path with a soft glow effect that draws as you scroll.
- **Radial Gradient Background:** Subtle center glow replacing flat black for added depth.
- **Optimized Performance:** Uses `framer-motion` optimized transforms (translate3d/opacity) for 60fps performance.

## 🛠 Tech Stack

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion (`useScroll`, `useTransform`)

## 📦 Installation

1.  **Clone the repo:**
    ```bash
    git clone <repo-url>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## 🏗 Architecture

The core logic resides in `src/components/ScrollStory.tsx`.
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a deep dive into the animation logic, blending strategies, and configuration guide.

## 📄 Project Structure

```
src/
├── components/
│   ├── ScrollStory.tsx         # Main animation controller (The "Story")
│   ├── ScrollPathAnimation.tsx # Background SVG path with glow
│   └── StoryBlock.tsx          # Reusable render unit for duo blocks
├── config/
│   └── storyData.ts            # Content configuration (Single Source of Truth)
├── types/
│   └── story.ts                # TypeScript interfaces
├── utils/
│   └── pathGenerator.ts        # Dynamic SVG path generation
├── assets/                     # Optimized images
├── App.tsx                     # Composition Root
└── index.css                   # Global styles
```

## 🎨 Visual Enhancements

- **Radial Gradient Background:** `radial-gradient(circle at 50% 40%, #0a0a0a 0%, #000000 60%)`
- **Glowing Path:** Dual-layer drop-shadow filter for premium feel
