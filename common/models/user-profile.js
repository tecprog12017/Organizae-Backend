const CryptoJS = require('crypto-js');
const secret = 'tecprog-2017/01';

module.exports = function(UserProfile) {
  UserProfile.validatesUniquenessOf('email');

  //Method used to register a user on the application
  UserProfile.signUp = function(user, callback) {
    //Regex used to validate the inputs of the user registration
    const emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

    //Used to cryptograph the password of the user, to ensure security
    if (passwordRegex.test(user.password)) {
      user.password = CryptoJS.AES.encrypt(user.password, secret);
    }

    //Used to store the user registration on the database
    if (emailRegex.test(user.email)) {
      UserProfile.upsert(user, function(err, obj) {
        if (err) {
          console.error(err);
        } else {
          console.log(obj);
        }
      });
    }

    callback(null, user);
  };

  //Used for the submition of sign up form for the user
  UserProfile.remoteMethod('signUp', {
    http: {path: '/sign-up', verb: 'post'},
    accepts: {arg: 'user', type: 'UserProfile',
              required: true, http: {source: 'body'}},
    returns: {arg: 'status', type: 'string'},
  });

  //Used to authenticate the user's access to the system
  UserProfile.login = function (user, callback) {

    UserProfile.findOne({where: {'email': user.email}}, function (err, obj){
      if (obj != null) {
        var password = CryptoJS.decrypt(obj.password.toString(), secret);
        if (user.password == password) {
          callback(null, '200');
        }
        else {
          callback(null, '400');
        }
      }
      else {
        callback(null, '400');
      }
    })
  }

  //Used for the submition of the access of the user on the system
  UserProfile.remoteMethod('logIn', {
    http: {path: '/login', verb: 'post'},
    accepts: {arg: 'user', type: 'UserProfile',
              required: true, http: {source: 'body'}},
    returns: {arg: 'status', type: 'string'}
  });

};
