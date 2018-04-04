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

module.exports = {
  extractHostname,
};
