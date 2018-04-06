const request = require('superagent');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const PromisePool = require('es6-promise-pool');

const { getImageName } = require('./../utils');

const MAX_CONCURRENCY = 10;

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
    const self = this;
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

  getSpecificPages(pages) {

  }
}

module.exports = Document;
