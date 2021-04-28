#!/usr/bin/env node
import { watch } from 'chokidar';
import { readFileSync, unlinkSync } from 'fs';
import {
  isDirEmpty,
  isFileEmpty,
  isPathSubdirOfDir,
  splitPath,
  writeEntryFile,
  writeTemplateFiles
} from './utils';

const config: IConfigEntry[] = JSON.parse(
  readFileSync('./autofiles.json', 'utf8')
);

config.forEach(({ directory, folder, files, entryFile, includeSubdirs }) => {
  if (folder) {
    watch(directory)
      .on('addDir', (path) => {
        if (!includeSubdirs && isPathSubdirOfDir(path, directory)) return;
        if (!isDirEmpty(path)) return;

        const { pathToName, name } = splitPath(path);
        writeTemplateFiles(files, pathToName, name, folder);
        if (entryFile) writeEntryFile(pathToName, entryFile);
      })
      .on('unlinkDir', (path) => {
        if (!entryFile) return;
        if (!includeSubdirs && isPathSubdirOfDir(path, directory)) return;
        const { pathToName } = splitPath(path);
        writeEntryFile(pathToName, entryFile);
      });
  } else {
    watch(directory)
      .on('add', (path) => {
        if (!includeSubdirs && isPathSubdirOfDir(path, directory)) return;
        if (!isFileEmpty(path)) return;
        const { pathToName, name } = splitPath(path);
        if (name === entryFile) return;

        writeTemplateFiles(files, pathToName, name, folder);
        unlinkSync(path);
        if (entryFile) writeEntryFile(pathToName, entryFile);
      })
      .on('unlink', (path) => {
        if (!entryFile) return;
        if (!includeSubdirs && isPathSubdirOfDir(path, directory)) return;
        const { pathToName } = splitPath(path);
        writeEntryFile(pathToName, entryFile);
      });
  }
});
