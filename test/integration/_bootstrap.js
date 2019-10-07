const _ = require('lodash'),
  chai = require('chai'),
  mysql = require('mysql'),
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
  const testConfig = require('../../config/env/test').datastores.mySql;

  global.expect = chai.expect;
  global.app = () => { return require('supertest')(sails.hooks.http.app); };

  async.series([
    (next) => {
      mysql.createConnection(_.omit(testConfig, ['database']))
        .query(`CREATE DATABASE IF NOT EXISTS ${testConfig.database}`, next);
    },

    (next) => {
      Sails.lift(_.defaults({
        environment: 'test',
        log: { level: 'silent' }
      }, rc('sails')), next);
    }
  ], done);
});

describe('bootstrap tests', () => {
  it('should lift the service', (done) => {
    app().get('/knockknock')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end(done);
  });
});

afterEach((done) => {
  let destroyFuncs = [];

  // eslint-disable-next-line guard-for-in
  for (let modelName in sails.models) {
    destroyFuncs.push((callback) => {
      sails.models[modelName].destroy({})
        .exec((err) => { callback(null, err); });
    });
  }
  async.parallel(destroyFuncs, (err) => { done(err); });
});


after((done) => {
  delete global.app;
  delete global.expect;
  sails.lower(done);
});
