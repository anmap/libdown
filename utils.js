const chalk = require('chalk');

function showDisclaimer() {
  console.log('---------------------');
  console.log(
    chalk.bold.yellow('DISCLAIMER!'),
    chalk.bold('Libdown only assists you in downloading materials that are made available to the public for PRIVATE USE ONLY. Libdown does not hold any liabilities regarding the distribution of the downloaded materials, whether commercial or not. Please consult copyright laws carefully before distributing the materials.')
  );
  console.log('---------------------');
}

function extractHostname(url) {
  let hostname;
  // Find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf("://") > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }

  // Find & remove "?"
  hostname = hostname.split('?')[0];

  // Remove www
  hostname = hostname.replace('www.', '');

  return hostname;
}

function getImageName(page) {
  return 'page__' + ('0000' + page).substr(-4) + '.jpg';
}

module.exports = {
  showDisclaimer,
  extractHostname,
  getImageName,
};
