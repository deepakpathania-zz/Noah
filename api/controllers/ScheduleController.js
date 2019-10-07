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
  }
};
