# Neuval Website Test

> A high-performance, cinematic scrolling experience built with React, TypeScript, and Framer Motion.

## 🚀 Overview

This project implements a sophisticated "Scrollytelling" experience where content reveals, fades, and transforms based on user scroll position.

**Key Features:**

- **Dual-Layer Blending:** Text inverts color (`mix-blend-difference`) against the background while images remain standard.
- **Cinematic Timing:** Content "holds" in place for readability before transitioning.
- **Pinned Sequence:** A dedicated "Word Sequence" at the bottom of the scroll that cycles through brand values in place.
- **Optimized Performance:** Uses `framer-motion` optimized transforms (translate3d/opacity) for 60fps performance on standard devices.

## 🛠 Tech Stack

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Nativewind philosophy)
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
│   ├── ScrollStory.tsx       # Main animation controller (The "Story")
│   └── ScrollPathAnimation.tsx # Background line animation
├── assets/                   # Optimized images
└── App.tsx                   # Composition Root
```
