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
    console.log(this.title);
  }

  getDocument() {

  }

  getPage(page) {
    this.downloadPage(this.id, page);
  }

  getPageRange(startPage, endPage) {

  }

  getSpecificPages(pages) {

  }
}

module.exports = Document;
