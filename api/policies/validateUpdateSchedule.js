const Ajv = require('ajv'),

  schema = {
    $id: 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    properties: {
      request: {
        type: 'object',
        properties: {
          url: {
            type: 'string'
          },
          method: {
            type: 'string',
            enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']
          },
          data: {
            type: 'object',
            properties: {
              params: {
                type: 'object'
              },
              headers: {
                type: 'object'
              },
              body: {
                type: 'object'
              }
            }
          }
        },
        required: ['url', 'method', 'data']
      },
      period: {
        type: 'object',
        properties: {
          every: {
            type: 'integer'
          },
          interval: {
            type: 'string',
            enum: ['hours', 'days', 'weeks', 'months']
          }
        },
        required: ['every', 'interval']
      }
    }
  },

  ajv = new Ajv(),
  validate = ajv.compile(schema);

module.exports = (req, res, next) => {
  const body = req.body;

  if (!validate(body)) {
    return res.badRequest({
      name: 'invalidParamsError',
      message: validate.errors
    });
  }

  return next();
};
