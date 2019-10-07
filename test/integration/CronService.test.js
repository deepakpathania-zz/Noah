const nock = require('nock');

describe('CronService', () => {
  describe('processing schedules', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    it('should bail out early in case there are no eligible entries', (done) => {
      CronService.process((err) => {
        if (err) { return done(err); }

        expect(err).to.equal(null);

        return done();
      });
    });

    it('should make the corresponding request and update nextRunningTime for eligible schedules', (done) => {
      nock('https://google.com')
        .get('/')
        .reply(200, {});

      async.waterfall([
        (next) => {
          Schedule
            .create({
              nextRunningTime: Date.now(),
              request: {
                url: 'https://google.com/',
                method: 'GET',
                data: {
                  params: {},
                  headers:{},
                  body: {}
                }
              },
              period: {
                every: 2,
                interval: 'hours'
              },
              identifier: 'abcd'
            })
            .exec((err) => {
              return next(err, 'abcd');
            });
        },
        (scheduleIdentifier, next) => {
          CronService.process((err) => {
            return next(err, scheduleIdentifier);
          });
        },
        (scheduleIdentifier, next) => {
          app()
            .get(`/v1/schedules/${scheduleIdentifier}`)
            .expect(200)
            .end((err, res) => {
              if (err) { return next(err); }

              expect(res.body.data.length).to.equal(1);
              expect(res.body.data[0].responseStatusCode).to.equal(200);

              return next(null, scheduleIdentifier);
            });
        },
        (scheduleIdentifier, next) => {
          Schedule
            .find({
              identifier: scheduleIdentifier
            })
            .limit(1)
            .exec((err, schedules) => {
              if (err) { return next(err); }

              expect(new Date(schedules[0].nextRunningTime).getHours())
                .to.equal(new Date(UtilService.getNextRunningTime({
                  every: 2,
                  interval: 'hours'
                })).getHours());

              return next();
            });
        }
      ], done);
    });
  });
});
