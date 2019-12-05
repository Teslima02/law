const { Router } = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const States = require('../../models/v1/state');
const router = Router();
/* eslint-disable no-underscore-dangle */
router.get(
  '/country/:countryId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    States.find(
      {
        country: mongoose.Types.ObjectId(req.params.countryId),
      },
      (err, states) => {
        if (err) {
          res.json([]);
          return;
        }
        res.json(states);
      },
    );
  },
);

module.exports = router;
