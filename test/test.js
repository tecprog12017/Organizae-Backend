var expect = require('chai').expect;
var chai = require('chai');
var chaiHtpp  = require('chai-http');
var server = 'http://localhost:3000';

chai.use(chaiHtpp);

describe('First Test User', function() {
  describe('Test sign-up', function() {
    it('sign-up with sucess', function(done) {
      var user = {firstName: 'Hugo',
                  lastName: 'Carvalho',
                  email: 'hugonc@hotmail.com',
                  password: '123'};

      chai.request(server)
          .post('/api/UserProfiles/sign-up')
          .send(user)
          .end((err, res) => {
            expect(res.body['status']).to.equal(200);
            done();
          });
    });
  });
});
