"use strict";

const { stripIndents } = require('common-tags');
const CollectionBase = require('./CollectionImporterBase');

class GradeImporter extends CollectionBase {

    constructor({ data, filePathDir, fileName }) {
        super({
            data: data, 
            filePathDir: filePathDir,
            fileName: fileName
        });
        this.type = 'Grade';
    }

    render() {
        var template = stripIndents`---
        name: "${this.data.grade}"
        id: "${this.data.gradeID}"
        ---`;

        return template;
    }
}

module.exports = GradeImporter;