"use strict";

const { writeFile, mkdirp } = require("fs-extra");
const chalk = require('chalk');

class CollectionImporterBase {

    constructor({ data, filePathDir, fileName }) {
        this.data = data;
        this.filePathDir = filePathDir;
        this.fileName = fileName;
        this.filePath = `./${filePathDir}/${this.fileName}`;
    }

    render() {
        throw new Error(
            chalk.red(`${this.constructor.name} should implement a render method.`)
        );
    }

    writeFile() {

        // Ensure directory exists for filePath before writing to it.
        mkdirp(`${process.cwd()}/${this.filePathDir}`);

        writeFile(this.filePath, this.render(), error => {
            if (error) throw new Error(
                chalk.red(`❌ Could not create result ${this.filePath}`)
            );
            console.info(chalk.green(`✅ Created ${this.type}: ${this.filePath}`));
        });
    }
}

module.exports = CollectionImporterBase;