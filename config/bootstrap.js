/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

const cron = require('cron'),
  CronJob = cron.CronJob,

  TIMEZONE = 'Asia/Kolkata';

module.exports.bootstrap = function(cb) {
  sails.log('\nSetting up the process cron to run every 5 minutes\n.');

  try {
    new CronJob('*/5 * * * *', () => {
      CronService.process((err) => {
        if (err) {
          sails.log.error(err);
        }

        sails.log('Done processing schedules at : ', UtilService.getTimeInIst());
      });
    }, null, true, TIMEZONE);
  }
  catch (e) {
    sails.log.error('Error setting up cron : ', e.message);
  }

  return cb();
};
