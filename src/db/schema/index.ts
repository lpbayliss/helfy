// Export all schema tables
export * from './biometrics.js';
export * from './workouts.js';

// Re-export for convenience
import { biometrics } from './biometrics.js';
import { workouts, exerciseSets } from './workouts.js';

export const schema = {
  biometrics,
  workouts,
  exerciseSets,
};