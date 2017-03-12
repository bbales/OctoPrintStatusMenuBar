class PrinterFile {
    constructor(f, data) {
        Object.assign(this, f)
        this.data = data
        this.isFolder = (f.type == 'folder')
        this.isGcode = (f.type == 'machinecode')
        if (this.isFolder) this.children = this.children.map(c => new PrinterFile(c, data))
    }

    get isPrinting() {
        return this.data.state.flags.printing && this.data.job.file.path == this.path
    }
}
