"use strict";

const cryptoJS = require('crypto-js');
const secret = 'tecprog-2017/01';
const jwt = require('jwt-simple');

module.exports = function(UserProfile) {
  UserProfile.validatesUniquenessOf('email');

  //Method used to register a user on the application
  UserProfile.SignUp = function(user, callback) {
    //Regex used to validate the inputs of the user registration
    const emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

    //Used to cryptograph the password of the user, to ensure security
    if (passwordRegex.test(user.password)) {
      user.password = cryptoJS.AES.encrypt(user.password, secret);
    }

    //Used to store the user registration on the database
    if (emailRegex.test(user.email)) {
      UserProfile.upsert(user, function(err, obj) {
        if (!err) {
          callback(null, 200);
        } else {
          callback(null, 400);
        }
      });
    }
  };

  //Used for the submition of sign up form for the user
  UserProfile.remoteMethod('SignUp', {
    http: {path: '/sign-up', verb: 'post'},
    accepts: {arg: 'user', type: 'UserProfile',
              required: true, http: {source: 'body'}},
    returns: {arg: 'status', type: 'string'},
  });

  //Used to authenticate the user's access to the system
  UserProfile.LogIn = function(user, callback) {
    UserProfile.findOne({where: {'email': user.email}}, function(err, obj) {
      if (obj != null) {
        var bytes = cryptoJS.AES.decrypt(obj.password.toString(), secret);
        var password = bytes.toString(cryptoJS.enc.Utf8);

        if (user.password == password) {
          obj.unsetAttribute('password');
          let token = jwt.encode(obj, secret);
          callback(null, token);
        } else {
          callback(null, '400');
        }
      } else {
        callback(null, '400');
      }
    });
  };

  //Used for the submition of the access of the user on the system
  UserProfile.remoteMethod('LogIn', {
    http: {path: '/login', verb: 'post'},
    accepts: {arg: 'user', type: 'Object',
              required: true, http: {source: 'body'}},
    returns: {root: true, type: 'Object'},
  });
};
