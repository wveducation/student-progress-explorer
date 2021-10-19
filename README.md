[![🚀 Deploy Site](https://github.com/wveducation/student-progress-explorer/actions/workflows/eleventy_build.yml/badge.svg?branch=master)](https://github.com/wveducation/student-progress-explorer/actions/workflows/eleventy_build.yml)

![alt text](https://github.com/wveducation/student-progress-explorer/blob/master/src/static/img/og-image-default.jpg?raw=true)

# WV Student Progress Explorer
This project provides a guide for students and parents in West Virginia to information about student performance in the areas of mathematics, English language arts, and science. 

## Live Site
[WV Student Progress Explorer](https://student-progress.wvde.us)

### Technologies used:

- [Eleventy](https://www.11ty.dev/)
- [Alpine.js](https://github.com/alpinejs/alpine)
- [Tailwind CSS](https://tailwindcss.com/)
- [Netlify CMS](https://www.netlifycms.org/) _* development only_


<a href="https://app.netlify.com/start/deploy?repository=https://github.com/wveducation/student-progress-explorer&amp;stack=cms"><img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" /></a>

------

## Getting Started

### 1\. Clone this Repository

```
git clone https://github.com/wveducation/student-progress-explorer.git
```

### 2\. Navigate to the directory

```
cd [project_root]
```

### 3\. Install dependencies

```
npm install
```

### 4\. Build the project to generate the first CSS

This step is only required the very first time.

```
npm run build
```

### 5\. Run Eleventy

```
npm run start
```

------

## Import Utility

We've created an importer utility that accepts a `.csv` document and generates `.md` files for the `results`, `subjects`, `areas`, and `grades` collections. 

To run the importer using the default config;
```
cd importer
npm install
cd ../
npm run import-results
```
This assumes your `csv` is at `/data/results.csv` and you want to spit out markdown files to `src/results`. We've included a `results-template.xls` file as a guide for how the import expects your data to be structured. When your data is ready, save the first sheet in the workbook as a `csv`. We've included a sample `results-sample.csv` that shows how the importer expects to receive data.

Running `npm run import` allows you to specify options for `--source` (location of import csv) and `--clean` (removed data from all import collections) as well. Run `npm import -- --help` for a full list of options.

Running `npm run import-results` will remove all of the existing import collection data from the codebase, and replace it with the data imported from `data/results.csv`.

## Authors

Aaron Silber, *Developer at [WV Department of Education](https://wvde.us)*
