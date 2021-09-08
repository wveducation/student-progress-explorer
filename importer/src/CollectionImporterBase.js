"use strict";

const { writeFile } = require("fs-extra");
const chalk = require('chalk');

class CollectionImporterBase {

    constructor({ data, filePathDir, fileName }) {
        this.data = data;
        this.filePathDir = filePathDir;
        this.fileName = fileName;
        this.filePath = `./${filePathDir}/${this.fileName}`;
    }

    render() {
        return '';
    }

    writeFile() {

        writeFile(this.filePath, this.render(), error => {
            if (error) throw new Error(
                chalk.red(`❌ Could not create result ${this.filePath}`)
            );
            console.info(chalk.green(`✅ Created ${this.type}: ${this.filePath}`));
        });
    }
}

module.exports = CollectionImporterBase;