"use strict";

const { stripIndents } = require('common-tags');
const CollectionBase = require('./CollectionImporterBase');

class TestImporter extends CollectionBase {

    constructor({ data, filePathDir, fileName }) {
        super({
            data: data, 
            filePathDir: filePathDir,
            fileName: fileName
        });
        this.type = "Test";
    }
}

module.exports = TestImporter;