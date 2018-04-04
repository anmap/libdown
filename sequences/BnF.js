/*
  SEQUENCE FOR
  Gallica - Bibliothèque nationale de France
*/

const request = require('superagent');
const PAGE_URL = 'http://gallica.bnf.fr/iiif/ark:/%s/btv1b6000450z/f%s/full/full/0/native.jpg';

function* getInfoSequence(url) {
  console.log('')
}

function* getPageSequence(id, page) {
  console.log(PAGE_URL, id, page);
}

module.exports = {
  getInfoSequence,
  getPageSequence,
};
