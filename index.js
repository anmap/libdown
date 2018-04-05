#!/usr/bin/env node
const libdown = require('commander');
const chalk = require('chalk');

// Import the identifying method
const { identifyLibraryFromURL } = require('./identifier');

// Import sequences
const sequences = require('./sequences/index');

libdown
  .arguments('<url>')
  .option('-n, --nopdf', 'No PDF generated from downloaded images')
  .option('-u, --ultra', 'Enforce highest image quality download where applicable (WARNING: This option might take a lot of time)')
  .option('-l, --list', 'Show list of supported libraries')
  .action(function(url) {
    const identifedLibrary = identifyLibraryFromURL(url);
    if (identifedLibrary) {
      // Output library name
      console.log(chalk.bold.yellow(identifedLibrary.libraryName.toUpperCase()));
      const sequence = sequences[identifedLibrary.sequence];
      console.log('Getting information...');
      sequence.getInfoSequence(url)
        .then(document => {
          document.outputInfo();
          document.getPage(56);
        })
        .catch(err => console.log(chalk.red(err)));
    } else {
      console.log('No supported library identified with this URL!')
    }
  })
  .parse(process.argv);
  