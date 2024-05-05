const passport = require('passport');
const passportJWT = require('passport-jwt');

const config = require('../../core/config');
const { bankAcc } = require('../../models');

// Authenticate user based on the JWT token
passport.use(
  'bankAcc',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: config.secret.jwt,
    },
    async (payload, done) => {
      const bankAcc = await bankAcc.findOne({ noRek: payload.bankAcc_noRek });
      return bankAcc ? done(null, bankAcc) : done(null, false);
    }
  )
);

module.exports = passport.authenticate('bankAcc', { session: false });
//
