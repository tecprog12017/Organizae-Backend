'use strict';
const CryptoJS = require('crypto-js');
const secret = "tecprog-2017/01";

module.exports = function(UserProfile) {
  UserProfile.validatesUniquenessOf('email');

  //Method used to register a user on the application
  UserProfile.signUp = function (user, callback) {
    const emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

    if(passwordRegex.test(user.password)){
      user.password = CryptoJS.AES.encrypt(user.password, secret);
    }

    if (emailRegex.test(user.email)) {
      UserProfile.upsert(user, function(err, obj){
        if (err) {
          console.error(err);
        }
        else {
          console.log(obj);
        }
      })
    }

    callback(null, user);
  }

  //Used for submition of sign up form for the user
  UserProfile.remoteMethod('signUp', {
    http: {path: '/sign-up', verb: 'post'},
    accepts: {arg: 'user', type: 'UserProfile', required:true, http: {source: 'body'}},
    returns: {arg: 'status', type: 'string'}
  });

};
