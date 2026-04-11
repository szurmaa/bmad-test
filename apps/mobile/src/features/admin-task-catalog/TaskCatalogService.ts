import { z } from 'zod';

import {
  deactivateTaskCatalogItem,
  getTaskCatalog,
  upsertTaskCatalogItem,
  type TaskLibraryRecord,
} from '@/db/schema';

const categoryValues = ['Mind', 'Body', 'Life', 'Work'] as const;
const effortValues = ['quick', 'medium', 'involved'] as const;

export const taskCatalogInputSchema = z.object({
  id: z
    .string()
    .trim()
    .min(3, 'ID must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'ID can only contain letters, numbers, underscore, and dash'),
  category: z.enum(categoryValues, { error: 'Category is required' }),
  title: z.string().trim().min(3, 'Title is required'),
  description: z.string().trim().min(10, 'Description is required'),
  effortLevel: z.enum(effortValues, { error: 'Effort is required' }),
  isActive: z.boolean(),
});

export type TaskCatalogInput = z.infer<typeof taskCatalogInputSchema>;

export type ValidationResult = {
  valid: boolean;
  fieldErrors: Partial<Record<keyof TaskCatalogInput, string>>;
};

export function validateTaskCatalogInput(input: TaskCatalogInput): ValidationResult {
  const parsed = taskCatalogInputSchema.safeParse(input);
  if (parsed.success) {
    return { valid: true, fieldErrors: {} };
  }

  const fieldErrors: ValidationResult['fieldErrors'] = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof TaskCatalogInput | undefined;
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return { valid: false, fieldErrors };
}

export async function createOrUpdateCatalogTask(input: TaskCatalogInput): Promise<ValidationResult> {
  const validation = validateTaskCatalogInput(input);
  if (!validation.valid) {
    return validation;
  }

  await upsertTaskCatalogItem(input);
  return validation;
}

export async function deactivateCatalogTask(taskId: string): Promise<void> {
  await deactivateTaskCatalogItem(taskId);
}

export async function readCatalogTasks(): Promise<TaskLibraryRecord[]> {
  return getTaskCatalog(true);
}
