const fs = require('fs');

const { extractHostname } = require('./utils');

function identifyLibraryFromURL(url) {
  // Get list of libraries
  const librariesBuffer = fs.readFileSync('./libraries/libraries.txt');
  const librariesTextArray = librariesBuffer.toString('UTF-8').split('\n');
  const libraries = {};
  librariesTextArray.forEach(libraryText => {
    const libraryTextArray = libraryText.split('|');
    libraries[libraryTextArray[2]] = {
      sequence: libraryTextArray[0],
      libraryName: libraryTextArray[1],
    };
  });

  // Extract domain from url
  return libraries[extractHostname(url)];
}

module.exports = {
  identifyLibraryFromURL,
};
