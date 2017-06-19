var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp  = require('chai-http');
var server = 'http://localhost:3000';
var UserProfile = require('../common/models/user-profile');

chai.use(chaiHttp);

var user = {firstName: 'Lucas',
            lastName: 'Oliveira',
            email: 'hugo@hotmail.com',
            password: 'Teste123'};

before(function(done) {
  //Creates user in system's database by signing them up
  chai.request(server)
      .post('/api/UserProfiles/sign-up')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
      });

  done();
});

after(function(done) {
  chai.request(server)
    .post('/api/UserProfiles/delete-user')
    .send(user)
    .end((err, res) => {
      done();
    });
});

describe('Test sign-in', function() {
  // test with user sign-up and all fields correct
  it('should sign-in', function(done) {
    var loginParams = {email: user['email'],
                      password: user['password']};
    chai.request(server)
        .post('/api/UserProfiles/login')
        .send(loginParams)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.token).to.not.be.a('null');
          done();
        });
  });

  it('user is not sign-up', function(done) {
    var loginParams = {email: 'test@test.com',
                      password: 'Test456'};

    chai.request(server)
        .post('/api/UserProfiles/login')
        .send(loginParams)
        .end((err, res) => {
          expect(res.body.token).to.be.a('undefined');
          done();
        });
  });

  it('password is not correct', function(done) {
    var loginParams = {email: user['email'],
                      password: 'Test4567'};

    chai.request(server)
        .post('/api/UserProfiles/login')
        .send(loginParams)
        .end((err, res) => {
          expect(res.body.token).to.be.a('undefined');
          done();
        });
  });
});
