/* eslint-disable no-unused-vars */
// eslint-disable-next-line func-names
const { v1 } = require('config');
const Request = require('request');
const crypto = require('crypto');
const Querystring = require('querystring');
module.exports = function(order) {
  const provider = global[`${order.businessKey}${order.service}`];
  if (typeof provider === 'function') {
    provider(order);
  } else {
    console.log(`Unable to fulfil ${provider}`);
  }
};

function giftCashToken(order) {
  const shasum = crypto.createHash('sha512');
  const signHash = shasum
    .update(`${JSON.stringify(order.data)}${v1.CSH.keys.private}`)
    .digest('hex');
  Request.post(
    {
      //   url: v1.CSH.API,
      headers: { Authorization: `Bearer ${v1.CSH.keys.public}${signHash}` },
      body: {},
    },
    (_err, _respBody, _resp) => {
      if (_err || _respBody.statusCode !== 200) {
        // update airtime sent
        return;
      }
      giftCashToken(order);
    },
  );
}

function FBLairtime(order) {
  const { data } = order;
  Request.post(
    {
      url: v1.INS.API.airtime_winner,
      headers: { 'x-access-token': v1.INS.key },
      body: {
        data: [
          {
            ref: order.id,
            phone: `234${data.number.slice(
              data.number.length - 10,
              data.number.length,
            )}`,
            amount: data.amount,
            // network: carrier,
          },
        ],
      },
      json: true,
    },
    (_err, _respBody, _resp) => {
      if (!_err || _respBody.statusCode === 200) {
        // update airtime sent
        console.log(_resp);
        // eslint-disable-next-line no-param-reassign
        order.status = 'shipped';
        order.save(() => {
          giftCashToken(order);
        });
      }
    },
  );
}

function FBLbuycashtoken(order) {
  // send order is to peter as refId
  const shasum = crypto.createHash('sha512');
  const signHash = shasum
    .update(`${JSON.stringify(order.data)}${v1.CSH.keys.private}`)
    .digest('hex');
  Request.post(
    {
      //   url: v1.CSH.API,
      headers: { Authorization: `Bearer ${v1.CSH.keys.public}${signHash}` },
      body: {},
    },
    (_err, _respBody, _resp) => {
      if (_err || _respBody.statusCode !== 200) {
        // update airtime sent
        return;
      }
      giftCashToken(order);
    },
  );
}
function FBLgiftcashtoken(order) {
  const shasum = crypto.createHash('sha512');
  const signHash = shasum
    .update(`${JSON.stringify(order.data)}${v1.CSH.keys.private}`)
    .digest('hex');
  Request.post(
    {
      //   url: v1.CSH.API,
      headers: { Authorization: `Bearer ${v1.CSH.keys.public}${signHash}` },
      body: {},
    },
    (_err, _respBody, _resp) => {
      if (_err || _respBody.statusCode !== 200) {
        // update airtime sent
        return;
      }
      giftCashToken(order);
    },
  );
}
function FBLredeemcashtoken(order) {
  const shasum = crypto.createHash('sha512');
  const signHash = shasum
    .update(`${JSON.stringify(order.data)}${v1.CSH.keys.private}`)
    .digest('hex');
  Request.post(
    {
      //   url: v1.CSH.API,
      headers: { Authorization: `Bearer ${v1.CSH.keys.public}${signHash}` },
      body: {},
    },
    (_err, _respBody, _resp) => {
      if (_err || _respBody.statusCode !== 200) {
        // update airtime sent
        return;
      }
      giftCashToken(order);
    },
  );
}
