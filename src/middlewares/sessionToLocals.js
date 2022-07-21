


async function sessionToLocals(req, res, next) {
   if (req.user) {
      res.locals.user = req.user;
   }

   next();
}

module.exports = sessionToLocals;