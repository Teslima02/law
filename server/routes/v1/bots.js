const { Router } = require('express');
const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const Request = require('request');
const crypto = require('crypto');
const Querystring = require('querystring');
const randomInt = require('random-int');
const { v1 } = require('config');
const Dialog = require('../../models/v1/dialog');
const Payment = require('../../models/v1/payment');
const Business = require('../../models/v1/business');
const Session = require('../../models/v1/session');
const Order = require('../../models/v1/order');
const WalletSession = require('../../models/v1/wallet_session');
const foreignAuth = require('../../helpers/v1/foreign_auth');
// const whatsAppHelper = require('../../helpers/v1/whatsapp');
const processPayment = require('../../helpers/v1/processPayment');
const router = Router();

// router.post('/talk/whatsapp', whatsAppHelper);
router.post('/auth/phone', (req, res) => {
  const { pin } = req.body;
  // checkpin
  // new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
  Session.findOne({ pin }, (err, session) => {
    if (err || !session) {
      res.status(401).json({ message: 'Invalid Pin' });
      return;
    }
    // eslint-disable-next-line no-param-reassign
    session.expiresOn = new Date(new Date().getTime() + 60 * 60 * 24 * 1000); // 24 hrs
    session.save(err_ => {
      if (err_) {
        res.status(500).json({ message: 'Server Error, unable to save Pin' });
        return;
      }
      res.json({ session });
    });
  });
});

router.get('/auth/phone', (req, res) => {
  const { code, state } = req.query;
  const { appId, appSecret, meEndpointBaseUrl, tokenExchangeBaseUrl } = v1.FB;
  const appAccessToken = ['AA', appId, appSecret].join('|');
  const params = {
    grant_type: 'authorization_code',
    code,
    access_token: appAccessToken,
  };
  const tokenExchangeUrl = `${tokenExchangeBaseUrl}?${Querystring.stringify(
    params,
  )}`;
  Request.get(
    { url: tokenExchangeUrl, json: true },
    (exErr, exResp, exRespBody) => {
      // eslint-disable-next-line camelcase
      const { access_token /* , expires_at, id */, error } = exRespBody;
      // const view = {
      //   user_access_token: access_token,
      //   expires_at,
      //   user_id: id,
      // };
      // get account details at /me endpoint
      // eslint-disable-next-line camelcase
      if (error) {
        res.end('Authorization Expired!');
        return;
      }
      // eslint-disable-next-line camelcase
      const meEndpointUrl = `${meEndpointBaseUrl}?access_token=${access_token}`;
      Request.get({ url: meEndpointUrl, json: true }, (err, resp, respBody) => {
        // {"id":"280746672642568","phone":{"number":"+2348035387514","country_prefix":"234","national_number":"8035387514"},"application":{"id":"276149523048713"}}
        if (err || resp.statusCode !== 200) {
          res.end('Invalid Authentication, please try again.');
          return;
        }
        const session = new Session({
          phoneNumber: respBody.phone.national_number,
          name: state,
          sessionData: respBody,
          pin: randomInt(1000, 9999),
        });

        session.save(serr => {
          if (serr) {
            res.end('Invalid Authorization, please try again.');
            return;
          }
          res.end(`Your Fela Pin is: ${session.pin}.`);
        });

        // view.phone_num = respBody.phone.number;
      });
    },
  );
});

router.get('/browsers/user/unredeemed', (req, res) => {
  // TODO: get user info from cookie and query the database for unredeemed token
  res.json({ unredeemed: 1 });
});

router.get('/wallets/fela/auth/otp', (req, res) => {
  // https://backoffice.myfela.ng/api/v1/bots/wallets/fela/auth/otp?accessToken=044cbf10-3056-11e9-b3dd-3331f75c05b2&status=succeeded&statusCode=200&message=Authenticated%20successfully&userPhone=2348035387514&expires=1550148790942
  const { accessToken, statusCode, userPhone, expires } = req.query;
  const ws = new WalletSession({
    user: userPhone,
    statusCode,
    accessToken,
    expires,
  });
  ws.save(err => {
    if (err || ws.statusCode !== 200) {
      res.end('Authentication Failed');
      return;
    }
    res.end('Authentication Successful!');
  });
});

router.post(
  '/wallets/:type/:account/auth/:authmode',
  foreignAuth,
  (req, res) => {
    const { authmode, type, account } = req.params;
    if (type === 'fela') {
      const payload = { strategy: authmode, userPhone: account };
      const shasum = crypto.createHash('sha512');
      const signHash = shasum
        .update(`${JSON.stringify(payload)}${v1.ESPI.keys.private}`)
        .digest('hex');
      Request.post(
        {
          url: v1.ESPI.API.wallet.auth,
          headers: {
            Authorization: `Bearer ${v1.ESPI.keys.public}:${signHash}`,
          },
          body: payload,
          json: true,
        },
        (_err, _respBody, _resp) => {
          if (_err || _respBody.statusCode !== 200) {
            // update airtime sent
            res.status(500).json({
              message:
                "Sadly I'm unable to check your wallet status at the moment.",
            });
            return;
          }

          res.json({
            ..._resp.data,
            message: `Click the link below to complete your authentication.\n ${
              _resp.data.authURL
            }`,
          });
        },
      );
    }
  },
);

router.post('/wallets/:type/:account', foreignAuth, (req, res) => {
  if (req.params.type === 'fela') {
    const shasum = crypto.createHash('sha512');
    const signHash = shasum.update(`${v1.ESPI.keys.private}`).digest('hex');
    Request.get(
      {
        url: v1.ESPI.API.wallet.status.format(req.params.account),
        headers: {
          Authorization: `Bearer ${v1.ESPI.keys.public}:${signHash}`,
        },
        json: true,
      },
      (_err, _respBody, _resp) => {
        if (_err || _respBody.statusCode !== 200) {
          // update airtime sent

          res.status(500).json({
            message:
              "Sadly I'm unable to check your wallet status at the moment.",
          });
          return;
        }
        res.json(_resp);
      },
    );
  }
});

router.get('/dialogs/:businessId/:intent', foreignAuth, (req, res) => {
  const { businessId, intent } = req.params;
  Dialog.find(
    {
      business: mongoose.Types.ObjectId(businessId),
      businessType: intent.toLowerCase(),
    },
    {},
    {
      sort: {
        index: 1,
      },
    },
    (err, dialogs) => {
      if (err) {
        res.json(500, { message: 'server error!' });
        return;
      }
      res.json({
        sessionId: uuidv1(),
        dialogs,
        service: intent,
        endpointUrl: `/bots/checkout/${businessId}/${intent}`,
      });
    },
  );
});

router.post('/checkout/:intent', foreignAuth, (req, res) => {
  const { intent } = req.params;
  Business.findOne({ services: intent }, (err, business) => {
    if (err || !business) {
      console.log(err, intent);
      res
        .status(404)
        .json({ message: 'Sorry, this service is unavailable at the moment.' });
      return;
    }

    processPayment(business, intent, req.body)
      .then(re => res.json(re))
      .catch(e => {
        console.log(e);
        res.status(500).json({ message: e.getMessage() });
      });
  }); // end find business

  // TOD: get payment link from espi

  // Request.post(
  //   {
  //     url: v1.INS.API.airtime_winner,
  //     headers: { 'x-access-token': v1.INS.key },
  //     body: {
  //       data: [
  //         {
  //           ref: 'testRef374',
  //           phone: `234${number.slice(number.length - 10, number.length)}`,
  //           amount,
  //           // network: carrier,
  //         },
  //       ],
  //     },
  //     json: true,
  //   },
  //   (_err, _respBody, _resp) => {
  //     if (_err || _respBody.statusCode !== 201) {
  //       // update airtime sent
  //       res.json({
  //         message:
  //           "Sadly I'm unable to completely process your airtime request at the moment, please make a new request.",
  //       });
  //       return;
  //     }
  //     // update airtime not sent
  //     res.json({
  //       message: `You request has been placed, your airtime purchase s being processed .`,
  //       data: _resp.data,
  //     });
  //   },
  // );
});

module.exports = router;
