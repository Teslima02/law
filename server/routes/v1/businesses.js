const { Router } = require('express');
const passport = require('passport');
const _ = require('lodash');
const mongoose = require('mongoose');
const Request = require('request');
const { v1 } = require('config');
const Business = require('../../models/v1/business');
const Dialog = require('../../models/v1/dialog');
const apiKeys = require('../../helpers/v1/keys');
const router = Router();

/* eslint-disable no-underscore-dangle */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Business.find({})
      .populate('states')
      .exec((err, businesses) => {
        if (err) {
          res.json(400, err);
          return;
        }
        res.json(businesses);
      });
  },
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Business.findById(req.params.id)
      .populate('states')
      .exec((err, business) => {
        if (err) {
          res.json(400, err);
          return;
        }
        if (!business) {
          res.json(404, { message: 'Business not found!' });
          return;
        }
        res.json({
          business,
          services: apiKeys[business.helperKey].services.map(s => s.type),
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
    Business.findById(id, async (err, business) => {
      if (err || !business) {
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
          business: mongoose.Types.ObjectId(id),
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
    Business.findById(req.params.id, async (err, business) => {
      if (err || !business) {
        res.json(400, err);
        return;
      }
      const dialogs = [];
      const { services } = apiKeys[business.helperKey];
      services.every(ser =>
        dialogs.push([
          ser.type,
          Dialog.find({
            businessType: ser.type,
            business: business._id,
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
    Business.remove({ _id: { $in: businesses } }, err => {
      if (err) {
        res.json(400, err);
        return;
      }
      res.status(204).end();
    });
  },
);

router.post(
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
      bank,
      accountNo,
      helperKey,
    } = req.body;

    if (!apiKeys[helperKey]) {
      res.json(404, { message: 'API key not found!' });
      return;
    }
    // ? validate account
    const { accountChURL, PBFPubKey, API } = v1.ESPI;
    Request.post(
      {
        url: accountChURL,
        form: {
          recipientaccount: accountNo,
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
        Business.findOne({ website, phone, email, helperKey }, (err, old) => {
          if (err || old) {
            res.json(404, { message: 'Account detail already exists!' });
            return;
          }
          const businessId = mongoose.Types.ObjectId();
          Request.post(
            {
              url: API.subAccount.create,
              form: {
                client_id: businessId.toString(),
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
                res.json(500, { message: 'Unable to create SubAccount!' });
                return;
              }
              if (resp.statusCode !== 200) {
                res.json(500, { message: respBody.message });
                return;
              }
              const { data } = respBody;
              Business.create(
                {
                  _id: businessId,
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
                (_error, business) => {
                  if (_error) {
                    res.json(400, _error);
                    return;
                  }
                  res.json(201, business);
                },
              );
            },
          );
        });
      },
    );
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
                  'Unable to update business at the moment please try again',
              });
              return;
            }
            if (resp.statusCode !== 200) {
              console.log(respBody);
              res.status(500).json({
                message:
                  'Unable to update business at the moment please try again',
              });
              return;
            }
            const { data } = respBody;
            Business.findByIdAndUpdate(
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
              (err, business) => {
                if (err) {
                  res.json(400, err);
                  return;
                }
                res.json(201, business);
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
    Business.findById(id, (_error, business) => {
      if (!business || _error) {
        res.json(404, { message: 'Business not found!' });
        return;
      }
      Request.delete(
        {
          url: API.subAccount.delete.format(business.subAccountId),
          json: true,
        },
        (err2, resp) => {
          if (err2) {
            console.log(err2);
            res.status(500).json({ message: 'Unable to delete business!' });
            return;
          }
          if (
            resp.statusCode === 422 ||
            resp.statusCode === 404 ||
            resp.statusCode === 200
          ) {
            Business.findByIdAndRemove(id, err => {
              if (err) {
                res.status(400).json(err);
                return;
              }
              res
                .status(204)
                .json({ message: 'Business deleted successfully.' });
            });
          } else {
            res.status(500).json({ message: 'Unable to delete business!' });
          }
        },
      );
    });
  },
);

module.exports = router;
