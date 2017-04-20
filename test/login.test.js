var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp  = require('chai-http');
var server = 'http://localhost:3000';
var UserProfile = require('../common/models/user-profile');

const mongoose = require('mongoose');

chai.use(chaiHttp);

var user = {firstName: 'Lucas',
            lastName: 'Oliveira',
            email: 'hugo@hotmail.com',
            password: 'Teste123'};

before(function(done) {
  mongoose.connect('mongodb://localhost/organizae');
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error'));
  db.once('open', function() {
    console.log('We are connected to test database!');
  });

  //Creates user in system's database by signing them up
  chai.request(server)
      .post('/api/UserProfiles/sign-up')
      .send(user)
      .end((err, res) => {
        expect(res.body['status']).to.equal(200);
      });

  done();
});

after(function(done) {
  mongoose.connection.db.dropDatabase(function() {
    mongoose.connection.close(done);
  });
});

describe('Test sign-in', function() {
  it('should sign-in with sucess', function(done) {
    var loginParams = {email: user['email'],
                      password: user['password']};
    chai.request(server)
        .post('/api/UserProfiles/login')
        .send(loginParams)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.body.token).to.not.be.a('null');
          done();
        });
  });
});
