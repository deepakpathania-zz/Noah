const crypto = require('crypto');

module.exports = {
  createSchedule: (req, res) => {
    const body = req.body;

    async.waterfall([
      (next) => {
        /**
         * If the start option is sent as true, then make a request
         * immediately and then create the schedule record.
         */
        if (_.get(body, 'start', false)) {
          UtilService.makeRequest(body.request, (err) => {
            return next(err);
          });

          /**
           * @TODO Decide whether ot not a RunHistory record should
           * be created for this case. Things to consider :
           *  - schedule hasn't been created yet.
           *  - nextRunningTime varies based on this.
           */
        }
        else {
          return next(null);
        }
      },
      (next) => {
        /**
         * Get the nextRunningTime for the schedule based on the period.
         */
        const nextRunningTime = UtilService.getNextRunningTime(body.period),
          identifier = crypto.randomBytes(16).toString('hex');  

        if (!nextRunningTime) {
          return next(new Error('invalidSchedulePeriod'));
        }

        Schedule
          .create({
            nextRunningTime: nextRunningTime,
            identifier: identifier,
            period: body.period,
            request: body.request
          })
          .exec((err) => {
            return next(err, identifier);
          });
      }
    ], (err, scheduleIdentifier) => {
      if (err) {
        return res.serverError({
          name: 'serverError',
          message: err.message
        });
      }

      return res.json({
        data: {
          id: scheduleIdentifier
        },
        meta: {}
      });
    });
  },

  getAllSchedules: (req, res) => {
    Schedule
      .find({
        status: 1
      })
      .exec((err, schedules) => {
        if (err) {
          return res.serverError({
            name: 'serverError',
            message: err.message
          });
        }

        schedules = schedules.map((schedule) => {
          return {
            identifier: schedule.identifier,
            nextRunningTime: schedule.nextRunningTime,
            request: schedule.request,
            period: schedule.period
          }
        });

        return res.json({
          data: schedules,
          meta: {
            'filter': 'active'
          }
        });
      });
  },

  getScheduleRunhistory: (req, res) => {
    async.waterfall([
      (next) => {
        Schedule
          .findOne({
            identifier: _.get(req.params, 'identifier')
          })
          .exec((err, schedule) => {
            if (err || !schedule) {
              return next(new Error('scheduleFetchingError'))
            }

            return next(null, schedule.id);
          });
      },
      (scheduleId, next) => {
        Runhistory
          .find({
            schedule: scheduleId
          })
          .exec((err, runhistories) => {
            return next(err, runhistories);
          });
      }
    ], (err, runhistories) => {
      if (err) {
        return res.serverError({
          name: 'serverError',
          message: err.message
        });
      }

      runhistories = runhistories.map((runhistory) => {
        return {
          id: runhistory.id,
          runTime: runhistory.runTime,
          responseStatusCode: runhistory.responseStatusCode
        }
      });

      return res.json({
        data: runhistories,
        meta: {}
      });
    });
  }
};
