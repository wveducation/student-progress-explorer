const yargs = require('yargs');
const { createReadStream, writeFile, mkdirp } = require("fs-extra");
const { mkdir } = require("fs");
const parse = require("csv-parse");
const mapKeys = require("lodash/mapKeys");
const formatDate = require("date-fns/format");
const dedent = require("dedent");
const chalk = require('chalk');
const path = require('path');
const { areRangesOverlapping } = require('date-fns');
const wrapText = require(path.resolve( __dirname,'./wrapText.js'));
const ResultImporter = require('./ResultImporter.js');
const GradeImporter = require('./GradeImporter');
const SubjectImporter = require('./SubjectImporter');
const AreaImporter = require('./AreaImporter');

const argv = yargs
    .option('source', {
        alias: 's',
        description: 'Define the source CSV file for the import.',
        type: 'string',
        default: 'data/data.csv',
    })
    .option('destination', {
        alias: 'd',
        description: 'Define the folder destination for the output.',
        type: 'string',
        default: 'imported-data',
    })
    .option('filename', {
        alias: 'f',
        description: 'Define the exported filename template for exports.',
        type: 'string',
        default: '${row.gradeID + row.subjectID + row.areaID}.md'
    })
    .option('clean', {
        alias: 'c',
        description: 'Empty collection directories before importing new data.',
        type: 'boolean',
        default: false
    })
    .help()
    .alias('help', 'h')
    .argv;

const stream = createReadStream(process.cwd()+'/'+argv.source);

const parser = parse({ columns: true }, (error, rows) => {
    if (error) throw new Error(chalk.red(error));
    if (!Array.isArray(rows)) throw new Error("❌ Incorrect CSV format");

    // Create the destination directory
    mkdirp(`${process.cwd()}/${argv.destination}`);

    let grades = [];
    let subjects = [];
    let areas = [];

    rows.forEach(row => {

        let result = new ResultImporter({ 
            data: row,
            filePathDir: 'src/results',
            fileName: `${row.gradeID + row.subjectID + row.areaID}.md`
        });
        result.writeFile();

        if (!grades[row.gradeID]) {
            grades[row.gradeID] = row.gradeID;
            let grade = new GradeImporter({
                data: row,
                filePathDir: 'src/grades',
                fileName: `${row.gradeID}.md`
            });
            grade.writeFile();
        }

        if (!subjects[row.subjectID]) {
            subjects[row.subjectID] = row.subjectID;
            let subject = new SubjectImporter({
                data: row,
                filePathDir: 'src/subjects',
                fileName: `${row.subjectID}.md`
            });
            subject.writeFile();
        }

        if (!areas[row.areaID]) {
            areas[row.areaID] = row.areaID;
            let area = new AreaImporter({
                data: row,
                filePathDir: 'src/areas',
                fileName: `${row.areaID}.md`
            });
            area.writeFile();
        }
    });


});

stream.pipe(parser);