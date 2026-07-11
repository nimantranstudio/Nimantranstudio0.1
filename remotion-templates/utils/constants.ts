export const FPS = 30;

// Scene timings in seconds
export const SCENE_1_DURATION = 5;
export const SCENE_2_DURATION = 8;
export const SCENE_3_DURATION = 5;
export const SCENE_4_DURATION = 5;
export const SCENE_5_DURATION = 7;

// Frame counts
export const SCENE_1_FRAMES = SCENE_1_DURATION * FPS;
export const SCENE_2_FRAMES = SCENE_2_DURATION * FPS;
export const SCENE_3_FRAMES = SCENE_3_DURATION * FPS;
export const SCENE_4_FRAMES = SCENE_4_DURATION * FPS;
export const SCENE_5_FRAMES = SCENE_5_DURATION * FPS;

export const TOTAL_DURATION_FRAMES =
  SCENE_1_FRAMES +
  SCENE_2_FRAMES +
  SCENE_3_FRAMES +
  SCENE_4_FRAMES +
  SCENE_5_FRAMES; // 900 frames = 30s
