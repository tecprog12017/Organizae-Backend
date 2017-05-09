var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp  = require('chai-http');
var server = 'http://localhost:3000';
var UserProfile = require('../common/models/user-profile');

chai.use(chaiHttp);

var user = {firstName: 'Jesus',
            lastName: 'Cristo',
            email: 'jesus123314@hotmail.com',
            password: 'Teste123'};

/*before(function(done) {
  //Creates user in system's database by signing them up
  chai.request(server)
      .post('/api/UserProfiles/sign-up')
      .send(user)
      .end((err, res) => {
        expect(res.body['status']).to.equal(200);
      });

  done();
});*/

/*describe('Test sign-in', function() {
  it('should sign-in with sucess', function(done) {
    var loginParams = {email: user['email'],
                      password: user['password']};
    chai.request(server)
        .post('/api/UserProfiles/login')
        .send(loginParams)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.body).to.not.be.empty;
          done();
        });
  });
});
*/
