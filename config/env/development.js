require('dotenv').config();

module.exports = {
  port: process.env.PORT || 1337,

  environment: 'development',

  models: {
    schema: true,
    migrate: 'alter',
    datastore: 'mySql',
    cascadeOnDestroy: false
  },

  datastores: {
    mySql: {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB_NAME
    }
  },

  log: {
    level: 'info'
  }
};
