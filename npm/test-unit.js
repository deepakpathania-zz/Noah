#!/usr/bin/env node

const path = require('path'),

  chalk = require('chalk'),
  recursive = require('recursive-readdir'),
  Mocha = require('mocha'),

  TEST_DIRECTORY_SOURCE = path.join(__dirname, '..', 'test', 'unit');

module.exports = function (exit) {
  console.info(chalk.yellow.bold('Running unit tests'));

  recursive(TEST_DIRECTORY_SOURCE, (err, files) => {
    if (err) {
      console.error(err);

      return exit(1);
    }

    const mocha = new Mocha({ timeout: 1000 * 60 });

    // add bootstrap file for talking to the test datastore.
    mocha.addFile(path.join(TEST_DIRECTORY_SOURCE, '_bootstrap.js'));

    files.filter((file) => {
      return (file.substr(-8) === '.test.js');
    }).forEach(mocha.addFile.bind(mocha));

    return mocha.run((runError) => {
      runError && console.error(runError.stack || runError);

      exit(runError ? 1 : 0);
    });
  });
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(process.exit);
