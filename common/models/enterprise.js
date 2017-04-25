'use strict';
//Importing references to all the other models
var app = require('../../server/server');

module.exports = function(Enterprise) {
  Enterprise.validatesUniquenessOf('cnpj');

  //Method used to register an enterprise on the database
  Enterprise.Register = function(enterprise, callback) {
    //Referencing User Profile model
    var UserProfile = app.models.UserProfile;

    //Used to ensure that the owner is registered on the system
    UserProfile.findOne({where: {'email': enterprise.owner}}, function(err, obj) {
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

};
