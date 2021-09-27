const yargs = require('yargs');
const { createReadStream, emptyDir, remove, removeSync } = require("fs-extra");
const { mkdir, unlink, readdir, fstat, readdirSync } = require("fs");
const parse = require("csv-parse");
const mapKeys = require("lodash/mapKeys");
const formatDate = require("date-fns/format");
const dedent = require("dedent");
const chalk = require('chalk');
const path = require('path');
const ResultImporter = require('./importers/ResultImporter.js');
const GradeImporter = require('./importers/GradeImporter');
const SubjectImporter = require('./importers/SubjectImporter');
const AreaImporter = require('./importers/AreaImporter');

const argv = yargs
    .option('source', {
        alias: 's',
        description: 'Define the source CSV file for the import.',
        type: 'string',
        default: 'data/data.csv',
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
    
    let results = [];
    let grades = [];
    let subjects = [];
    let areas = [];

    let importDir = {
        results: 'src/results',
        grades: 'src/grades',
        subjects: 'src/subjects',
        areas: 'src/areas'
    };

    // If clean arg passed, clean all markdown files from all import directories
    function cleanImportDirectories() {

        Object.entries(importDir).forEach(([key, dir]) => {
            let filenames = readdirSync(dir);
            filenames
                .filter(filename => path.extname(filename).toLowerCase() === '.md')
                .forEach((filename, index) => {                    
                    try {
                        removeSync(`./${dir}/${filename}`);
                    } catch (err) {
                        console.log(err);
                    }
                });
        });
    }

    if (argv.clean) {
        console.log(chalk.green('🗑 Cleaning markdown files from import directories.'));

        cleanImportDirectories();
    }

    rows.filter(row => row.title !== '').forEach(row => {

        results[row.slug] = row.slug;
        let result = new ResultImporter({ 
            data: row,
            filePathDir: importDir.results,
            fileName: `${row.gradeID + row.subjectID + row.areaID}.md`
        });
        result.writeFile();

        if (!grades[row.gradeID]) {
            grades[row.gradeID] = row.gradeID;
            let grade = new GradeImporter({
                data: row,
                filePathDir: importDir.grades,
                fileName: `${row.gradeID}.md`
            });
            grade.writeFile();
        }

        if (!subjects[row.subjectID]) {
            subjects[row.subjectID] = row.subjectID;
            let subject = new SubjectImporter({
                data: row,
                filePathDir: importDir.subjects,
                fileName: `${row.subjectID}.md`
            });
            subject.writeFile();
        }

        if (!areas[row.areaID]) {
            areas[row.areaID] = row.areaID;
            let area = new AreaImporter({
                data: row,
                filePathDir: importDir.areas,
                fileName: `${row.areaID}.md`
            });
            area.writeFile();
        }
    });


});

stream.pipe(parser);