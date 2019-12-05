const { Router } = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const City = require('../../models/v1/city');
const Business = require('../../models/v1/business');
const router = Router();
/* eslint-disable no-underscore-dangle */
router.get(
  '/state/:stateId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    City.find(
      {
        state: mongoose.Types.ObjectId(req.params.stateId),
      },
      (err, cities) => {
        if (err) {
          res.json([]);
          return;
        }
        res.json(cities);
      },
    );
  },
);

router.get(
  '/business/:businessId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Business.findById(req.params.businessId, (err, bus) => {
      if (!bus) {
        res.json([]);
        return;
      }
      City.find(
        {
          state: { $in: bus.states },
        },
        (error, cities) => {
          if (error) {
            res.json([]);
            return;
          }
          res.json(cities);
        },
      );
    });
  },
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    City.find({}, (err, cities) => {
      if (err) {
        res.json([]);
        return;
      }
      res.json(cities);
    });
  },
);

module.exports = router;
