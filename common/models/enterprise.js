'use strict';
//Importing references to all the other models
var app = require('../../server/server');
var assert = require('assert');

module.exports = function(Enterprise) {
  Enterprise.validatesUniquenessOf('cnpj');

  //Method used to register an enterprise on the database
  Enterprise.Register = function(enterprise, callback) {
    //Used to check if the enterprise object was passed correctly from the client side
    if (enterprise != null) {
      //Does nothing
    }
    //Drops the server
    else{
      assert(false);
    }

    //Referencing User Profile model
    var UserProfile = app.models.UserProfile;

    //Used to ensure that the owner is registered on the system
    UserProfile.findOne({where: {'email': enterprise.owner.email}}, function(err, obj) {
      if (obj != null) {
        //Used to check the registration on the enterprise on the system
        Enterprise.upsert(enterprise, function(err, obj) {
          //Return Success if the enterprise is not registered on the system
          if (!err) {
            callback(null, 200);
          }
          //Return an error if the enterprise is already registered on the system
          else {
            callback(null, 400);
          }
        });
      }
      //Return an error if the user is not registered on the system
      else {
        callback(null, 400);
      }
    });
  };

  Enterprise.remoteMethod('Register', {
    http: {path: '/register-enterprise', verb: 'post'},
    accepts: {arg: 'enterprise', type: 'Object',
              required: true, http: {source: 'body'}},
    returns: {arg: 'status', type: 'string'}
  });

  Enterprise.Delete = function(enterprise, callback) {

    //Used to check if the enterprise object was passed correctly from the client side
    if (enterprise != null) {
      //Does nothing
    }
    //Drops the server
    else{
      assert(false);
    }

    //Finds the enterprise that will be deleted
    Enterprise.findOne({where: {'cnpj': enterprise.cnpj}}, function (err, foundEnterprise){
      //Runs normally
      if(foundEnterprise != null){
        Enterprise.remove({'cnpj': enterprise.cnpj}, function(err, obj){
          //Returns a status showing that the enterprise was deleted sucessfully
          if(!err) {
            callback(null, 200);
          }
          //Returns a status showing that there was an error occurred on the http request
          else {
            console.error(err);
            callback(null, 400);
          }
        });
      }
      //Returns a status showing that an error ocurred in the request
      else {
        callback(null, 400);
      }
    });
  };

  //Method used to list all enterprises that belong to an user
  Enterprise.Consult = function(user, callback) {
    Enterprise.find({where: {"owner": user}}, function(err, obj) {
      if (obj != null) {
        //There are enterprises registered to logged user
        callback(null, obj);
      }
      else {
        callback(null, 400);
      }
    });
  };

  Enterprise.remoteMethod('Consult', {
    http: {path: '/consult-enterprises', verb: 'get'},
    accepts: {arg: 'user', type: 'string',
              required: true},
    returns: {arg: 'query', type: 'Object'}
  });

  Enterprise.remoteMethod('Delete', {
    http: {path: '/delete-enterprise', verb: 'post'},
    accepts: {arg: 'enterprise', type: 'Object',
              required: true, http: {source: 'body'}},
    returns: {arg: 'status', type: 'string'}
  });

};
