var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp  = require('chai-http');
var server = 'http://localhost:3000';
var app = require('../server/server');

//Opens the google chrome browser to test http requests
chai.use(chaiHttp);

//User Profile used to populate the test database
const newUser = {
  firstName: 'Matheus',
  lastName: 'Juju',
  email: 'matheuss@gmail.com',
  password: 'Test1234'};

//Correct enterprise model used for tests expecting 200 response
const correctEnterprise = {
  name: 'Corporação Koiba',
  cnpj: '8459527',
  occupationArea: 'Childrens Card Game',
  adress: {
    number: 70677122,
    city: 'Domino',
    state: 'Anime',
    number: 202},
  owner: {
    firstName: 'Matheus',
    lastName: 'Juju',
    email: 'matheuss@gmail.com'}};

//Nonexistent enterprise model used for tests expecting 400 response
const incorrectEnterprise = {
  name: 'Corporação Kaiba',
  occupationArea: "Children's Card Game",
  adress: {
    number: 70675122,
    city: 'Domino City',
    state: 'Anime World',
    cnpj: '84595217',
    number: 201},
  owner: {
    firstName: 'Seto',
    lastName: 'Kaiba',
    email: 'dragobranco@gmail.com',
    password: 'Yugiloser123'}};

//Tests checking the enterprise models
describe('Enterprise Tests', function() {
  //Creating the user that will be the owner of the enterprises on the test database
  //before the each test begins
  before(function(done) {
    chai.request(server)
      .post('/api/UserProfiles/sign-up')
      .send(newUser)
      .end((err, res) => {
        done();
      });
  });

  //Deleting all the created objects by the tests on the database
  after(function(done) {
    chai.request(server)
      .post('/api/UserProfiles/delete-user')
      .send(newUser)
      .end((err, res) => {
        done();
      });
  });

  //Testing reponse provided by post http request used to register an enterprise
  it('should register an enterprise', function(done) {
    chai.request(server)
      .post('/api/enterprises/register-enterprise')
      .send(correctEnterprise)
      .end((err, res) => {
        expect(res.body['status']).to.equal(200);
        done();
      });
  });

  //Testing response provided by post http request used to register an enterprise
  it('should not register an enterprise', function(done) {
    chai.request(server)
    .post('/api/enterprises/register-enterprise')
    .send(incorrectEnterprise)
    .end((err, res) => {
      expect(res.body['status']).to.equal(400);
      done();
    });
  });

  //Testing response provided by post http request used to delete an enterprise
  it('should delete an enterprise', function(done) {
    chai.request(server)
      .post('/api/enterprises/delete-enterprise')
      .send(correctEnterprise)
      .end((err, res) => {
        expect(res.body['status']).to.equal(200);
        done();
      });
  });

  //Testing response provided by post http request used to delete an enterprise
  it('should not delete an enterprise', function(done) {
    chai.request(server)
      .post('/api/enterprises/delete-enterprise')
      .send(incorrectEnterprise)
      .end((err, res) => {
        expect(res.body['status']).to.equal(400);
        done();
      });
  });
});
