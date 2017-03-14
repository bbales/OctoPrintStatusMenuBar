class PrinterFile {
    constructor(f) {
        // Extend this instance with each file's properties
        Object.assign(this, f)

        this.isFolder = (f.type == 'folder')
        this.isGcode = (f.type == 'machinecode')

        // Recursively instantiate child files
        if (this.isFolder) this.children = this.children.map(c => new PrinterFile(c))
    }

    get isPrinting() {
        return app.state.flags.printing && app.job.file.path == this.path
    }
}
