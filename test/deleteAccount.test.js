var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp  = require('chai-http');
var server = 'http://localhost:3000';
var UserProfile = require('../common/models/user-profile');
var Schema = require('mongoose').Schema;

const mongoose = require('mongoose');

chai.use(chaiHttp);

// Creates user to be registered
var user = {firstName: 'Jesus',
            lastName: 'Cristo',
            email: 'jesuscristo@gmail.com',
            password: 'Teste123'};

// Creates Schema to be queried on database
var userProfileSchema = new Schema({email: 'string'});

// Creates model based on schema to be queried on database
var userProfile = mongoose.model('UserProfile', userProfileSchema);

before(function(done) {
  // Connects to database
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
  // Deletes the test's database
  mongoose.connection.db.dropDatabase(function() {
    mongoose.connection.close(done);
  });
});

describe('Test delete', function() {
  it('should delete account with sucess', function(done) {
    //Sends request to delete user's account
    chai.request(server)
        .post('/api/UserProfiles/delete')
        .send(user)
        .end((err, res) => {
          expect(err).to.not.exist;
          console.log(res.body.status);
          expect(res.body.status).to.equal(200);

          expect(res.body.token).to.not.exist;

          // Checks whether or not the user was deleted
          userProfile.findOne({where: {'email': user.email}}, function(err, userProfile) {
            expect(userProfile).to.not.exist;
            expect(err).to.exist;
          });

          done();
        });
  });

  it('should try to delete account that does not exist and get an error', function(done) {
    // Creates a fake user who's not registered in the system
    var fakeUser = {firstName: 'Fake',
                lastName: 'User',
                email: 'fakeuser@gmail.com',
                password: 'Teste123'};

    // Sends request to try to delete unregistered user
    chai.request(server)
        .post('/api/UserProfiles/delete')
        .send(fakeUser)
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.body.status).to.equal(400);
          expect(res.body.token).to.not.exist;

          // Confirms that unregistered user is not in the database
          userProfile.findOne({where: {'email': user.email}}, function(err, userProfile) {
            expect(userProfile).to.not.exist;
            expect(err).to.exist;
          });

          done();
        });
  });
});
