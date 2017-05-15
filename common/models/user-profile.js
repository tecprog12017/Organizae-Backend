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

  //Used for the submission of sign up form for the user
  UserProfile.remoteMethod('SignUp', {
    http: {path: '/sign-up', verb: 'post'},
    accepts: {arg: 'user', type: 'UserProfile',
              required: true, http: {source: 'body'}},
    returns: {arg: 'status', type: 'string'},
  });

  //Used to authenticate the user's access to the system
  UserProfile.LogIn = function(user, callback) {
    UserProfile.findOne({where: {'email': user.email}}, function(err, foundUser) {
      //Checks if found user exists
      if (foundUser != undefined && foundUser != null){
        //Checks if user's email is the same as the one the found one's email
        if (user.email == foundUser.email) {
          var bytes = cryptoJS.AES.decrypt(foundUser.password.toString(), secret);
          var password = bytes.toString(cryptoJS.enc.Utf8);
          //Used to return a confirmation of sucessful access to the system
          if (user.password == password) {
            obj.unsetAttribute('password');
            let token = jwt.encode(foundUser, secret);
            callback(null, token);
          }
          //If user's password is different than the found user's one return error
          else {
            callback(null, 400);
          }
        }
        //If user's email is different than the found user's one return error
        else {
          callback(null, 400);
        }
    }
    //If found user is undefined, ie it could not be found, return error
    else {
      callback(null, 400);
    }
  });
};

  //Used for the submission of the access of the user on the system
  UserProfile.remoteMethod('LogIn', {
    http: {path: '/login', verb: 'post'},
    accepts: {arg: 'user', type: 'Object',
              required: true, http: {source: 'body'}},
    returns: [
              {arg: 'status', type: 'string'},
              {root: true, type: 'Object'},
             ],
  });

  //Used to delete user's account in the system
  UserProfile.DeleteUserProfile = function(user, callback) {
    UserProfile.findOne({where: {'email': user.email}}, function(err, foundUser) {
      //Returns a status that signals that the requisition was done sucessfully
      if (foundUser != null) {
        UserProfile.remove({'email': user.email});
        callback(null, 200);
      }
      //Returns a status that signals that there was an error found in the requisition
      else {
        callback(null, 400);
      }
    });
  };

  //Used for the submission of user's account deletion request on the system
  UserProfile.remoteMethod('DeleteUserProfile', {
    http: {path: '/delete-user', verb: 'post'},
    accepts: {arg: 'user', type: 'UserProfile',
              required: true, http: {source: 'body'}},
    returns: {arg: 'status', type: 'string'},
  });
};
