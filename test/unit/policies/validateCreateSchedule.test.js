const sinon = require('sinon');

describe('validateCreateSchedule', () => {
  it('should throw a badRequestError in case request is not specified', (done) => {
    const req = {
        body: {
          period: {
            every: 2,
            interval: 'hours'
          }
        }
      },
      res = {
        badRequest: (object) => {
          return object;
        }
      },
      next = () => {},

      resSpy = sinon.spy(res, 'badRequest'),
      nextSpy = sinon.spy(next);

    sails.hooks.policies.middleware.validatecreateschedule(req, res, next);

    expect(resSpy.callCount).to.equal(1);
    expect(resSpy.getCall(0).args[0].message[0].message)
      .to.equal('should have required property \'request\'');
    expect(nextSpy.callCount).to.equal(0);
    return done();
  });

  it('should throw a badRequestError in case request url is not specified', (done) => {
    const req = {
        body: {
          request: {
            method: 'GET',
            data: {
              params: {},
              headers: {},
              body: {}
            }
          },
          period: {
            every: 2,
            interval: 'hours'
          }
        }
      },
      res = {
        badRequest: (object) => {
          return object;
        }
      },
      next = () => {},

      resSpy = sinon.spy(res, 'badRequest'),
      nextSpy = sinon.spy(next);

    sails.hooks.policies.middleware.validatecreateschedule(req, res, next);

    expect(resSpy.callCount).to.equal(1);
    expect(resSpy.getCall(0).args[0].message[0].message)
      .to.equal('should have required property \'url\'');
    expect(nextSpy.callCount).to.equal(0);
    return done();
  });

  it('should throw a badRequestError in case request method is not specified', (done) => {
    const req = {
        body: {
          request: {
            url: 'https://google.com',
            data: {
              params: {},
              headers: {},
              body: {}
            }
          },
          period: {
            every: 2,
            interval: 'hours'
          }
        }
      },
      res = {
        badRequest: (object) => {
          return object;
        }
      },
      next = () => {},

      resSpy = sinon.spy(res, 'badRequest'),
      nextSpy = sinon.spy(next);

    sails.hooks.policies.middleware.validatecreateschedule(req, res, next);

    expect(resSpy.callCount).to.equal(1);
    expect(resSpy.getCall(0).args[0].message[0].message)
      .to.equal('should have required property \'method\'');
    expect(nextSpy.callCount).to.equal(0);
    return done();
  });

  it('should throw a badRequestError in case request method is invalid', (done) => {
    const req = {
        body: {
          request: {
            url: 'https://google.com',
            method: 'random',
            data: {
              params: {},
              headers: {},
              body: {}
            }
          },
          period: {
            every: 2,
            interval: 'hours'
          }
        }
      },
      res = {
        badRequest: (object) => {
          return object;
        }
      },
      next = () => {},

      resSpy = sinon.spy(res, 'badRequest'),
      nextSpy = sinon.spy(next);

    sails.hooks.policies.middleware.validatecreateschedule(req, res, next);

    expect(resSpy.callCount).to.equal(1);
    expect(resSpy.getCall(0).args[0].message[0].message)
      .to.equal('should be equal to one of the allowed values');
    expect(nextSpy.callCount).to.equal(0);
    return done();
  });

  it('should throw a badRequestError in case request data is not specified', (done) => {
    const req = {
        body: {
          request: {
            url: 'https://google.com',
            method: 'GET',
          },
          period: {
            every: 2,
            interval: 'hours'
          }
        }
      },
      res = {
        badRequest: (object) => {
          return object;
        }
      },
      next = () => {},

      resSpy = sinon.spy(res, 'badRequest'),
      nextSpy = sinon.spy(next);

    sails.hooks.policies.middleware.validatecreateschedule(req, res, next);

    expect(resSpy.callCount).to.equal(1);
    expect(resSpy.getCall(0).args[0].message[0].message)
      .to.equal('should have required property \'data\'');
    expect(nextSpy.callCount).to.equal(0);
    return done();
  });

  it('should throw a badRequestError in case period is not specified', (done) => {
    const req = {
        body: {
          request: {
            url: 'https://google.com',
            method: 'GET',
            data: {
              params: {},
              headers: {},
              body: {}
            }
          }
        }
      },
      res = {
        badRequest: (object) => {
          return object;
        }
      },
      next = () => {},

      resSpy = sinon.spy(res, 'badRequest'),
      nextSpy = sinon.spy(next);

    sails.hooks.policies.middleware.validatecreateschedule(req, res, next);

    expect(resSpy.callCount).to.equal(1);
    expect(resSpy.getCall(0).args[0].message[0].message)
      .to.equal('should have required property \'period\'');
    expect(nextSpy.callCount).to.equal(0);

    return done();
  });

  it('should throw a badRequestError in case period every is not specified', (done) => {
    const req = {
        body: {
          request: {
            url: 'https://google.com',
            method: 'GET',
            data: {
              params: {},
              headers: {},
              body: {}
            }
          },
          period: {
            interval: 'hours'
          }
        }
      },
      res = {
        badRequest: (object) => {
          return object;
        }
      },
      next = () => {},

      resSpy = sinon.spy(res, 'badRequest'),
      nextSpy = sinon.spy(next);

    sails.hooks.policies.middleware.validatecreateschedule(req, res, next);

    expect(resSpy.callCount).to.equal(1);
    expect(resSpy.getCall(0).args[0].message[0].message)
      .to.equal('should have required property \'every\'');
    expect(nextSpy.callCount).to.equal(0);

    return done();
  });

  it('should throw a badRequestError in case period interval is not specified', (done) => {
    const req = {
        body: {
          request: {
            url: 'https://google.com',
            method: 'GET',
            data: {
              params: {},
              headers: {},
              body: {}
            }
          },
          period: {
            every: 2
          }
        }
      },
      res = {
        badRequest: (object) => {
          return object;
        }
      },
      next = () => {},

      resSpy = sinon.spy(res, 'badRequest'),
      nextSpy = sinon.spy(next);

    sails.hooks.policies.middleware.validatecreateschedule(req, res, next);

    expect(resSpy.callCount).to.equal(1);
    expect(resSpy.getCall(0).args[0].message[0].message)
      .to.equal('should have required property \'interval\'');
    expect(nextSpy.callCount).to.equal(0);

    return done();
  });

  it('should throw a badRequestError in case period interval is invalid', (done) => {
    const req = {
        body: {
          request: {
            url: 'https://google.com',
            method: 'GET',
            data: {
              params: {},
              headers: {},
              body: {}
            }
          },
          period: {
            every: 2,
            interval: 'random'
          }
        }
      },
      res = {
        badRequest: (object) => {
          return object;
        }
      },
      next = () => {},

      resSpy = sinon.spy(res, 'badRequest'),
      nextSpy = sinon.spy(next);

    sails.hooks.policies.middleware.validatecreateschedule(req, res, next);

    expect(resSpy.callCount).to.equal(1);
    expect(resSpy.getCall(0).args[0].message[0].message)
      .to.equal('should be equal to one of the allowed values');
    expect(nextSpy.callCount).to.equal(0);

    return done();
  });

  it('should invoke next in case the request body is valid', (done) => {
    const req = {
        body: {
          request: {
            url: 'https://google.com',
            method: 'GET',
            data: {
              params: {},
              headers: {},
              body: {}
            }
          },
          period: {
            every: 2,
            interval: 'hours'
          }
        }
      },
      res = {
        badRequest: (object) => {
          return object;
        }
      },
      object = {
        next: function () {
          return;
        }
      },

      resSpy = sinon.spy(res, 'badRequest'),
      nextSpy = sinon.spy(object, 'next');

    sails.hooks.policies.middleware.validatecreateschedule(req, res, object.next);

    expect(resSpy.callCount).to.equal(0);
    expect(nextSpy.callCount).to.equal(1);

    return done();
  });
});
