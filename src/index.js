'use strict'
const fs = require("fs");
const path = require("path");
const mkd = require("marked");

/**
 * @returns whether a directory exists at the provided path.
 */
function isDir(path) {
    return fs.statSync(path).isDirectory();
}

// get output directory + validation
const PUBLIC_DIR = path.join(__dirname, "public")
if (!fs.existsSync(PUBLIC_DIR)) {
    console.error("no such directory:", PUBLIC_DIR);
    process.exit(1);
} else if(!isDir(PUBLIC_DIR)) {
    console.error("input location must a directory.");
    process.exit(1);
}

// get output directory + validation
const OUTPUT_DIR = path.join(__dirname, "../dist");
if (!fs.existsSync(OUTPUT_DIR)) {
    console.log("creating new output directory.");
    fs.mkdirSync(OUTPUT_DIR);
} else if(!isDir(OUTPUT_DIR)) {
    console.error("output location must be a directory.");
    process.exit(1);
}

function template(title, body) {
    return (`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${title}</title>
        </head>
        <body>
            <header>
                <a href="/">Go back home</a>
            </header>
            <div class="content">
                <h1>${title}</h1>
                ${body}
            </div>
        </body>
    </html>
    `);
}


/**
 * Given a markdown file reads it and generates HTML
 */
function createHTML(file) {
    const name = getFileName(file);
    const fp = path.join(PUBLIC_DIR, file);
    const data = fs.readFileSync(fp, "utf8");
    const html = mkd.parse(data);
    return template(name, html);
}

function getFileName(file) {
    const idx = file.lastIndexOf(".");
    return file.substring(0, idx);
}

function saveHTML(file, html) {
    const name = getFileName(file) + ".html";
    const fp = path.join(OUTPUT_DIR, name);
    fs.writeFileSync(fp, html, "utf8");
}

const files = fs.readdirSync(PUBLIC_DIR);
for(const file of files) {
    const html = createHTML(file);
    saveHTML(file, html);
}
console.log("HTML Generation Completed!");
