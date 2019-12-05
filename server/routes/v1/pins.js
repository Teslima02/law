const { Router } = require('express');
const passport = require('passport');
const _ = require('lodash');
const mongoose = require('mongoose');
const Request = require('request');
const { v1 } = require('config');
const Account = require('../../models/v1/account');
const Pin = require('../../models/v1/pin');
const Dialog = require('../../models/v1/dialog');
const apiKeys = require('../../helpers/v1/keys');
const router = Router();

/* eslint-disable no-underscore-dangle */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Pin.find().exec((err, pins) => {
      if (err) {
        res.json(400, err);
        return;
      }
      res.json(pins);
    });
  },
);

function generatePin() {
  let numb = '';
  const possible = '0123456789';
  for (let i = 0; i < 15; i++)
    numb += possible.charAt(Math.floor(Math.random() * possible.length));

  return numb;
}

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { number, email, amount } = req.body;

    for (let i = 0; i < number; i++) {
      let genPin = '';
      let check = false;

      if (check === false) {
        genPin = generatePin();

        Pin.count({ pin: genPin }, (err, countPin) => {
          if (countPin === 0) {
            check = true;
          }
        });
      }

      const newPin = new Pin();
      newPin.createdBy = req.user._id;
      newPin.pin = genPin;
      newPin.amount = amount;
      newPin.sent = true;
      newPin.email = email;
      newPin.from = 'staff';
      newPin.status = 'unused';
      newPin.save((err, newPins) => {
        if (err) {
          res.status(400).send('Unable to create pin');
        } else {
          // if (i === 0) {
          //   const pins = newPins;
          // } else {
          //   const pins =  newPins;
          // }
          // console.log(pins, 'pins');
          res.status(200).json({
            success: true,
            message: 'Pin Created Successfully',
            newPins,
          });
        }
      });
    }
  },
);

router.post(
  '/recharge/wallet',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const user = await Account.findById(req.user._id);
    const countPin = await Pin.count({ pin: req.body.pin, status: 'unused' });
    const getPin = await Pin.findOne({ pin: req.body.pin, status: 'unused' });
    if (countPin < 1) {
      return res
        .status(404)
        .json({ message: 'You have enter an incorrect pin' });
    }

    getPin.status = 'used';
    getPin.usedBy = user._id;
    getPin.save();

    user.wallet.balance += getPin.amount;
    user.wallet.lastUpdated = Date();
    user.save((err, newFund) => {
      if (err) {
        return res.status(404).json({ message: 'Top-Up Failed' });
      }
      return res.status(200).json({
        success: true,
        message: 'Top-Up Successful',
        newFund,
      });
    });
  },
);

router.get(
  '/pin/amount',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const getPin = await Pin.findOne({ pin: req.body.pin, status: 'unused' });
    if (!getPin) {
      return res
        .status(404)
        .json({ message: 'You have enter an incorrect pin' });
    }
    return res.json(getPin);
  },
);

router.get(
  '/used/pin',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Pin.find({ status: 'used', usedBy: req.user._id }).exec((err, pins) => {
      if (err) {
        res.json(400, err);
        return;
      }
      res.json(pins);
    });
  },
);

router.get(
  '/wallet',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Account.findById(req.user._id).exec((err, user) => {
      if (err) {
        res.status(400).json(err);
        return;
      }
      res.json(user);
    });
  },
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Account.findById(req.params.id)
      .populate('states')
      .exec((err, Account) => {
        if (err) {
          res.json(400, err);
          return;
        }
        if (!Account) {
          res.json(404, { message: 'Account not found!' });
          return;
        }
        res.json({
          Account,
          services: apiKeys[Account.helperKey].services.map(s => s.type),
        });
      });
  },
);

router.post(
  '/:id/dialogs',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { dialogs, type } = req.body;
    const { id } = req.params;
    Account.findById(id, async (err, Account) => {
      if (err || !Account) {
        res.json(400, err);
        return;
      }
      // ! remove deleted dialogs

      const created = dialogs.map(d => {
        if (d._id) {
          return Dialog.findByIdAndUpdate(d._id, d, { new: true });
        }
        return Dialog.create({
          ...d,
          businessType: type,
          Account: mongoose.Types.ObjectId(id),
        });
      });

      res.json({ dialogs: await Promise.all(created), type });
    });
  },
);

router.get(
  '/:id/dialogs',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Account.findById(req.params.id, async (err, Account) => {
      if (err || !Account) {
        res.json(400, err);
        return;
      }
      const dialogs = [];
      const { services } = apiKeys[Account.helperKey];
      services.every(ser =>
        dialogs.push([
          ser.type,
          Dialog.find({
            businessType: ser.type,
            Account: Account._id,
          }),
        ]),
      );

      res.json(
        _.fromPairs(await Promise.all(dialogs.map(d => Promise.all(d)))),
      );
    });
  },
);

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { businesses } = req.body;
    Account.remove({ _id: { $in: businesses } }, err => {
      if (err) {
        res.json(400, err);
        return;
      }
      res.status(204).end();
    });
  },
);

router.put(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const {
      name,
      description,
      states,
      address,
      website,
      email,
      phone,
      active,
      _id,
      bank,
      accountNo,
      helperKey,
      subAccountId,
    } = req.body;

    if (!apiKeys[helperKey]) {
      res.json(404, { message: 'API key not found!' });
      return;
    }
    const { accountChURL, PBFPubKey, API } = v1.ESPI;
    Request.post(
      {
        url: accountChURL,
        form: {
          recipientaccount: `${accountNo}`,
          destbankcode: bank,
          PBFPubKey,
        },
        json: true,
      },
      (_err, _resp, _respBody) => {
        if (_respBody.data.data.responsecode !== '00' || _err) {
          res.json(404, { message: 'Bank Account Not Found!' });
          return;
        }
        Request.put(
          {
            url: API.subAccount.edit.format(subAccountId),
            form: {
              client_id: _id,
              subaccount_id: subAccountId,
              account_number: accountNo,
              account_bank: bank,
              business_name: name,
              business_email: email,
              business_mobile: phone,
              split_type: 'flat',
              split_value: 0,
            },
            json: true,
          },
          (err2, resp, respBody) => {
            if (err2) {
              console.log(err2);
              res.status(500).json({
                message:
                  'Unable to update Account at the moment please try again',
              });
              return;
            }
            if (resp.statusCode !== 200) {
              console.log(respBody);
              res.status(500).json({
                message:
                  'Unable to update Account at the moment please try again',
              });
              return;
            }
            const { data } = respBody;
            Account.findByIdAndUpdate(
              _id,
              {
                name,
                description,
                address,
                website,
                email,
                phone,
                active,
                bank,
                accountNo,
                accountName: _respBody.data.data.accountname,
                subAccountId: data.subaccount_id,
                helperKey,
                states, // : states.map(id => mongoose.Types.ObjectId(id)),
              },
              { new: true },
              (err, Account) => {
                if (err) {
                  res.json(400, err);
                  return;
                }
                res.json(201, Account);
              },
            );
          },
        );
      },
    );
  },
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { id } = req.body;
    const { API } = v1.ESPI;
    Account.findById(id, (_error, Account) => {
      if (!Account || _error) {
        res.json(404, { message: 'Account not found!' });
        return;
      }
      Request.delete(
        {
          url: API.subAccount.delete.format(Account.subAccountId),
          json: true,
        },
        (err2, resp) => {
          if (err2) {
            console.log(err2);
            res.status(500).json({ message: 'Unable to delete Account!' });
            return;
          }
          if (
            resp.statusCode === 422 ||
            resp.statusCode === 404 ||
            resp.statusCode === 200
          ) {
            Account.findByIdAndRemove(id, err => {
              if (err) {
                res.status(400).json(err);
                return;
              }
              res
                .status(204)
                .json({ message: 'Account deleted successfully.' });
            });
          } else {
            res.status(500).json({ message: 'Unable to delete Account!' });
          }
        },
      );
    });
  },
);

module.exports = router;
