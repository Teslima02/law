/* eslint-disable func-names */
const Request = require('request');
const crypto = require('crypto');
// const Querystring = require('querystring');
const { v1 } = require('config');
const randomInt = require('random-int');
const uuidv1 = require('uuid/v1');
const Payment = require('../../models/v1/payment');
const Order = require('../../models/v1/order');
// eslint-disable-next-line no-var
var PAYMENTS = {};
module.exports = function(business, service, data) {
  return new Promise((resolve, reject) => {
    try {
      const Company = PAYMENTS[business.helperKey];
      if (typeof Company === 'function') {
        const instance = new Company();
        instance[service](business, service, data)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error('Service is not available at the moment'));
        console.log(`Unable to fulfil ${service}`, typeof company);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const makePayment = (payment, business, data, service) =>
  new Promise((resolve, reject) => {
    const payload = {
      customerPhone: payment.user,
      amount: payment.amount,
      method: payment.method,
      paymentRef: payment.txnRef,
      email: `${payment.user}@myfela.ng`,
    };
    const shasum = crypto.createHash('sha512');
    const signHash = shasum
      .update(`${JSON.stringify(payload)}${v1.ESPI.keys.private}`)
      .digest('hex');

    Request.post(
      {
        url: v1.ESPI.API.payment.pay,
        headers: {
          Authorization: `Bearer ${v1.ESPI.keys.public}:${signHash}`,
        },
        body: payload,
        json: true,
      },
      (_err, _respBody, _resp) => {
        if (_err || _respBody.statusCode !== 200) {
          // update airtime sent
          console.log(_err, _resp);
          reject(
            new Error(
              "Sadly I'm unable to completely process your airtime request at the moment, please make a new request.",
            ),
          );
          return;
        }
        // const { /* status, message, */ data } = _resp;
        // eslint-disable-next-line no-param-reassign
        payment.data = _resp.data;
        // eslint-disable-next-line no-param-reassign
        payment.status = 'sent';
        payment.save(errs => {
          if (errs) {
            reject(
              new Error(
                "Sadly I'm unable to completely process your airtime request at the moment, please make a new request.",
              ),
            );
            return;
          }
          Order.create({
            // eslint-disable-next-line no-underscore-dangle
            payment: payment._id,
            status: 'pending',
            orderId: randomInt(100000000, 999999999),
            user: payment.user,
            total: parseFloat(payment.amount),
            // eslint-disable-next-line no-underscore-dangle
            business: business._id,
            businessKey: business.helperKey,
            service,
            data,
          })
            .then(() => {
              switch (payment.method) {
                case 'online':
                  resolve({
                    message: `Please use this link to make payment: ${
                      payment.data.paymentToken
                    }`,
                    data: _resp.data,
                    payment,
                  });
                  break;
                case 'ussd':
                  resolve({
                    message: `Please dial this USSD on your to make payment: ${
                      payment.data.paymentToken
                    }`,
                    data: _resp.data,
                    payment,
                  });
                  break;
                default:
                  console.log('Invalid Method');
              }
            })
            .catch(() => {
              reject(new Error('unable to create order, please try again.'));
            });
        });
      },
    );
  });

// eslint-disable-next-line vars-on-top
PAYMENTS.FBL = function() {
  this.request = (url, payload) =>
    new Promise((resolve, reject) => {
      const shasum = crypto.createHash('sha512');
      const signHash = shasum
        .update(
          `${payload ? JSON.stringify(payload) : ''}${v1.CSH.keys.private}`,
        )
        .digest('hex');

      Request.post(
        {
          url,
          headers: {
            Authorization: `Bearer ${v1.CSH.keys.public} ${signHash}`,
          },
          json: true,
        },
        (_err, _respBody, _resp) => {
          if (_err || _respBody.statusCode !== 200) {
            reject(_err);
            return;
          }
          const { data } = _resp;
          resolve(data);
        },
      );
    });

  this.getCashTokenPrice = () =>
    new Promise((resolve, reject) =>
      this.request(v1.CSH.API.unitCost)
        .then(data => resolve(data.costPerToken.value))
        .catch(reject),
    );

  this.buycashtoken = (business, service, Data) =>
    new Promise((resolve, reject) =>
      this.getCashTokenPrice()
        .then(price => {
          const { data, channel } = Data;
          const amount = price * data.qty;
          const phoneNumber = `234${data.phone.slice(
            data.phone.length - 10,
            data.phone.length,
          )}`;
          const payment = new Payment({
            txnRef: uuidv1(),
            // eslint-disable-next-line no-underscore-dangle
            business: business._id,
            status: 'initial',
            amount,
            user: phoneNumber,
            channel,
            method: data.method || 'online',
            intent: service,
          });
          makePayment(payment, business, data, service)
            .then(resolve)
            .catch(reject);
        })
        .catch(reject),
    );

  this.redeemcashtokenwins = (business, service, Data) =>
    new Promise((resolve, reject) => {
      this.request(v1.CSH.API.unitCost)
        .then(data => resolve(data.costPerToken.value))
        .catch(reject);
    });

  this.airtime = (business, service, Data) =>
    new Promise((resolve, reject) => {
      const { channel, data } = Data;
      const { /* carrier, */ amount, number, method } = data;
      const phoneNumber = `234${number.slice(
        number.length - 10,
        number.length,
      )}`;

      // TODO: business sub account
      // * ESPI will generate payment ref
      const payment = new Payment({
        txnRef: uuidv1(),
        // eslint-disable-next-line no-underscore-dangle
        business: business._id,
        status: 'initial',
        amount,
        user: phoneNumber,
        channel,
        method,
        intent: service,
      });
      const payload = {
        customerPhone: payment.user,
        amount: payment.amount,
        method: payment.method,
        paymentRef: payment.txnRef,
        email: `${payment.user}@myfela.ng`,
        // network: carrier,
      };
      const shasum = crypto.createHash('sha512');
      const signHash = shasum
        .update(`${JSON.stringify(payload)}${v1.ESPI.keys.private}`)
        .digest('hex');
      Request.post(
        {
          url: v1.ESPI.API.payment.pay,
          headers: {
            Authorization: `Bearer ${v1.ESPI.keys.public}:${signHash}`,
          },
          body: payload,
          json: true,
        },
        (_err, _respBody, _resp) => {
          if (_err || _respBody.statusCode !== 200) {
            // update airtime sent
            console.log(_err, _resp);
            reject(
              new Error(
                "Sadly I'm unable to completely process your airtime request at the moment, please make a new request.",
              ),
            );
            return;
          }
          // const { /* status, message, */ data } = _resp;
          payment.data = _resp.data;
          payment.status = 'sent';
          payment.save(errs => {
            if (errs) {
              reject(
                new Error(
                  "Sadly I'm unable to completely process your airtime request at the moment, please make a new request.",
                ),
              );
              return;
            }

            Order.create({
              // eslint-disable-next-line no-underscore-dangle
              payment: payment._id,
              status: 'pending',
              orderId: randomInt(100000000, 999999999),
              user: phoneNumber,
              total: parseFloat(amount),
              // eslint-disable-next-line no-underscore-dangle
              business: business._id,
              businessKey: business.helperKey,
              service,
              data,
            })
              .then(() => {
                switch (payment.method) {
                  case 'online':
                    resolve({
                      message: `Please use this link to make payment: ${
                        payment.data.paymentToken
                      }`,
                      data: _resp.data,
                      payment,
                    });
                    break;
                  case 'ussd':
                    resolve({
                      message: `Please dial this USSD on your to make payment: ${
                        payment.data.paymentToken
                      }`,
                      data: _resp.data,
                      payment,
                    });
                    break;
                  default:
                    console.log('Invalid Method');
                }
              })
              .catch(() => {
                reject(new Error('unable to create order, please try again.'));
              });
          });
        },
      );
    });
};
