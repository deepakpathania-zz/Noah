module.exports = {
  check: (req, res) => {
    async.waterfall([
      (next) => {
        // Try to read the record from the database.
        Health
          .findOne({
            id: 1
          })
          .exec((err, response) => {
            return next(err, response);
          });
      },
      (response, next) => {
        // If reading fails, try writing.
        if (!response) {
          Health
            .create({
              id: 1
            })
            .exec((err, response) => {
              return next(err, response);
            });
        }

        // Update the record in case it was found during read.
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
