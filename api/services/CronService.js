module.exports = {
  process: (cb) => {
    async.waterfall([
      /**
       * Filter out the schedules that need to be run
       * based on `nextRunningTime` and `status`.
       */
      (next) => {
        Schedule
          .find({
            nextRunningTime: {
              '<=': Date.now()
            },
            status: 1
          })
          .exec((err, schedules) => {
            return next(err, schedules);
          });
      },
      /**
       * Make the corresponding request for each eligible schedule.
       * Bail out early in case of no eligible schedules.
       */
      (schedules, next) => {
        if (schedules.length === 0) {
          return next(new Error('noSchedulesToProcessError'));
        }

        async.map(schedules, async.reflect((schedule, callback) => {
          const { request, period, storeResponseBody } = schedule;

          async.waterfall([
            /**
             * Make the request for the schedule.
             */
            (cbi) => {
              UtilService.makeRequest(request, (err, response) => {
                return cbi(err, _.get(response, 'statusCode'), Date.now(), _.get(response, 'body'));
              });
            },
            /**
             * Update the `nextRunningTime` based on period.
             */
            (responseStatusCode, runTime, responseBody, cbi) => {
              const nextRunningTime = UtilService.getNextRunningTime(period);

              Schedule
                .update({
                  id: schedule.id
                })
                .set({
                  nextRunningTime
                })
                .exec((err) => {
                  return cbi(err, responseStatusCode, runTime, responseBody);
                });
            },
            /**
             * Create a run history record for this schedule.
             */
            (responseStatusCode, runTime, responseBody, cbi) => {
              Runhistory
                .create({
                  schedule: schedule.id,
                  runTime: runTime,
                  responseStatusCode: responseStatusCode,
                  responseBody: storeResponseBody ? responseBody : null
                })
                .exec((err) => {
                  return cbi(err);
                });
            }
          ], callback);
        }), (err, results) => {
          if (err) { return next(err); }

          for (var i = 0; i < results.length; i++) {
            if (results[i].error) {
              sails.log.error(results[i].error);
            }
          }

          return next(null);
        });
      }
    ], (err) => {
      if (err) {
        if (err.message === 'noSchedulesToProcessError') {
          return cb(null);
        }

        return cb(err);
      }

      return cb(null);
    });
  }
};
