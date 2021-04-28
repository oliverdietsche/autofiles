import { readdirSync } from 'fs';

/**
 * Checks if the directory is empty.
 * Entry file can optionally be ignored.
 */
export function isDirEmpty(directory: string, entryFile = '') {
  return (
    readdirSync(directory).filter((name) => name !== entryFile).length === 0
  );
}
