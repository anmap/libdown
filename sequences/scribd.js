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

        // Create document
        const document = new Document (
          LIBRARY_CODE,
          docId,
          title,
          null,
          uploader,
          desc,
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
