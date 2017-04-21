var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp  = require('chai-http');
var server = 'http://localhost:3000';
var UserProfile = require('../common/models/user-profile');
var Schema = require('mongoose').Schema;

const mongoose = require('mongoose');

chai.use(chaiHttp);

var user = {firstName: 'Jesus',
            lastName: 'Cristo',
            email: 'jesuscristo@gmail.com',
            password: 'Teste123'};

var userProfileSchema = new Schema({email: 'string'});

var userProfile = mongoose.model('UserProfile', userProfileSchema);

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

describe('Test delete', function() {
  it('should delete account with sucess', function(done) {
    //var query = UserProfile.where({email: user.email});
    chai.request(server)
        .post('/api/UserProfiles/delete')
        .send(user)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res).to.have.status(200);
          expect(res.body.token).to.not.exist;

          userProfile.findOne({where: {'email': user.email}}, function(err, userProfile) {
            expect(userProfile).to.not.exist;
            expect(err).to.exist;
          });
          done();
        });
  });
});
