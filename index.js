#!/usr/bin/env node --harmony
const libdown = require('commander');
const chalk = require('chalk');

// Import the identifying method
const { identifyLibraryFromURL } = require('./identifier');

// Import utils
const { showDisclaimer } = require('./utils');

// Import sequences
const sequences = require('./sequences/index');

libdown
  .arguments('<url>')
  .action(function(url) {
    const identifedLibrary = identifyLibraryFromURL(url);
    if (identifedLibrary) {
      // Output library name
      console.log(chalk.bold.yellow(identifedLibrary.libraryName.toUpperCase()));
      const sequence = sequences[identifedLibrary.sequence];
      process.stdout.write('Getting information...\r');
      sequence.getInfoSequence(url)
        .then(document => {
          document.outputInfo();
          // showDisclaimer();

          // document.getDocument()
          //   .start()
          //   .then(() => {
          //     document.generatePDF();
          //   });
        })
        .catch(err => console.log(chalk.red(err)));
    } else {
      console.log(chalk.red('No supported library identified with this URL!'));
    }
  })
  .parse(process.argv);
  