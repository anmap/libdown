const chalk = require('chalk');

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
    downloadPage,
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
    this.downloadPage = downloadPage;
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

  getPage(page) {
    process.stdout.write(`Downloading page ${page}/${this.pages}... `);
    this.downloadPage(this.id, page)
      .then(() => console.log(chalk.bold.green('Done!')));
  }

  getPageRange(startPage, endPage) {

  }

  getDocument() {

  }

  getSpecificPages(pages) {

  }
}

module.exports = Document;
