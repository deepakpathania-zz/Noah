const _ = require('lodash'),
  chai = require('chai'),
  async = require('async'),
  Sails = new require('sails').Sails();

let rc;

try {
  rc = require('rc');
}
catch (err) {
  try {
    rc = require('sails/node_modules/rc');
  }
  catch (err) {
    rc = function () { return {}; };
  }
}

before ((done) => {
  global.expect = chai.expect;
  global.app = () => { return require('supertest')(sails.hooks.http.app); };

  async.series([
    (next) => {
      Sails.lift(_.defaults({
        environment: 'test',
        log: { level: 'silent' }
      }, rc('sails')), next);
    }
  ], done);
});


after((done) => {
  delete global.app;
  delete global.expect;
  sails.lower(done);
});
