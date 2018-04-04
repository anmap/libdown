#!/usr/bin/env node
const libdown = require('commander');

libdown
  .arguments('<url>')
  .option('-n, --nopdf', 'No PDF generated from downloaded images')
  .option('-u, --ultra', 'Enforce highest image quality download where applicable (WARNING: This option might take a lot of time)')
  .option('-l, --list', 'Show list of supported libraries')
  .action(url => {
    console.log('Here the URL: %s', url);
    if (libdown.nopdf) console.log('No PDF will be generated');
    if (libdown.ultra) console.log('');
  })
  .parse(process.argv);