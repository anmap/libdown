/*
  SEQUENCE FOR
  Gallica - Bibliothèque nationale de France
*/

const request = require('superagent');

const Document = require('./../models/Document');

const LIBRARY_CODE = 'BnF';
const PAGE_URL = 'http://gallica.bnf.fr/iiif/ark:/%s/btv1b6000450z/f%s/full/full/0/native.jpg';

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
        const document = new Document (
          LIBRARY_CODE,
          decodeURIComponent(body.XitiFragment.parameters.x1),
          decodeURIComponent(body.XitiFragment.parameters.x2),
          decodeURIComponent(body.XitiFragment.parameters.x3),
          decodeURIComponent(body.ViewerFragment.contenu.PaginationViewerModel.parameters.nbTotalValues),
          decodeURIComponent(body.XitiFragment.parameters.x12),
          decodeURIComponent(body.XitiFragment.parameters.x4),
          decodeURIComponent(body.XitiFragment.parameters.x5),
          decodeURIComponent(body.XitiFragment.parameters.x9),
          getPageSequence,
        );

        resolve(document);
    });
  });
}

function getPageSequence(id, page) {
  console.log(PAGE_URL, id, page);
}

module.exports = {
  getInfoSequence,
};
