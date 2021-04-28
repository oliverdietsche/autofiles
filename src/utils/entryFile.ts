import { readdirSync, unlink, writeFile } from 'fs';
import { promisify } from 'util';
import { isDirEmpty } from './fsHelper';

/**
 * Updates the entry file to export everything withing the directory.
 * If the directory is empty, the entry file will be deleted.
 * @param directory Where to write the entry file.
 * @param entryFile Name of the entry file.
 */
export async function writeEntryFile(directory: string, entryFile: string) {
  const pathToEntryFile = `${directory}/${entryFile}`;
  if (isDirEmpty(directory, entryFile)) {
    await promisify(unlink)(pathToEntryFile).then(() =>
      console.log('Removed entry file:', pathToEntryFile)
    );
  } else {
    const entryFileContent = readdirSync(directory)
      .filter((name) => name !== entryFile)
      .map((name) =>
        name.includes('.') ? name.substr(0, name.indexOf('.')) : name
      )
      .reduce(
        (acc, cur) => `${acc}export * from './${cur}';
  `,
        ''
      );
    await promisify(writeFile)(pathToEntryFile, entryFileContent).then(() =>
      console.log('Updated entry file:', pathToEntryFile)
    );
  }
}
