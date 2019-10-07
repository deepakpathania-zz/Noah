const request = require('request');

module.exports = {
  makeRequest: (requestObject, cb) => {
    const { url, method, data } = requestObject;

    request({
      method: method,
      url: url,
      headers: _.get(data, 'headers', {}),
      qs: _.get(data, 'params', {}),
      body: _.get(data, 'body', {}),
      json: true
    }, (err, response) => {
      return cb(err, response);
    });
  },

  getNextRunningTime: (schedulePeriod) => {
    let { every, interval } = schedulePeriod,
      today = new Date();

    if (interval.toLowerCase() === 'hours') {
      return today.setHours(today.getHours() + every);
    }
    else if (interval.toLowerCase() === 'days') {
      return today.setDate(today.getDate() + every);
    }
    else if (interval.toLowerCase() === 'weeks') {
      return today.setDate(today.getDate() + (every*7));
    }
    else if (interval.toLowerCase() === 'months') {
      return today.setMonth(today.getMonth() + every);
    }
    else {
      return;
    }
  },

  getTimeInIst: () => {
    let currentTime = new Date(),
      currentOffset = currentTime.getTimezoneOffset(),
      ISTOffset = 330,
      ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);

    return ISTTime.toDateString() + ' ' + ISTTime.getHours() + ':' + ISTTime.getMinutes();
  }
};
