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
        // Extract title
        const ogTitlePos = body.indexOf('og:title');
        const titleStartPos = ogTitlePos + 19;
        const titleEndPos = body.indexOf('"', titleStartPos);
        const title = body.substring(titleStartPos, titleEndPos);
        const document = new Document (
          LIBRARY_CODE,
          title,
          // decodeURIComponent(body.XitiFragment.parameters.x2),
          // decodeURIComponent(body.XitiFragment.parameters.x3),
          // pages,
          // decodeURIComponent(body.XitiFragment.parameters.x12),
          // decodeURIComponent(body.XitiFragment.parameters.x4),
          // decodeURIComponent(body.XitiFragment.parameters.x5),
          // decodeURIComponent(body.XitiFragment.parameters.x9),
          // generatePageURLs(documentId, pages),
        );

        resolve(document);
    });
  });
}

function generatePageURLs(documentId, pages) {
  const pageURLs = [];
  for (let i = 0; i < pages; i++) {
    pageURLs.push(util.format(PAGE_URL, documentId, i + 1));
  }
  return pageURLs;
}

module.exports = {
  getInfoSequence,
};
