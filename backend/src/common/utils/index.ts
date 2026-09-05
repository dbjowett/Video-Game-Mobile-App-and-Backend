import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : JSON.stringify(error);

export const omitFields = <T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  fieldsToRemove: readonly K[],
): Omit<T, K> => {
  const copy = { ...object };

  for (const field of fieldsToRemove) {
    delete copy[field];
  }

  return copy;
};
