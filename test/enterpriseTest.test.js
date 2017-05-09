var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp  = require('chai-http');
var server = 'http://localhost:3000';

//Opens the google chrome browser to test http requests
chai.use(chaiHttp);

//Correct enterprise model used for tests expecting 200 response
var correctEnterprise = {
  name: 'Corporação Koiba',
  cnpj: '8459527',
  occupationArea: "Childrens Card Game",
  adress: {
    number: 70677122,
    city: 'Domino',
    state: 'Anime',
    number: 202
  },
  owner: {
    firstName: 'Matheus',
    lastName: 'Juju',
    email: "matheus@gmail.com"
  }
}

//Incorrect enterprise model used for tests expecting 400 response
var incorrectEnterprise = {
  name: 'Corporação Kaiba',
  cnpj: '84595217',
  occupationArea: "Children's Card Game",
  adress: {
    number: 70675122,
    city: 'Domino City',
    state: 'Anime World',
    number: 201
  },
  owner: {
    firstName: 'Seto',
    lastName: 'Kaiba',
    email: "dragobranco@gmail.com",
    password: 'Yugiloser123'
  }
}

//Tests checking the enterprise models
describe('Enterprise Tests', function() {

  //Testing post http request used to register enterprise
  it('should register the enterprise', function(done){
    chai.request(server)
      .post('/api/enterprises/register-enterprise')
      .send(correctEnterprise)
      .end((err, res) => {
        console.log(res.body['status']);
        expect(res.body['status']).to.equal(200);
        done();
      });
  });

});
