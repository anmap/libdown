const request = require('superagent');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const PromisePool = require('es6-promise-pool');
const PDFDocument = require ('pdfkit');
const sizeOf = require('image-size');
const ProgressBar = require('progress');

const { getImageName } = require('./../utils');

const MAX_CONCURRENCY = 8;

class Document {
  constructor(
    libraryCode,
    id,
    title,
    author,
    pages,
    year,
    type,
    libInfo,
    copyright,
    pageURLs,
  ) {
    this.libraryCode = libraryCode;
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.year = year;
    this.type = type;
    this.libInfo = libInfo;
    this.copyright = copyright;
    this.pageURLs = pageURLs;
    
    // For settings
    // 1 - PDF Only
    // 2 - Both PDF and images
    // 3 - Images only
    this.mode = 1;
  }

  outputInfo() {
    this.title
      && console.log(chalk.bold.cyan('Title: ') + chalk.bold(this.title));
    this.author
      && console.log(chalk.bold.cyan('Author: ') + this.author);
    this.pages
      && console.log(chalk.bold.cyan('Pages: ') + this.pages);
    this.year
      && console.log(chalk.bold.cyan('Year: ') + this.year);
    this.type
      && console.log(chalk.bold.cyan('Document type: ') + this.type);
    this.libInfo
      && console.log(chalk.bold.cyan('Library info: ') + this.libInfo);
    this.copyright
      && console.log(chalk.bold.cyan('Copyright: ') + this.copyright);
  }

  getNumberOfPages() {
    return this.pages;
  }

  getPage(page) {
    return new Promise((resolve, reject) => {
      request
        .get(this.pageURLs[page-1])
        .set('Content-Type', 'blob')
        .end((err, res) => {
          // Reject promise if error
          if (err) {
            return reject(new Error(err));
          }
  
          // Output to file
          fs.writeFile(
            path.resolve(getImageName(page)),
            res.body,
            'binary',
            (err) => {
              if (err) {
                reject(new Error(err));
              } else {
                resolve();
              }
            }
          )
        });
    });
  }

  getPageRange(startPage, endPage) {
    console.log(chalk.bold.blue(`Getting document from page ${startPage} to page ${endPage}`));
    console.log(chalk.blue('Downloading, please wait...'));

    const self = this;
    const counter = 0;

    const barOpts = {
      width: 40,
      total: endPage - startPage,
      clear: true,
    };

    function* getPromises() {
      for (let i = startPage; i <= endPage; i++) {
        yield self.getPage(i);
      }
    }

    return new PromisePool(getPromises(), MAX_CONCURRENCY);
  }

  getDocument() {
    return this.getPageRange(1, this.pages);
  }

  // Not in use now
  getSpecificPages(pages) {
    const self = this;
    const arrLength = pages.length;
    function* getPromises() {
      for (let i = 0; i < arrLength; i++) {
        yield self.getPage(pages[i]);
      }
    }
    return new PromisePool(getPromises(), MAX_CONCURRENCY);
  }

  generatePDF(options) {
    try {
      const fileName = this.title.split('.')[0] + '.pdf';
      console.log(chalk.bold.blue('Output PDF file: ' + fileName));
      console.log(chalk.blue('Generating PDF, please wait...'));
      

      if (!options) {
        options = {
          pageStart: 1,
          pageEnd: this.pages,
        };
      }

      // Init PDF generation
      const doc = new PDFDocument({
        autoFirstPage: false,
      });
      doc.pipe(fs.createWriteStream(fileName));
      
      // If options is array, it's for selected pages
      // Otherwise if it's an object, it's page range.
      if (Array.isArray(options)) {
        // To be implemented later
      } else {  
        for (let i = options.pageStart; i <= options.pageEnd; i++) {
          const dimensions = sizeOf(getImageName(i));
          doc.addPage({
            size: [dimensions.width, dimensions.height],
          });
          doc.image(getImageName(i), 0, 0);
        }
      }
      
      doc.end();
      console.log(chalk.green('Operation done!'));
    } catch (error) {
      
    }
  }
}

module.exports = Document;
