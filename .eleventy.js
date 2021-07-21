const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const util = require('util');

module.exports = function(eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addFilter('console', function(value) {
    const str = util.inspect(value);
    return `<pre class="block" style="max-height: 500px; overflow-y: scroll;">${unescape(str)}</pre>;`
  });

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  eleventyConfig.addShortcode("subjectTree", (results, subjects, grades, areas) => {
    const tree = {};

    // Make a list of subjects which are used in any results.
    results.forEach(result => {

      // if the tree doesn't yet have this result's subject, add it
      if (!(tree.hasOwnProperty(result.data.subject))) {
        tree[result.data.subject] = {
          "name": getNameById(subjects, result.data.subject),
          "grades": {}
        };
      }

      // if this subject id branch doesn't have this grade yet, add it
      if (!(tree[result.data.subject]['grades'].hasOwnProperty(result.data.grade))) {
        tree[result.data.subject]['grades'][result.data.grade] = {
          "name": getNameById(grades, result.data.grade),
          "areas": {}
        };
      }

      // if this subject and grade branch doesn't have this area yet, add it
      if (!(tree[result.data.subject]['grades'][result.data.grade]['areas'].hasOwnProperty(result.data.area))) {
        tree[result.data.subject]['grades'][result.data.grade]['areas'][result.data.area] = {
          "name": getNameById(areas, result.data.area),
          "url": result.url
        };
      }

    });

    return JSON.stringify(tree);
  });

  // Return grades which are referenced on results which also include a given subject.
  const getNameById = (data, id) => {
    let name;

    data.every(item => {
      if (item.data.id == id) {
        name = item.data.name;
        return false;
      }
      return true;
    });

    return name;
  }

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/alpine.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./static/css/prism-tomorrow.css",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
