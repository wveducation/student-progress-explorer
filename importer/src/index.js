const yargs = require('yargs');
const { createReadStream, writeFile, mkdirp } = require("fs-extra");
const { mkdir } = require("fs");
const parse = require("csv-parse");
const mapKeys = require("lodash/mapKeys");
const formatDate = require("date-fns/format");
const dedent = require("dedent");
const chalk = require('chalk');
const path = require('path');
const wrapText = require(path.resolve( __dirname,'./wrapText.js'));

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
        default: '${post.gradeID + post.subjectID + post.areaID}.md'
    })
    .help()
    .alias('help', 'h')
    .argv;

const getMarkdownPath = post => `./${argv.destination}/${eval('`'+argv.filename+'`')}`;

const renderMarkdown = post => `---
title: "${post.title}"
subject: "${post.subjectID}"
grade: "${post.gradeID}"
area: "${post.areaID}"
${renderSteps(post)}
${renderQuestions(post)}
---`;

const renderQuestions = (post, index) => {
    let qaKeys = Object.keys(post).filter(key => key.match(/(?:^[qa]{1}[0-9]+$)/) );
    let output = '';
    let qastring = '';
    
    qaKeys.forEach((qaKey, i) => {
        if (!post[qaKey]) { return false; }
        if (i == 0) {               qastring += `questions:`; }
        if (i % 2 == 0) {           qastring += `\n  - qa:`; }
        if (qaKey[0] == 'q') {      qastring += `\n      question: "${ post[qaKey] }"`; }
        if (qaKey[0] == 'a') {      qastring += `\n      answer: "${ post[qaKey] }"`; }
    });

    output += qastring;

    return output;
};

const renderSteps = (post, index) => {
    // matches string of "step" with any number of preceeding integers. (e.g. step1, step12 - not step4a)
    let stepKeys = Object.keys(post).filter(key => key.match(/(?:^step[0-9]+$)/) );
    let output = '';
    let stepString = '';

    stepKeys.forEach((stepKey, i) => {
        if (i == 0) { stepString += `next_steps:`; }
        if (post[stepKey]) {
            stepString += `\n - instructions: "${ post[stepKey] }"`;
        }
    });

    output += stepString;
    return output;
};

const stream = createReadStream(process.cwd()+'/'+argv.source);
let numRecords = 0;

const parser = parse({ columns: true }, (error, posts) => {
    if (error) throw new Error(chalk.red(error));
    if (!Array.isArray(posts)) throw new Error("❌ Incorrect CSV format");
    numRecords = Object.keys(posts).length;

    mkdirp(`${process.cwd()}/${argv.destination}`);

    posts.forEach(post => {
        const convertedPost = renderMarkdown(post);
        const filepath = getMarkdownPath(post);

        writeFile(filepath, convertedPost, error => {
            if (error) throw new Error(chalk.red(`❌ Could not create ${filepath}`));
            console.info(chalk.green(`✅ Created ${filepath}`));
        });
    });

    console.info(chalk.black.bgGreen(wrapText(`Successfully imported ${numRecords} records.`)));
});

stream.pipe(parser);