const cryptoJS = require('crypto-js');
const secret = 'tecprog-2017/01';
const jwt = require('jwt-simple');
const async = require ('async');
const Rg = require('./rg.js');
const Cpf = require('./cpf.js');
const Address = require('./address.js');
const AdditionalInformation = require('./additionalInformation.js');
const Gender = require('./gender.js');

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
    } else {
      //Drops the server
      assert(false);
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
    UserProfile.findOne({where: {'email': user.email}}, function(err, obj) {
      if (user.email == obj.email) {
        var bytes = cryptoJS.AES.decrypt(obj.password.toString(), secret);
        var password = bytes.toString(cryptoJS.enc.Utf8);

        //Used to return a confirmation of sucessful access to the system
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

  //Used for the submission of the access of the user on the system
  UserProfile.remoteMethod('LogIn', {
    http: {path: '/login', verb: 'post'},
    accepts: {arg: 'user', type: 'Object',
              required: true, http: {source: 'body'}},
    returns: {root: true, type: 'Object'},
  });

  //Used to assign user personal data to it's profile
  UserProfile.addAdittionalInformation = function(user, callback) {
    UserProfile.findOne({where: {'email': user.email}}, function(err, instance) {
      UserProfile.insertInfos(user, instance, function(err, userProfile) {
        if (err == 200) {
          if (instance != null) {
            instance.updateAttributes(userProfile, function(err, obj) {
              if (!err) {
                instance.unsetAttribute('password');
                let token = jwt.encode(instance, secret);
                callback(null, token);
              } else {
                callback(null, '400');
              }
            });
          } else {
            callback(null, '400');
          }
        } else {
          console.error('some error ocurred');
        }
      });
    });
  };

  //This method handles the insertion of additional informations to the user profile.
  UserProfile.insertInfos = function(userNewData, userOldData, callback) {
    var resultErro = 200;
    var newUserProfile = new UserProfile();
    newUserProfile = userOldData;

    //This queue handles with the async of javascript and enables sequential calls.
    var insertInfosQueue = async.queue(function(task, callback) {
      task.insertFunction(task.newValue, task.userEmail, function(err, resultObject) {
        callback(err, resultObject);
      });
    });

    //Push the insertion of a new Rg to the queue
    insertInfosQueue.push({insertFunction: Rg.insertNewRg, newValue: userNewData.rg, userEmail: userOldData.email},
      function(err, resultObject) {
        if (err == 200) {
          newUserProfile.rg = resultObject;
        } else {
          resultErro = err;
        }
      });

    //Push the insertion of a new CPF to the queue
    insertInfosQueue.push({insertFunction: Cpf.insertNewCpf, newValue: userNewData.cpf, userEmail: userOldData.email},
      function(err, resultObject) {
        if (err == 200) {
          newUserProfile.cpf = resultObject;
        } else {
          resultErro = err;
        }
      });

    //Push the insertion of a new Address to the queue
    insertInfosQueue.push({insertFunction: Address.insertNewAddress, newValue: userNewData.address, userEmail: userOldData.email},
      function(err, resultObject) {
        if (err == 200) {
          newUserProfile.address = resultObject;
        } else {
          resultErro = err;
        }
      });

    //Push the insertion of a new Gender to the queue
    insertInfosQueue.push({insertFunction: Gender.insertNewGender, newValue: userNewData.gender, userEmail: userOldData.email},
      function(err, resultObject) {
        if (err == 200) {
          newUserProfile.gender = resultObject;
        } else {
          resultErro = err;
        }
      });

    //Push the insertion of the new additional Information to the queue
    insertInfosQueue.push({insertFunction: AdditionalInformation.insertNewAdditionalInfos, newValue: userNewData.information,
    userEmail: userOldData.email},
      function(err, resultObject) {
        if (err == 200) {
          newUserProfile.birthdate = resultObject.birthdate;
          newUserProfile.phoneNumber = resultObject.phone;
        } else {
          resultErro = err;
        }
        callback(resultErro, newUserProfile);
      });
  };

  //Used for the submition of the access of the user additional informations
  UserProfile.remoteMethod('addAdittionalInformation', {
    http: {path: '/update', verb: 'post'},
    accepts: {arg: 'user', type: 'UserProfile',
              required: true, http: {source: 'body'}},
    returns: {root: true, type: 'Object'},
  });

  //Used to delete user's account in the system
  UserProfile.DeleteUserProfile = function(user, callback) {
    UserProfile.findOne({where: {'email': user.email}}, function(err, foundUser) {
      //Returns a status that signals that the requisition was done sucessfully
      if (foundUser != null) {
        UserProfile.remove({'email': user.email});
        callback(null, 200);
      } else {
        //Returns a status that signals that there was an error found in the requisition
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
