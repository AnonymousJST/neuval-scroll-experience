/**
 * Generates the SVG path data string dynamically.
 * 
 * ORIGINAL PATH: "M 200 0 C 200 200, 100 400, 100 600 C 100 800, 300 1000, 200 1200"
 * 
 * Logic Breakdown:
 * - Start: Center Top (200, 0)
 * - Curve 1 (Left Swing): Ends at (100, 600)
 *   - Control 1: (200, 200) -> Starts vertical
 *   - Control 2: (100, 400) -> Guides into the left point
 * - Curve 2 (Right Swing/Return): Ends at (200, 1200)
 *   - Control 1: (100, 800) -> Leaves the left point
 *   - Control 2: (300, 1000) -> Swings right before centering
 * 
 * To make this modular:
 * We need a pattern that repeats. 
 * The current pattern is roughly: Center -> Left -> Center (End).
 * 
 * If we add more blocks, we probably want an alternating "Snake" pattern:
 * Center -> Left -> Center -> Right -> Center ...
 */

export const generatePathData = (blockCount: number): string => {
    // Standard unit height per block block (based on current 600px segments)
    const CENTER_X = 200;

    let path = `M ${CENTER_X} 0`;
    let currentY = 0;
    const SEGMENT_HEIGHT = 600; // Height of one curve segment

    for (let i = 0; i < blockCount; i++) {
        // HARDCODED OVERRIDE FOR EXACT MATCH of first 2 blocks to preserve original art
        if (i === 0) {
            // M 200 0 C 200 200, 100 400, 100 600
            currentY += SEGMENT_HEIGHT;
            path += ` C 200 ${currentY - 400}, 100 ${currentY - 200}, 100 ${currentY}`;
        } else if (i === 1) {
            // C 100 800, 300 1000, 200 1200
            currentY += SEGMENT_HEIGHT;
            path += ` C 100 ${currentY - 400}, 300 ${currentY - 200}, 200 ${currentY}`;
        } else {
            // Extension Logic (New Blocks) - Alternating "Snake" Pattern
            currentY += SEGMENT_HEIGHT;

            if (i % 2 === 0) {
                // Going OUT (Left) - Mimics Block 0
                path += ` C 200 ${currentY - 400}, 100 ${currentY - 200}, 100 ${currentY}`;
            } else {
                // Returning to Center - Mimics Block 1
                path += ` C 100 ${currentY - 400}, 300 ${currentY - 200}, 200 ${currentY}`;
            }
        }
    }

    return path;
};

export const getViewBox = (blockCount: number): string => {
    // Width 400 is fixed. Height depends on blocks.
    const height = blockCount * 600;
    return `0 0 400 ${height}`;
};
