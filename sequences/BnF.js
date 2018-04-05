/*
  SEQUENCE FOR
  Gallica - Bibliothèque nationale de France
*/

const request = require('superagent');
const util = require('util');
const fs = require('fs');
const path = require('path');

const Document = require('./../models/Document');

const { getImageName } = require('./../utils');

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
        const document = new Document (
          LIBRARY_CODE,
          url.substr(url.indexOf('ark:/') + 5, 19),
          decodeURIComponent(body.XitiFragment.parameters.x2),
          decodeURIComponent(body.XitiFragment.parameters.x3),
          decodeURIComponent(body.ViewerFragment.contenu.PaginationViewerModel.parameters.nbTotalVues),
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
  const url = util.format(PAGE_URL, id, page);
  return new Promise((resolve, reject) => {
    request
      .get(url)
      .set('Content-Type', 'blob')
      .end((err, res) => {
        // Reject promise if error
        if (err) {
          return reject(new Error(err.response.error));
        }

        // Output to file
        fs.writeFile(
          path.resolve('page__' + ('0000' + page).substr(-4) + '.jpg'),
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

module.exports = {
  getInfoSequence,
};
