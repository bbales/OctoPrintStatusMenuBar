class PrinterFile {
    constructor(f, data) {
        Object.assign(this, f)
        this.data = data
        this.isFolder = (f.type == 'folder')
        if (this.isFolder) this.children = this.children.map(c => new PrinterFile(c, data))
    }

    get isPrinting() {
        return this.data.status == 'Printing' && this.data.job.file.path == this.path
    }
}
