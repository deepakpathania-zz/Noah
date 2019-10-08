module.exports = {
  schema: true,
  primaryKey: 'id',
  attributes: {
    id: {
      type: 'number',
      autoIncrement: true
    },
    schedule: {
      model: 'schedule'
    },
    runTime: {
      type: 'number'
    },
    responseStatusCode: {
      type: 'number'
    },
    responseBody: {
      type: 'json'
    }
  }
};
