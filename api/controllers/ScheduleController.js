module.exports = {
  createSchedule: (req, res) => {
    const body = req.body;

    async.waterfall([
      (next) => {
        /**
         * If the start option is sent as true, then make a request
         * immediately and then create the schedule record.
         */
        if (body.start) {
          UtilService.makeRequest(body.request, (err) => {
            return next(err);
          });
        }
        else {
          return next(null);
        }
      },
      (next) => {
        // Get the nextRunningTime for the schedule based on the period.
        const nextRunningTime = UtilService.getNextRunningTime(body.period);

        if (!nextRunningTime) {
          return next(new Error('invalidSchedulePeriod'));
        }

        Schedule
          .create({
            nextRunningTime: nextRunningTime,
            period: body.period,
            request: body.request
          })
          .fetch()
          .exec((err, schedule) => {
            return next(err, schedule && schedule.id);
          });
      }
    ], (err, scheduleId) => {
      if (err) {
        return res.serverError({
          name: 'serverError',
          message: err.message
        });
      }

      return res.json({
        data: {
          id: scheduleId
        },
        meta: {}
      });
    });
  }
};
