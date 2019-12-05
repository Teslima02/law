/**
 * @jest-environment node
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const Account = require('../../models/v1/account');
const fela = require('../../index');
chai.use(chaiHttp);

describe('Authentication', () => {
  beforeEach(done => {
    Account.deleteMany({}, () => {
      done();
    });
  });
  describe('/POST login', () => {
    it('it should login as unregistered user', done => {
      chai
        .request(fela)
        .post('/api/v1/auth/login')
        .send({
          username: 'put',
          password: '123',
        })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res.statusCode).toBe(401);
          done();
        });
    });
  });
});
