const validate = require('./validators.js');
const loopback = require('loopback');
const app = loopback();
const async = require ('async');

module.exports = function(Gender) {

};

//This method make insertion of the gender information to a user.
module.exports.insertNewGender = function(newGender, userEmail, callback){
  var genderModel = loopback.getModel('Gender');

  //Validate a single gender information to each user.
  genderModel.validatesUniquenessOf('genderIdentity, pronoun', { scopedTo: ['genderUserEmail'] });

  var upsertQueue = async.queue(function(task, callback){
    const isGenderValid = validateGender(newGender);

    if(isGenderValid){
      newGender.genderUserEmail = userEmail
      genderModel.findOrCreate({where: {'genderUserEmail': userEmail}}, newGender, function(err, genderInstance, wasCreated){
        if(!err){
          if(!wasCreated){
            genderInstance.updateAttributes(newGender, function(err, obj) {
              if(!err){
                callback(200, genderInstance);
              }else{
                callback(400, null);
              }
            });
          }else{
            callback(200, genderInstance);
          }
        }else{
          callback(400, null);
        }
      });
    }else{
      callback(400, null);
    }
  });

  upsertQueue.push({name: 'gender'}, function(err, resultObject) {
    callback(err, resultObject);
  });
}

//Check if the properties of gender are valid.
validateGender = function(Gender){
  if(Gender.genderIdentity != undefined){
    const genderIdentityIsValid = validateGenderIdentity(Gender.genderIdentity)
    const pronounIsValid = validatePronoun(Gender.pronoun)

    if(genderIdentityIsValid && pronounIsValid){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}

//Check if the gender identity was corrected set by user.
validateGenderIdentity = function(genderIdentity){
  console.log("Gender Identity")
  if(validate.isNull(genderIdentity)){
    console.log("is null");
    return false;
  }else{
    if(validate.isEmpty(genderIdentity)){
      console.log("is empty");
      return false;
    }else{
      if(!validate.isAlphabetic(genderIdentity)){
        console.log("is not alphabetic");
        return false;
      }else{
          return true;
      }
    }
  }
}

//Check if the pronoun was corrected set by user.
validatePronoun = function(pronoun){
  console.log("Pronoun")
  if(validate.isNull(pronoun)){
    console.log("is null");
    return false;
  }else{
    if(validate.isEmpty(pronoun)){
      console.log("is empty");
      return false;
    }else{
      if(!validate.isAlphabetic(pronoun)){
        console.log("is not alphabetic");
        return false;
      }else{
          return true;
      }
    }
  }
}
