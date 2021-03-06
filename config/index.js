'use strict';

var addonManifest = require('../addon-manifest.json');
var bole = require('bole');

/* We don't do code coverage on our configuration file */
/* istanbul ignore next */
module.exports = {
  storj: {
    api: process.env.BRIDGE_ENDPOINT || 'https://api.staging.storj.io'
  },
  db: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017',
    collection: process.env.MONGO_COLLECTION || 'account',
    options: {
      server: {
        ssl: ( process.env.MONGO_SSL === 'true' ) || false,
        sslAllowInvalidCertificates: ( process.env.MONGO_SSL_ALLOW_INVALID_CERTIFICATES  === 'true' ) || false,
        sslAllowInvalidHostnames: ( process.env.MONGO_SSL_ALLOW_INVALID_HOSTNAMES === 'true' ) || false
      },
      replSet: {
        rs_name: process.env.MONGO_RS_NAME || undefined
      },
      mongos: {}
    }
  },
  // For heroku, we either use the provided environment variables for
  // production, or we use the values from addon-manifest to match what kensa
  // is expecting
  heroku: {
    sso_salt: process.env.HEROKU_SSO || addonManifest.api.sso_salt,
    legacy_salt: process.env.LEGACY_SSO || addonManifest.api.sso_salt,
    id: process.env.HEROKU_ID || addonManifest.id,
    password: process.env.HEROKU_PASSWORD || addonManifest.api.password
  },
  log: {
    level: process.env.LOG_LEVEL || 'info'
  },
  retry: {
    count: 15,
    baseDelay: 50,
    exponent: 2
  }
};

// Configure our logging
/* istanbul ignore next */
bole.output({
  level: module.exports.log.level,
  stream: process.stdout
});

// We throw here. Throwing is an anti-pattern, but in this case we want to make
// sure the server doesn't start with an invalid configuration file. Let the
// process die and give a meaningful stack trace and error message.
/* istanbul ignore next */
function scrubConfig(config) {
  if(typeof config.db.url !== 'string') {
    throw new Error('MONGO_URL must be a string');
  }
}

scrubConfig(module.exports);
