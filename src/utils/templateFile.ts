import { readFileSync, writeFile } from 'fs';
import { promisify } from 'util';
import { fillTemplate } from './template';

/**
 * @param files List of template files to create.
 * @param name Name to fill into the templates.
 * @param directory Where to create the files.
 */
export async function writeTemplateFiles(
  files: IFile[],
  name: string,
  directory: string
) {
  await Promise.all(
    files.map(({ filename, pathToTemplate }) => {
      const filledFilename = `${directory}/${fillTemplate(filename, [
        { key: 'name', value: name },
      ])}`;
      const filledTemplate = fillTemplate(
        readFileSync(pathToTemplate, 'utf8'),
        [{ key: 'name', value: name }]
      );
      return promisify(writeFile)(filledFilename, filledTemplate).then(() =>
        console.log('Created file:', filledFilename)
      );
    })
  );
}
