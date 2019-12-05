const { Router } = require('express');
const passport = require('passport');
const _ = require('lodash');
const mongoose = require('mongoose');
const Request = require('request');
const { v1 } = require('config');
const Account = require('../../models/v1/account');
const Transaction = require('../../models/v1/transaction');
const router = Router();

/* eslint-disable no-underscore-dangle */
/* eslint no-param-reassign: "error" */
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

router.post(
  '/user/detail',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { walletID } = req.body;
    Account.findOne({ 'wallet.walletId': walletID }).exec((err, userDetail) => {
      if (err) {
        res.status(400).json(err);
        return;
      }
      if (userDetail === null) {
        res.status(400).json({ message: "WalletID don't exist" });
        return;
      }
      res.json(userDetail);
    });
  },
);

router.post(
  '/credit',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.body, 'req.body');

    const { walletID, amount } = req.body;

    if (walletID === null || amount === null) {
      res.status(401).json({ message: 'Please fill the form properly' });
      return;
    }

    Account.findById(req.user._id).exec((err, sender) => {
      if (err) {
        res.status(400).json(err);
        return;
      }

      // if(parseInt(amount, 10))
      if (amount > sender.wallet.balance) {
        res.status(404).json({ message: 'Insufficient Fund' });
        return;
      }

      // deduct amount from sender
      sender.wallet.balance -= parseInt(amount, 10);
      sender.save();

      Account.findOne({ 'wallet.walletId': walletID }).exec(
        (errr, receiver) => {
          if (errr) {
            res.status(404).json(err);
            return;
          }
          if (!receiver) {
            res.status(404).json({ message: 'Receiver Not Found' });
            return;
          }

          receiver.wallet.balance += parseInt(amount, 10);
          receiver.save((bug, getReceiver) => {
            const transaction = new Transaction();
            transaction.sentBy = sender._id;
            transaction.receivedBy = getReceiver._id;
            transaction.amount = amount;
            transaction.status = 'successful';
            transaction.type = 'credit';
            transaction.save();
          });

          const transaction = new Transaction();
          transaction.sentBy = sender._id;
          transaction.receivedBy = receiver._id;
          transaction.amount = amount;
          transaction.status = 'successful';
          transaction.type = 'debit';
          transaction.save();

          res.json(transaction);
        },
      );
    });
  },
);

router.get(
  '/transaction/history',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Transaction.find({ sentBy: req.user._id, type: 'debit' })
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