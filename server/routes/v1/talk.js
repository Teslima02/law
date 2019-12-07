const { Router } = require('express');
const passport = require('passport');
const _ = require('lodash');
const mongoose = require('mongoose');
const Request = require('request');
const { v1 } = require('config');
const Account = require('../../models/v1/talk');
const router = Router();

/* eslint-disable no-underscore-dangle */
router.get('/', (req, res) => {
  Account.find().exec((err, talks) => {
    if (err) {
      res.json(400, err);
      return;
    }
    res.json(talks);
  });
});

router.post('/', (req, res) => {
  const { title, content } = req.body;

  const newTalk = new Account();
  newTalk.title = title;
  newTalk.content = content;
  newTalk.save((err, talk) => {
    if (err) {
      res.status(400).send('Unable to create talk');
    } else {
      res.status(200).json({
        success: true,
        message: 'Talk Created Successfully',
        talk,
      });
    }
  });
});

router.post(
  '/customer',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const newUser = req.body;
    newUser.roleId = 'customer';
    newUser.createdBy = req.user._id;
    // newUser.walletId = generatePin();
    console.log(newUser, 'newUser');

    Account.register(
      new Account(newUser),
      'password',
      async (err, customer) => {
        if (err) {
          res.status(400).send('User Failed to save');
        } else {
          customer.wallet.walletId = generatePin();
          customer.save();
          res.status(200).json({
            success: true,
            message: 'Customer Created Successfully',
            customer,
          });
        }
      },
    );
  },
);

router.get(
  '/fetch/customers',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Account.find({ createdBy: req.user._id, roleId: 'customer' }).exec(
      (err, customers) => {
        if (err) {
          res.json(400, err);
          return;
        }
        res.json(customers);
      },
    );
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
        }
        // res.json({
        //   Account,
        //   services: apiKeys[Account.helperKey].services.map(s => s.type),
        // });
      });
  },
);

// router.post(
//   '/:id/dialogs',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     const { dialogs, type } = req.body;
//     const { id } = req.params;
//     Account.findById(id, async (err, Account) => {
//       if (err || !Account) {
//         res.json(400, err);
//         return;
//       }
//       // ! remove deleted dialogs

//       const created = dialogs.map(d => {
//         if (d._id) {
//           return Dialog.findByIdAndUpdate(d._id, d, { new: true });
//         }
//         return Dialog.create({
//           ...d,
//           businessType: type,
//           Account: mongoose.Types.ObjectId(id),
//         });
//       });

//       res.json({ dialogs: await Promise.all(created), type });
//     });
//   },
// );

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

    // if (!apiKeys[helperKey]) {
    //   res.json(404, { message: 'API key not found!' });
    //   return;
    // }
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
