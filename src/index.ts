#!/usr/bin/env node
import { watch } from 'chokidar';
import { readFileSync, unlinkSync } from 'fs';
import { isDirEmpty, writeEntryFile, writeTemplateFiles } from './utils';

const config: IConfigEntry[] = JSON.parse(
  readFileSync('./autofiles.json', 'utf8')
);

config.forEach(({ directory, folder, files, entryFile }) => {
  const directoryRegex = new RegExp(`.*${directory}\/`);

  if (folder) {
    watch(directory)
      .on('addDir', (path) => {
        const name = path.replace(directoryRegex, '');
        const isSubdirectory = name.includes('/');
        if (isSubdirectory || !isDirEmpty(path)) return;
        writeTemplateFiles(files, name, path);
        entryFile && writeEntryFile(directory, entryFile);
      })
      .on('unlinkDir', () => entryFile && writeEntryFile(directory, entryFile));
  } else {
    watch(directory)
      .on('add', (path) => {
        const name = path.replace(directoryRegex, '');
        const isSubfile = name.includes('/');
        const isEmptyFile = readFileSync(path, 'utf8') === '';
        if (isSubfile || name === entryFile || !isEmptyFile) return;
        writeTemplateFiles(files, name, directory);
        unlinkSync(path);
      })
      .on('unlink', () => entryFile && writeEntryFile(directory, entryFile));
  }
});
