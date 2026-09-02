import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const omitFields = <T extends Record<string, any>, K extends keyof T>(
  object: T,
  fieldsToRemove: readonly K[],
): Omit<T, K> => {
  const copy = { ...object };

  fieldsToRemove.forEach((field) => {
    delete copy[field];
  });

  return copy;
};
