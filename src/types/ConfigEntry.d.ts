interface IConfigEntry {
    /** 
     * Path from source directory to the folder to watch.
     */
    directory: string,
    /**
     * Whether the creation of folders or files should be watched.
     */
    folder: boolean,
    /**
     * List of files to create.
     */
    files: IFile[],
    /**
     * If defined, an entry file with this name will be created and updated.
     */
    entryFile?: string,
}