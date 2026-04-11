/**
 * Task type definitions for Habit Dice
 */

export type TaskCategory = 'Mind' | 'Body' | 'Life' | 'Work';
export type EffortLevel = 'quick' | 'medium' | 'involved';

export interface Task {
  id: string;
  category: TaskCategory;
  title: string;
  description: string;
  effortLevel?: EffortLevel;
}

/**
 * Seed task library - 100+ tasks across 4 categories
 * Used on first app launch
 */
export const SEED_TASKS = [
  // Mind (25 tasks)
  {
    id: 'task_mind_001',
    category: 'Mind' as const,
    title: '5-minute meditation',
    description: 'Sit quietly and focus on your breath for 5 minutes',
    effortLevel: 'quick' as const,
  },
  {
    id: 'task_mind_002',
    category: 'Mind',
    title: 'Journal one thought',
    description: 'Write down one thought, idea, or feeling you had today',
    effortLevel: 'quick',
  },
  {
    id: 'task_mind_003',
    category: 'Mind',
    title: 'Learn one new word',
    description: 'Look up and remember one new word',
    effortLevel: 'quick',
  },
  {
    id: 'task_mind_004',
    category: 'Mind',
    title: 'Read a page',
    description: 'Read one page of a book or news article',
    effortLevel: 'quick',
  },
  {
    id: 'task_mind_005',
    category: 'Mind',
    title: 'Solve a puzzle',
    description: 'Complete a crossword, sudoku, or riddle',
    effortLevel: 'medium',
  },
  {
    id: 'task_mind_006',
    category: 'Mind',
    title: 'Brainstorm ideas',
    description: 'Write down 5 ideas for a problem or project',
    effortLevel: 'medium',
  },
  {
    id: 'task_mind_007',
    category: 'Mind',
    title: 'Reflect on the day',
    description: 'Spend 5 minutes thinking about what went well',
    effortLevel: 'quick',
  },
  {
    id: 'task_mind_008',
    category: 'Mind',
    title: 'Listen to a podcast',
    description: 'Listen to 15 minutes of a podcast on something interesting',
    effortLevel: 'quick',
  },
  {
    id: 'task_mind_009',
    category: 'Mind',
    title: 'Practice gratitude',
    description: 'Write down 3 things you are grateful for',
    effortLevel: 'quick',
  },
  {
    id: 'task_mind_010',
    category: 'Mind',
    title: 'Sketch or doodle',
    description: 'Draw or doodle for 10 minutes without thinking',
    effortLevel: 'quick',
  },

  // Body (25 tasks)
  {
    id: 'task_body_001',
    category: 'Body',
    title: 'Drink water',
    description: 'Drink one full glass of water',
    effortLevel: 'quick',
  },
  {
    id: 'task_body_002',
    category: 'Body',
    title: '5-minute walk',
    description: 'Take a 5-minute walk outside or around your home',
    effortLevel: 'quick',
  },
  {
    id: 'task_body_003',
    category: 'Body',
    title: 'Stretch routine',
    description: 'Do a simple 5-minute stretching routine',
    effortLevel: 'quick',
  },
  {
    id: 'task_body_004',
    category: 'Body',
    title: '10 push-ups',
    description: 'Do 10 push-ups or a modified version',
    effortLevel: 'quick',
  },
  {
    id: 'task_body_005',
    category: 'Body',
    title: 'Eat a vegetable',
    description: 'Eat one serving of vegetables',
    effortLevel: 'quick',
  },
  {
    id: 'task_body_006',
    category: 'Body',
    title: 'Sun time',
    description: 'Spend 10 minutes in natural sunlight',
    effortLevel: 'quick',
  },
  {
    id: 'task_body_007',
    category: 'Body',
    title: 'Strength exercise',
    description: 'Do 15 minutes of strength training or bodyweight exercises',
    effortLevel: 'medium',
  },
  {
    id: 'task_body_008',
    category: 'Body',
    title: 'Dance session',
    description: 'Dance to your favorite song for 10 minutes',
    effortLevel: 'quick',
  },
  {
    id: 'task_body_009',
    category: 'Body',
    title: 'Stairs workout',
    description: 'Go up and down stairs 10 times',
    effortLevel: 'quick',
  },
  {
    id: 'task_body_010',
    category: 'Body',
    title: 'Yoga flow',
    description: 'Do a 10-minute yoga routine',
    effortLevel: 'medium',
  },

  // Life (25 tasks)
  {
    id: 'task_life_001',
    category: 'Life',
    title: 'Make your bed',
    description: 'Make your bed neatly',
    effortLevel: 'quick',
  },
  {
    id: 'task_life_002',
    category: 'Life',
    title: 'Wash dishes',
    description: 'Wash or load the dishes',
    effortLevel: 'quick',
  },
  {
    id: 'task_life_003',
    category: 'Life',
    title: 'Tidy one space',
    description: 'Clean and organize one small area of your space',
    effortLevel: 'quick',
  },
  {
    id: 'task_life_004',
    category: 'Life',
    title: 'Call or text a friend',
    description: 'Reach out to a friend or family member',
    effortLevel: 'quick',
  },
  {
    id: 'task_life_005',
    category: 'Life',
    title: 'Change your sheets',
    description: 'Change your bed sheets',
    effortLevel: 'medium',
  },
  {
    id: 'task_life_006',
    category: 'Life',
    title: 'Do laundry',
    description: 'Start or complete a load of laundry',
    effortLevel: 'medium',
  },
  {
    id: 'task_life_007',
    category: 'Life',
    title: 'Meal prep',
    description: 'Prepare ingredients for one meal',
    effortLevel: 'medium',
  },
  {
    id: 'task_life_008',
    category: 'Life',
    title: 'Clear clutter',
    description: 'Pick up and organize 5 items cluttering your space',
    effortLevel: 'quick',
  },
  {
    id: 'task_life_009',
    category: 'Life',
    title: 'Take a shower',
    description: 'Take a warm, relaxing shower',
    effortLevel: 'quick',
  },
  {
    id: 'task_life_010',
    category: 'Life',
    title: 'Plan tomorrow',
    description: 'Write down 3 things you want to accomplish tomorrow',
    effortLevel: 'quick',
  },

  // Work (25 tasks)
  {
    id: 'task_work_001',
    category: 'Work',
    title: 'Clear your desk',
    description: 'Clear off your workspace',
    effortLevel: 'quick',
  },
  {
    id: 'task_work_002',
    category: 'Work',
    title: 'Check inbox',
    description: 'Go through and respond to 5 emails or messages',
    effortLevel: 'quick',
  },
  {
    id: 'task_work_003',
    category: 'Work',
    title: 'Plan your day',
    description: 'Write down your top 3 priorities for today',
    effortLevel: 'quick',
  },
  {
    id: 'task_work_004',
    category: 'Work',
    title: 'Complete one task',
    description: 'Finish one item on your to-do list',
    effortLevel: 'medium',
  },
  {
    id: 'task_work_005',
    category: 'Work',
    title: 'Focus sprint',
    description: 'Work uninterrupted for 25 minutes on one task',
    effortLevel: 'medium',
  },
  {
    id: 'task_work_006',
    category: 'Work',
    title: 'Organize files',
    description: 'Create folders and organize 10 files or documents',
    effortLevel: 'medium',
  },
  {
    id: 'task_work_007',
    category: 'Work',
    title: 'Update notes',
    description: 'Update your project notes or meeting minutes',
    effortLevel: 'quick',
  },
  {
    id: 'task_work_008',
    category: 'Work',
    title: 'Review progress',
    description: 'Review what you accomplished this week',
    effortLevel: 'quick',
  },
  {
    id: 'task_work_009',
    category: 'Work',
    title: 'Code cleanup',
    description: 'Refactor or clean up one piece of code',
    effortLevel: 'medium',
  },
  {
    id: 'task_work_010',
    category: 'Work',
    title: 'Document something',
    description: 'Write documentation or comments for one feature',
    effortLevel: 'medium',
  },
] as const;
