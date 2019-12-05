const { Router } = require('express');
const JWT = require('jsonwebtoken');
const passport = require('passport');
const formidable = require('formidable');
const Request = require('request');
const { v1 } = require('config');
const Querystring = require('querystring');
const Account = require('../../models/v1/account');
const Branch = require('../../models/v1/branch');
const router = Router();

/* eslint-disable no-underscore-dangle, camelcase */
router.post('/kit/login', (req, res) => {
  const { state } = req.body;
  const { appId, appSecret, meEndpointBaseUrl, tokenExchangeBaseUrl } = v1.FB;
  const appAccessToken = ['AA', appId, appSecret].join('|');
  const params = {
    grant_type: 'authorization_code',
    code: state.code,
    access_token: appAccessToken,
  };
  // exchange tokens
  const tokenExchangeUrl = `${tokenExchangeBaseUrl}?${Querystring.stringify(
    params,
  )}`;
  Request.get(
    { url: tokenExchangeUrl, json: true },
    (exErr, exResp, exRespBody) => {
      const { access_token /* , expires_at, id */ } = exRespBody;
      // const view = {
      //   user_access_token: access_token,
      //   expires_at,
      //   user_id: id,
      // };
      // get account details at /me endpoint
      const meEndpointUrl = `${meEndpointBaseUrl}?access_token=${access_token}`;
      Request.get({ url: meEndpointUrl, json: true }, (err, resp, respBody) => {
        const signUser = (uerr, user) => {
          if (uerr || !user) {
            res.json(401, uerr);
            return;
          }
          const newToken = JWT.sign(
            { userId: user._id },
            'merchant-secret' || access_token, // TODO: store access_token against user
            { expiresIn: '2 days' },
          );
          res.json({ token: newToken, user });
        };
        if (respBody.phone) {
          Account.findOne(
            {
              phone: `0${respBody.phone.national_number}`, // don't tell!
            },
            signUser,
          );
          // view.phone_num = respBody.phone.number;
        } else if (respBody.email) {
          Account.findOne({ email: respBody.email.address }, signUser);
          // view.email_addr = respBody.email.address;
        }
      });
    },
  );
});

router.post('/kit', (req, res) => {
  const { payload, loginMode, token } = req.body;
  const { RECAPTCHA } = v1;
  Request.post(
    {
      url: RECAPTCHA.verifyEndpoint,
      form: {
        response: token,
        secret: RECAPTCHA.secret,
      },
      json: true,
    },
    (err, resp, respBody) => {
      if (err) {
        res.json(401, err);
        return;
      }

      const { success, score } = respBody;
      if (!success || score < 0.5) {
        // TODO: reload recaptcha after each request
        // res.json(401, err);
        // return;
      }
      // TODO: check token with google
      if (loginMode === 'PHONE') {
        Account.findOne({ phone: payload.phoneNumber }, (error, user) => {
          if (error || !user) {
            res.json(401, error);
            return;
          }
          res.json(user);
        });
      } else {
        Account.findOne({ email: payload.emailAddress }, (error, user) => {
          if (error || !user) {
            res.json(401, error);
            return;
          }
          res.json(user);
        });
      }
    },
  );
});
router.post('/verify', (req, res) => {
  const { token } = req.body;
  JWT.verify(token, 'merchant-secret', (err, decoded) => {
    if (err) {
      res.json(401, err);
      return;
    }
    const newToken = JWT.sign({ userId: decoded.userId }, 'merchant-secret', {
      expiresIn: '2 days',
    });
    Account.findById(decoded.userId, (error, user) => {
      if (error) {
        res.json(401, error);
        return;
      }
      res.json({ token: newToken, user });
    });
  });
});

router.post('/register', (req, res) => {
  const form = new formidable.IncomingForm();
  req.on('aborted', () => {
    res.json(500, { error: 'Connection Aborted!' });
  });

  form.parse(req, (err, fields) => {
    const {
      username,
      password,
      dob,
      name,
      email,
      lga,
      state,
      phone,
      gender,
      bio,
      mode,
      googleAccessToken,
      facebookAccessToken,
    } = fields;

    Account.register(
      new Account({
        username,
        name,
        email,
        phone,
        gender,
        lga,
        state,
        dob,
        bio,
        mode,
        googleAccessToken,
        facebookAccessToken,
      }),
      password,
      (error, user) => {
        if (error) {
          res.json(500, error);
          return;
        }
        res.json({
          success: true,
          message: 'Registration Successful',
          user,
        });
      },
    );
  });
});

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    req.login(req.user, { session: false }, err => {
      if (err) {
        res.json(err);
        return;
      }
      const token = JWT.sign({ userId: req.user._id }, 'merchant-secret', {
        expiresIn: '2 days',
      });
      Branch.find({ agents: req.user._id }, (berr, branches) => {
        res.json({
          success: true,
          message: 'Login Successful',
          token,
          branches,
          user: req.user,
        });
      });
    });
  },
);

module.exports = router;
