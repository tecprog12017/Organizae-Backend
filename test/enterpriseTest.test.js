var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp  = require('chai-http');
var server = 'http://localhost:3000';

//Opens the google chrome browser to test http requests
chai.use(chaiHttp);

//Correct enterprise model used for tests expecting 200 response
var correctEnterprise = {
  name = "Corporação Kaiba"
  cnpj = "84595217";
  occupationArea = "Children's Card Game";
  adress = {
    number = 70675122;
    city = "Domino City";
    state = "Anime World";
    number = 201;
  }
  user = {
    firstName = "Seto";
    lastName = "Kaiba";
    email = "dragobranco@gmail.com";
    password = "Yugiloser123";
  }
}
