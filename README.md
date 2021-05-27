# Autofiles

This library supports automation of file creation in your project. It's highly configurable so that you can adjust it to your needs.

The core functionality is reacting to the creation of files or folders in a specified location by creating files using templates. As of v0.2.1, the only dynamic value in a template is `name`, which will be replaced by the name of the created file or folder. More features get added dependent on interest of users.

## Installation

> The installation can be made locally at project level. This has the advantage that every developer automatically installs the dependency when running `npm install` and can use it right away (when config and template files are committed).
>
> `npm install -D autofiles`

> If you prefer to install this dependency globally on your machine, you can do this using the following command. One usecase for this is, when you want to use this library without adding anything to the project itself. You probably want to gitignore the according config and template files if you do it this way.
>
> `npm install -g autofiles`

## Configuration

The configuration file has to be named `autofiles.json` and located in the root directory of the project. Its content has to be an array of configuration entries. The content of such an entry is defined by the following interface:

```ts
interface IConfigEntry {
  // Path from source directory to the folder to watch.
  directory: string;
  // Whether the creation of folders or files should be watched.
  folder: boolean;
  // If true, subdirectories of the defined directory get watched as well.
  includeSubdirs?: boolean;
  // If defined, an entry file with this name will be created and updated.
  entryFile?: string;
  // List of files to create.
  files: IFile[];
}

interface IFile {
  // Name of the file.
  filename: string;
  // Path from source directory to template txt file.
  pathToTemplate: string;
}
```

Every file object contains a filename and pathToTemplate property. The `filename` is a string which is going to be the resulting name of the file. `$(name)` in the string gets replaced by the name of the created folder or file, which triggered this creation. The `pathToTemplate` is the path from the project root directory to a *.txt* file. `$(name)` in this file gets replaced as well.

Here's an example:

```json
// autofiles.json
[
  {
    "directory": "src/ui/components",
    "folder": true,
    "includeSubdirs": false,
    "entryFile": "index.ts",
    "files": [
      {
        "filename": "index.ts",
        "pathToTemplate": "autofiles/component/index.txt"
      },
      {
        "filename": "$(name).tsx",
        "pathToTemplate": "autofiles/component/main.txt"
      },
      {
        "filename": "$(name).stories.tsx",
        "pathToTemplate": "autofiles/component/stories.txt"
      }
    ]
  }
]
```

This example configuration takes action on newly created folders inside the `src/ui/components` directory. Nothing happens on creating subfolders. An entry file (index.ts) gets maintained on every change made. It exports everything that is exported from the index.ts files inside every component.

For this configuration to work, a couple template files need to be created. These files need to be located as it's defined in the pathToTemplate property of every file in the config.

## Run script

`npx autofiles`
