"use strict";

const { stripIndents } = require('common-tags');
const CollectionBase = require('./CollectionImporterBase');

class SubjectImporter extends CollectionBase {

    constructor({ data, filePathDir, fileName }) {
        super({
            data: data, 
            filePathDir: filePathDir,
            fileName: fileName
        });
        this.type = 'Subject';
    }

    render() {
        var template = stripIndents`---
        name: "${this.data.subject}"
        id: "${this.data.subjectID}"
        ---`;

        return template;
    }
}

module.exports = SubjectImporter;