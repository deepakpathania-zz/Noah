module.exports = {
  check: (req, res) => {
    async.waterfall([
      (next) => {
        Health
          .findOne({
            id: 1
          })
          .exec((err, response) => {
            return next(err, response);
          });
      },
      (response, next) => {
        if (!response) {
          Health
            .create({
              id: 1
            })
            .exec((err, response) => {
              return next(err, response);
            });
        }

        Health
          .update({
            id: 1
          })
          .set({})
          .exec((err, response) => {
            return next(err, response);
          });
      }
    ], (err) => {
      if (err) {
        return res.serverError({
          name: 'serverError',
          message: err.message
        });
      }

      return res.ok({
        'message': 'Sic Mundus Creatus Est'
      });
    });
  }
};
