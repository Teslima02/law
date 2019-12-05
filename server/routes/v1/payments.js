const { Router } = require('express');
// const passport = require('passport');
// const mongoose = require('mongoose');
// const Dialog = require('../../models/v1/dialog');
const Payment = require('../../models/v1/payment');
const Callback = require('../../models/v1/callback');
const Order = require('../../models/v1/order');
const processService = require('../../helpers/v1/processor');
const foreignAuth = require('../../helpers/v1/foreign_auth');
const router = Router();

router.post('/verify', foreignAuth, (req, res) => {
  const { payloadString, refId } = req.body;
  Callback.findOneAndUpdate(
    { _id: refId, payloadString },
    { fulfilled: true },
    (err, record) => {
      if (err || !record) {
        res.status(400).json({ message: 'bad request', status: 400 });
        return;
      }
      res.json({
        status: 200,
        message: 'thank you',
        phone: record.phone,
        amount: record.amount,
      });
    },
  );
});

router.post('/end', foreignAuth, (req, res) => {
  const { refId, amount } = req.body;
  Payment.findOneAndUpdate(
    { txnRef: refId, amount },
    { status: 'approve' },
    (err, record) => {
      if (err || !record) {
        res
          .status(400)
          .json({ message: 'Unable to fulfill your request at the moment' });
        return;
      }

      res.json({ message: 'Thank You.', status: 200 });
      // render service
      Order.findOneAndUpdate(
        // eslint-disable-next-line no-underscore-dangle
        { payment: record._id, status: 'pending' },
        { status: 'ready' },
        (error, order) => {
          if (!error && order) {
            processService(order);
          }
        },
      );
    },
  );
});

module.exports = router;
