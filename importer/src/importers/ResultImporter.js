"use strict";

const { stripIndents } = require('common-tags');
const CollectionBase = require('./CollectionImporterBase');

class ResultImporter extends CollectionBase {

    constructor({ data, filePathDir, fileName }) {
        super({
            data: data, 
            filePathDir: filePathDir,
            fileName: fileName
        });
        this.type = 'Result';
    }

    #renderQuestions() {
        let qaKeys = Object.keys(this.data).filter(key => key.match(/(?:^[qa]{1}[0-9]+$)/) );
        let output = '';
        let qastring = '';
        
        qaKeys.forEach((qaKey, i) => {
            if (!this.data[qaKey]) { return false; }
            if (i == 0) {               qastring += `\nquestions:`; }
            if (i % 2 == 0) {           qastring += `\n  - qa:`; }
            if (qaKey[0] == 'q') {      qastring += `\n      question: "${ this.data[qaKey] }"`; }
            if (qaKey[0] == 'a') {      qastring += `\n      answer: "${ this.data[qaKey] }"`; }
        });
    
        output += qastring;
        return output;
    }
    
    #renderSteps() {
        // matches string of "step" with any number of preceeding integers. (e.g. step1, step12 - not step4a)
        let stepKeys = Object.keys(this.data).filter(key => key.match(/(?:^step[0-9]+$)/) );
        let output = '';
        let stepString = '';
    
        stepKeys.forEach((stepKey, i) => {
            if (i == 0) { stepString += `\nnext_steps:`; }
            if (this.data[stepKey]) {
                stepString += `\n  - instructions: "${ this.data[stepKey] }"`;
            }
        });
    
        output += stepString;
        return output;
    }

    render() {
        var template = stripIndents`---
        title: "${this.data.title}"
        subject: "${this.data.subjectID}"
        grade: "${this.data.gradeID}"
        area: "${this.data.areaID}"
        `;
        template += this.#renderSteps();
        template += this.#renderQuestions();
        template += `\n---`;

        return template;
    }
}

module.exports = ResultImporter;