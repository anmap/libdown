/*
  SEQUENCE FOR
  Scribd
*/

const request = require('superagent');
const util = require('util');

const Document = require('./../models/Document');

const LIBRARY_CODE = 'scribd';
const PAGE_URL = 'http://gallica.bnf.fr/iiif/ark:/%s/f%s/full/full/0/native.jpg';

function getInfoSequence(url) {
  const documentId = url.substr(url.indexOf('ark:/') + 5, 19);
  return new Promise((resolve, reject) => {
    request
      .get(url)
      .end((err, res) => {
        if (err) {
          return reject(new Error(err.response.error));
        }
        
        const body = res.text;
        // Extract document ID
        const docIdStartPos = body.indexOf('doc_id') + 8;
        const docIdEndPos = body.indexOf('}', docIdStartPos);
        const docId = body.substring(docIdStartPos, docIdEndPos);
        // Extract title
        const titleStartPos = body.indexOf('og:title') + 19;
        const titleEndPos = body.indexOf('"', titleStartPos);
        const title = body.substring(titleStartPos, titleEndPos);
        // Extract uplodaer
        const uploaderStartPos = body.indexOf('>', body.indexOf('publish_info') + 14) + 1;
        const uploaderEndPos = body.indexOf('<', uploaderStartPos);
        const uploader = body.substring(uploaderStartPos, uploaderEndPos);
        // Extract desscription
        const descStartPos = body.indexOf('og:description') + 25;
        const descEndPos = body.indexOf('"', descStartPos);
        const desc = body.substring(descStartPos, descEndPos);

        const pageURLs = generatePageURLs(body);

        // Create document
        const document = new Document (
          LIBRARY_CODE,
          docId,
          title,
          null,
          uploader,
          desc,
          pageURLs.length,
          null,
          null,
          null,
          null,
          pageURLs,
        );

        resolve(document);
    });
  });
}

function generatePageURLs(htmlResponse) {
  // Extract page info
  const pages = [];
  let currentPos = nextPos = 0;
  while (true) {
    // Assign nextPos value to currentPos
    currentPos = nextPos;

    // Define the boundaries to extract info of the current page
    const currentPageInfoStart = htmlResponse.indexOf('var pageParams', currentPos);
    const currentPageInfoEnd = htmlResponse.indexOf('var page =', currentPageInfoStart);

    // If the start boundary is not larger than current position, break the loop
    if (currentPageInfoStart <= currentPos) break;

    // Extract and process the current page URL
    let pageURL = '';
    const contentURLPos = htmlResponse.indexOf('contentUrl', currentPageInfoStart);
    // If the contentUrl position is within the boundaries, proceed to extract the page URL
    // otherwise trigger special URL retrieval
    if (contentURLPos < currentPageInfoEnd) {
      const contentURLStart = htmlResponse.indexOf('"', contentURLPos) + 1;
      const contentURLEnd = htmlResponse.indexOf('"', contentURLStart) - 1;
       pageURL = htmlResponse
        .substring(contentURLStart, contentURLEnd)
        .replace('pages', 'images')
        .replace('jsonp', 'jpg');
    } else {
      const absimgPos = htmlResponse.indexOf('absimg', currentPos);
      const imgURLStart = htmlResponse.indexOf('orig=', absimgPos) + 6;
      const imgURLEnd = htmlResponse.indexOf('"', imgURLStart);
      pageURL = htmlResponse
        .substring(imgURLStart, imgURLEnd)
        .replace('scribd', 'scribdassets');
    }

    // Give the end boundary to nextPos
    nextPos = currentPageInfoEnd;
    
    // If nextPos is greater than currentPos,
    // push the result to array
    if (nextPos > currentPos) {
      pages.push(pageURL);
    }
  };

  return pages;
}

module.exports = {
  getInfoSequence,
};
