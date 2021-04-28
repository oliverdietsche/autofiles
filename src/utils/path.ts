/**
 * Split a path at the last forward-slash in the string.
 * @returns Both parts of the string.
 */
export function splitPath(path: string) {
  const nameSplitIndex = path.lastIndexOf('/') + 1;
  return {
    pathToName: path.substr(0, nameSplitIndex),
    name: path.substr(nameSplitIndex),
  };
}

/**
 * Checks if the path isn't directly located in the dir.
 */
export function isPathSubdirOfDir(path: string, dir: string) {
  return path.replace(new RegExp(`.*${dir}\/`), '').includes('/');
}
