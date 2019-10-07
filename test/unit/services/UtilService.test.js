const nock = require('nock');

describe('UtilService', () => {
  describe('makeRequest', () => {
    it('should parse the request object to make an outbound request', (done) => {
      nock('https://jsonplaceholder.typicode.com')
        .get('/todos/1')
        .reply(200, {
          id: 1
        });

      UtilService.makeRequest({
        url: 'https://jsonplaceholder.typicode.com/todos/1',
        method: 'GET',
        data: {
          params: {},
          headers: {},
          body: {}
        }
      }, (err, response) => {
        expect(err).to.be.null;
        expect(response).to.be.an('object');

        return done();
      });
    });
  });

  describe('getNextRunningTime', () => {
    describe('hourly interval', () => {
      it('it should return the nextRunningTime by adding hours based on interval', (done) => {
        let currentTime = new Date().getTime(),
          nextRunningTime = UtilService.getNextRunningTime({
            every: 2,
            interval: 'hours'
          }),
          MS_TO_HOUR_DIVIDER = 3600000;

        expect(Math.trunc((nextRunningTime - currentTime)/MS_TO_HOUR_DIVIDER)).to.equal(2);
        return done();
      });
    });

    describe('daily interval', () => {
      it('it should return the nextRunningTime by adding days based on interval', (done) => {
        let currentTime = new Date(),
          nextRunningTime = UtilService.getNextRunningTime({
            every: 2,
            interval: 'days'
          }),
          MS_TO_DAY_DIVIDER = 1000*60*60*24;

        expect(Math.trunc((nextRunningTime - currentTime)/MS_TO_DAY_DIVIDER)).to.equal(2);
        return done();
      });
    });

    describe('weekly interval', () => {
      it('it should return the nextRunningTime by adding weeks based on interval', (done) => {
        let currentTime = new Date(),
          nextRunningTime = UtilService.getNextRunningTime({
            every: 2,
            interval: 'weeks'
          }),
          MS_TO_DAY_DIVIDER = 1000*60*60*24;

        expect(Math.trunc((nextRunningTime - currentTime)/MS_TO_DAY_DIVIDER)).to.equal(14);
        return done();
      });
    });

    describe('monthly interval', () => {
      it('it should return the nextRunningTime by adding months based on interval', () => {
        let currentTime = new Date(),
          nextRunningTime = UtilService.getNextRunningTime({
            every: 1,
            interval: 'months'
          }),
          MS_TO_DAY_DIVIDER = 1000*60*60*24;

        // Adding range check since days in month may vary.
        expect(Math.trunc((nextRunningTime - currentTime)/MS_TO_DAY_DIVIDER)).to.be.within(28, 31);
      });
    });

    describe('invalid interval', () => {
      it('should simply return in case of invalid interval', () => {
        let nextRunningTime = UtilService.getNextRunningTime({
          every: 1,
          interval: 'random'
        });

        expect(nextRunningTime).to.be.undefined;
      });
    });
  });

  describe('getTimeInIst', () => {
    it('should return the time in Indian Standard Time', () => {
      const istTime = UtilService.getTimeInIst();

      expect(istTime).to.be.a('string');
    });
  }); 
});
