#!/usr/bin/env node
const libdown = require('commander');

// Import the identifying method
const { identifyLibraryFromURL } = require('./identifier');

libdown
  .arguments('<url>')
  .option('-n, --nopdf', 'No PDF generated from downloaded images')
  .option('-u, --ultra', 'Enforce highest image quality download where applicable (WARNING: This option might take a lot of time)')
  .option('-l, --list', 'Show list of supported libraries')
  .action(function(url) {
    const identifedLibrary = identifyLibraryFromURL(url);
    if (identifedLibrary) {
      console.log(identifedLibrary.libraryName);
    } else {
      console.log('No supported library identified with this URL!')
    }
  })
  .parse(process.argv);
  