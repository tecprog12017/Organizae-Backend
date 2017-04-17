var expect = require('chai').expect;
var chai = require('chai');
var chaiHtpp  = require('chai-http');
var server = 'http://localhost:3000';

chai.use(chaiHtpp);

describe('Test Sign-up', function() {
  it('sign-up with sucess', function(done) {
    var user = {firstName: 'Hugo',
                lastName: 'Carvalho',
                email: 'jesus1320@hotmail.com',
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
