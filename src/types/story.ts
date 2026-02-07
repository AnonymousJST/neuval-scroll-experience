export type BlockType = 'hero' | 'duo' | 'sequence' | 'outro';

export interface StoryBlock {
    id: string;
    type: BlockType;
    // Content
    text?: string;
    image?: string;
    signature?: string;
    // Layout
    layout?: 'image-left' | 'image-right' | 'centered';
    // Configuration adjustments
    theme?: 'dark' | 'light';
    // Horizontal specific
    items?: {
        text: string;
        image?: string; // Optional
    }[];
}
