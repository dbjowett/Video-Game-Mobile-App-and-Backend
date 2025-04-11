import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const omitFields = <T extends Record<string, any>>(
  object: T,
  fieldsToRemove: (keyof T)[],
): Omit<T, keyof T> => {
  const copy = { ...object };

  fieldsToRemove.forEach((field) => {
    delete copy[field];
  });

  return copy;
};
