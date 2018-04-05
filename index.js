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
      process.stdout.write('Getting information...\r');
      sequence.getInfoSequence(url)
        .then(document => {
          document.outputInfo();
          console.log('---------------------');
          console.log(
            chalk.bold.yellow('WARNING!'),
            chalk.bold('Libdown only assists you in downloading materials that are made available to the public for PRIVATE USE ONLY. Libdown does not hold any liabilities regarding the distribution of the downloaded materials, whether commercial or not. Please consult copyright laws carefully before distributing the materials.')
          );
          console.log('---------------------');
          document.getPage(56);
        })
        .catch(err => console.log(chalk.red(err)));
    } else {
      console.log(chalk.red('No supported library identified with this URL!'));
    }
  })
  .parse(process.argv);
  