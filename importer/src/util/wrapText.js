"use strict";

const chalk = require('chalk');
const dedent = require("dedent");

const wrapText = (text, borderChar = '#') => {
    if (typeof text !== "string") {
        throw new Error(chalk.red(`❌ Could not create ${filepath}`));
    }

    let yBorders = "";

    for (let i = 0; i < text.length + 4; i++) {
        yBorders += borderChar;

        if (i == text.length + 4) {
            yBorders += '\n';
        }
    }

    return dedent`
    ${chalk.green(yBorders)}
    ${chalk.green(borderChar)} ${text} ${chalk.green(borderChar)}
    ${chalk.green(yBorders)}
    `;
} 

if (typeof module !== "undefined") {
    module.exports = wrapText;
}