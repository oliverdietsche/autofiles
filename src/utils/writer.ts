import { readdirSync, readFileSync, unlink, writeFile } from 'fs';
import { promisify } from 'util';
import { isDirEmpty } from './fsCheck';
import { fillTemplateString } from './template';

/**
 * @param files List of template files to create.
 * @param pathToName Path to name ending with '/'.
 * @param name Name to fill.
 */
export async function writeTemplateFiles(
  files: IFile[],
  pathToName: string,
  name: string,
  nameIsDir: boolean
) {
  await Promise.all(
    files.map(({ filename, pathToTemplate }) => {
      const filledPath = `${pathToName}${
        nameIsDir ? `${name}/` : ''
      }${fillTemplateString(filename, [{ key: 'name', value: name }])}`;
      const filledTemplate = fillTemplateString(
        readFileSync(pathToTemplate, 'utf8'),
        [{ key: 'name', value: name }]
      );
      return promisify(writeFile)(filledPath, filledTemplate).then(() =>
        console.log('Created file:', filledPath)
      );
    })
  );
}

/**
 * Updates the entry file to export everything withing the directory.
 * If the directory is empty, the entry file will be deleted.
 * @param directory Where to write the entry file.
 * @param entryFile Name of the entry file.
 */
export async function writeEntryFile(directory: string, entryFile: string) {
  const pathToEntryFile = `${directory}${entryFile}`;
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
