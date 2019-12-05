const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { Strategy } = require('passport-local');

// Helper

// Routes
const Auth = require('../routes/v1/auth');
const agents = require('../routes/v1/agents');
const pins = require('../routes/v1/pins');
const wallets = require('../routes/v1/wallets');
const customers = require('../routes/v1/customers');
const cash = require('../routes/v1/cash');
const topup = require('../routes/v1/topup');
const states = require('../routes/v1/states');
const cities = require('../routes/v1/cities');
const branches = require('../routes/v1/branches');
const businesses = require('../routes/v1/businesses');
const products = require('../routes/v1/products');
const payments = require('../routes/v1/payments');
const channels = require('../routes/v1/channels');
const dialogs = require('../routes/v1/dialogs');
const bots = require('../routes/v1/bots');

// Account model
const Account = require('../models/v1/account');

module.exports = function init(app) {
  app.use(passport.initialize());
  passport.use(new Strategy(Account.authenticate()));
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'merchant-secret',
      },
      (jp, cb) => {
        Account.findById(jp.userId)
          .then(user => cb(null, user))
          .catch(err => cb(err));
      },
    ),
  );
  passport.serializeUser(Account.serializeUser());
  passport.deserializeUser(Account.deserializeUser());

  // If you need a backend, e.g. an API, add your custom backend-specific   middleware here
  app.use('/api/v1/auth', Auth);
  app.use('/api/v1/agents', agents);
  app.use('/api/v1/pins', pins);
  app.use('/api/v1/wallets', wallets);
  app.use('/api/v1/customers', customers);
  app.use('/api/v1/cash', cash);
  app.use('/api/v1/topup', topup);
  app.use('/api/v1/states', states);
  app.use('/api/v1/cities', cities);
  app.use('/api/v1/businesses', businesses);
  app.use('/api/v1/branches', branches);
  app.use('/api/v1/products', products);
  app.use('/api/v1/payments', payments);
  app.use('/api/v1/channels', channels);
  app.use('/api/v1/dialogs', dialogs);
  app.use('/api/v1/bots', bots);
};
