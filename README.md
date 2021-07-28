# WVDE Student Progress 11ty Demo

## Live Demo

[https://confident-keller-cf3308.netlify.app/](https://confident-keller-cf3308.netlify.app/)

### Technologies used:

- [Netlify CMS](https://www.netlifycms.org/)
- [Eleventy](https://www.11ty.dev/)
- [Alpine.js](https://github.com/alpinejs/alpine)
- [Tailwind CSS](https://tailwindcss.com/)


<a href="https://app.netlify.com/start/deploy?repository=https://github.com/aaronlsilber/wvde-student-progress-11ty-demo&amp;stack=cms"><img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" /></a>

------

## Getting Started

### 1\. Clone this Repository

```
git clone https://github.com/aaronlsilber/wvde-student-progress-11ty-demo.git
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

We've created an importer utility that accepts a `.csv` document and generates `.md` files for the `results` collection. 

To run the importer using the default config;
```
npm run import-results
```
This assumes your `csv` is at `/data/results.csv` and you want to spit out markdown files to `src/results`. We've included a `results-template.csv` file as a guide for how the import expects your data to be structured.

Running `npm run import` allows you to specify options for `--source`, `--destination`, and `--filename` format as well. Run `npm import -- --help` for a full list of options.

Example:
```
npm run import -- --source recipes/data.csv --destination src/recipes --filename 'recipe-${post.slug}.md'
```

## Authors

Aaron Silber, [WV Department of Education](https://wvde.us)