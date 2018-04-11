/*
  SEQUENCE FOR
  Gallica - Bibliothèque nationale de France
*/

const request = require('superagent');
const util = require('util');

const Document = require('./../models/Document');

const LIBRARY_CODE = 'BnF';
const PAGE_URL = 'http://gallica.bnf.fr/iiif/ark:/%s/f%s/full/full/0/native.jpg';

function getInfoSequence(url) {
  return new Promise((resolve, reject) => {
    request
      .get(url)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          return reject(new Error(err.response.error));
        }

        const body = res.body;
        const pages = decodeURIComponent(body.ViewerFragment.contenu.PaginationViewerModel.parameters.nbTotalVues);
        
        const idStartPos = url.indexOf('ark:/') + 5;
        const idEndPos = url.indexOf('/', idStartPos);
        const documentURLId = url.substring(idStartPos, idEndPos) + '/' + body.XitiFragment.parameters.x1;

        const document = new Document (
          LIBRARY_CODE,
          decodeURIComponent(body.XitiFragment.parameters.x1),
          decodeURIComponent(body.XitiFragment.parameters.x2),
          decodeURIComponent(body.XitiFragment.parameters.x3),
          pages,
          decodeURIComponent(body.XitiFragment.parameters.x12),
          decodeURIComponent(body.XitiFragment.parameters.x4),
          decodeURIComponent(body.XitiFragment.parameters.x5),
          decodeURIComponent(body.XitiFragment.parameters.x9),
          generatePageURLs(documentURLId, pages),
        );

        resolve(document);
    });
  });
}

function generatePageURLs(documentURLId, pages) {
  const pageURLs = [];
  for (let i = 0; i < pages; i++) {
    pageURLs.push(util.format(PAGE_URL, documentURLId, i + 1));
  }
  return pageURLs;
}

module.exports = {
  getInfoSequence,
};
