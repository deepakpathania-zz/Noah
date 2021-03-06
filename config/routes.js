/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  // HealthController
  'GET /knockknock': 'HealthController.check',

  // ScheduleController
  'POST /v1/schedules': 'ScheduleController.createSchedule',
  'GET /v1/schedules': 'ScheduleController.getAllSchedules',
  'GET /v1/schedules/:identifier': 'ScheduleController.getScheduleRunhistory',
  'PUT /v1/schedules/:identifier': 'ScheduleController.updateSchedule',
  'DELETE /v1/schedules/:identifier': 'ScheduleController.deleteSchedule'
};
