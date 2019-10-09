const nock = require('nock');

describe('ScheduleController', () => {
  describe('creating a schedule', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    it('should create a schedule record and compute nextRunningTime', (done) => {
      async.waterfall([
        (next) => {
          let period = {
            every: 2,
            interval: 'hours'
          };

          app()
            .post('/v1/schedules')
            .send({
              request: {
                url: 'https://google.com',
                method: 'GET',
                data: {
                  params: {},
                  headers: {},
                  body: {}
                }
              },
              period: period
            })
            .expect(200)
            .end((err, res) => {
              return next(err, _.get(res.body, 'id'), UtilService.getNextRunningTime(period));
            });
        },
        (scheduleIdentifier, nextRunningTime, next) => {
          Schedule
            .find({
              identifier: scheduleIdentifier
            })
            .limit(1)
            .exec((err, schedules) => {
              if (err) { return next(err); }

              expect(new Date(schedules[0].nextRunningTime).getHours())
                .to.equal(new Date(nextRunningTime).getHours());

              return next();
            });
        }
      ], done);
    });

    it('should make a request if the start flag is sent as true', (done) => {
      var scope = nock('https://google.com')
        .get('/')
        .reply(200, {});

      async.waterfall([
        (next) => {
          let period = {
            every: 2,
            interval: 'hours'
          };

          app()
            .post('/v1/schedules')
            .send({
              request: {
                url: 'https://google.com/',
                method: 'GET',
                data: {
                  params: {},
                  headers: {},
                  body: {}
                }
              },
              period: period,
              start: true
            })
            .expect(200)
            .end((err, res) => {
              return next(err, _.get(res.body, 'id'), UtilService.getNextRunningTime(period));
            });
        },
        (scheduleIdentifier, nextRunningTime, next) => {
          Schedule
            .find({
              identifier: scheduleIdentifier
            })
            .limit(1)
            .exec((err, schedules) => {
              if (err) { return next(err); }

              expect(new Date(schedules[0].nextRunningTime).getHours())
                .to.equal(new Date(nextRunningTime).getHours());
              expect(scope.isDone()).to.be.true;

              return next();
            });
        }
      ], done);
    });
  });

  describe('getting all schedules', () => {
    it('should return all active schedules', (done) => {
      async.series([
        // Create a schedule (active by default)
        (next) => {
          Schedule
            .create({
              nextRunningTime: 123456,
              request: {},
              period: {},
              identifier: 'abcd'
            })
            .exec(next);
        },
        // Create an inactive schedule.
        // Similar to deleting a schedule.
        (next) => {
          Schedule
            .create({
              nextRunningTime: 234561,
              request: {},
              period: {},
              identifier: 'efgh',
              status: 0
            })
            .exec(next);
        },
        (next) => {
          app()
            .get('/v1/schedules')
            .expect(200)
            .end((err, res) => {
              if (err) { return next(err); }

              expect(res.body).to.have.all.keys(['data', 'meta']);
              expect(res.body.data).to.be.an('array');
              expect(res.body.data.length).to.equal(1);
              expect(res.body.data[0]).to.have.all.keys(
                ['identifier', 'period', 'request', 'nextRunningTime', 'storeResponseBody']
              );

              return next();
            });
        }
      ], done);
    });
  });

  describe('getting runhistory of schedule', () => {
    it('should return all the runs of the specified schedule', (done) => {
      async.waterfall([
        (next) => {
          Schedule
            .create({
              nextRunningTime: 123456,
              identifier: 'abcd',
              request: {},
              period: {}
            })
            .fetch()
            .exec((err, schedule) => {
              return next(err, schedule);
            });
        },
        (schedule, next) => {
          Runhistory
            .create({
              schedule: schedule.id,
              runTime: '1234',
              responseStatusCode: 200
            })
            .exec((err) => {
              return next(err, schedule);
            });
        },
        (schedule, next) => {
          app()
            .get(`/v1/schedules/${schedule.identifier}`)
            .expect(200)
            .end((err, res) => {
              if (err) { return next(err); }

              expect(res.body).to.have.all.keys(['data', 'meta']);
              expect(res.body.data).to.be.an('array');
              expect(res.body.data.length).to.equal(1);
              expect(res.body.data[0]).to.have.all.keys(
                ['id', 'runTime', 'responseStatusCode', 'responseBody']
              );

              return next();
            });
        }
      ], done);
    });
  });

  describe('updating schedule', () => {
    it('should update the specified schedule', (done) => {
      async.waterfall([
        (next) => {
          Schedule
            .create({
              nextRunningTime: 123456,
              identifier: 'abcd',
              request: {},
              period: {}
            })
            .fetch()
            .exec((err, schedule) => {
              return next(err, schedule);
            });
        },
        (schedule, next) => {
          app()
            .put(`/v1/schedules/${schedule.identifier}`)
            .send({
              period: {
                every: 2,
                interval: 'hours'
              }
            })
            .expect(200)
            .end((err) => {
              return next(err, schedule);
            });
        },
        (schedule, next) => {
          Schedule
            .findOne({
              id: schedule.id
            })
            .exec((err, schedule) => {
              if (err) { return next(err); }

              expect(schedule.period).to.eql({
                every: 2,
                interval: 'hours'
              });

              return next();
            });
        }
      ], done);
    });
  });

  describe('deleting schedule', () => {
    it('should update the status of schedule', (done) => {
      async.waterfall([
        (next) => {
          Schedule
            .create({
              nextRunningTime: 123456,
              identifier: 'abcd',
              request: {},
              period: {}
            })
            .fetch()
            .exec((err, schedule) => {
              return next(err, schedule);
            });
        },
        (schedule, next) => {
          app()
            .delete(`/v1/schedules/${schedule.identifier}`)
            .expect(200)
            .end((err) => {
              return next(err, schedule);
            });
        },
        (schedule, next) => {
          Schedule
            .findOne({
              id: schedule.id
            })
            .exec((err, schedule) => {
              if (err) { return next(err); }

              expect(schedule.status).to.equal(0);

              return next();
            });
        }
      ], done);
    });
  });
});
