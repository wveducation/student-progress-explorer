"use strict";

const { stripIndents } = require('common-tags');
const CollectionBase = require('./CollectionImporterBase');

class AreaImporter extends CollectionBase {

    constructor({ data, filePathDir, fileName }) {
        super({
            data: data, 
            filePathDir: filePathDir,
            fileName: fileName
        });
    }

    render() {
        var template = stripIndents`---
        name: "${this.data.area}"
        id: "${this.data.areaID}"
        ---`;

        return template;
    }
}

module.exports = AreaImporter;