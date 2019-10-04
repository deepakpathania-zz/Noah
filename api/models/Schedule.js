module.exports = {
  schema: true,
  primaryKey: 'id',
  attributes: {
    id: {
      type: 'number',
      autoIncrement: true
    },
    nextRunningTime: {
      type: 'number',
      required: true
    },
    status: {
      type: 'number',
      defaultsTo: 1
    },
    period: {
      type: 'json'
    },
    request: {
      type: 'json'
    }
  }
};
