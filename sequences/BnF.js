/*
  SEQUENCE FOR
  Gallica - Bibliothèque nationale de France
*/

const request = require('superagent');
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
        resolve(res.body);
    });
  });
}

function getPageSequence(id, page) {
  console.log(PAGE_URL, id, page);
}

module.exports = {
  getInfoSequence,
  getPageSequence,
};
