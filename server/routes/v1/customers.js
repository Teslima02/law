const { Router } = require('express');
const passport = require('passport');
const _ = require('lodash');
const mongoose = require('mongoose');
const Request = require('request');
const { v1 } = require('config');
const Account = require('../../models/v1/account');
const Transaction = require('../../models/v1/transaction')
const router = Router();

/* eslint-disable no-underscore-dangle */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Account.find({ roleId: 'agent' }).exec((err, agents) => {
      if (err) {
        res.json(400, err);
        return;
      }
      res.json(agents);
    });
  },
);

router.get(
  '/transaction/history',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Transaction.find({ receivedBy: req.user._id, type: 'credit' })
      .sort({ createdAt: -1 })
      .exec((err, histories) => {
        if (err) {
          res.json(400, err);
          return;
        }
        res.json(histories);
      });
  },
);
module.exports = router;
