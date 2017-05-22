const validate = require('./validators.js');
const loopback = require('loopback');
const app = loopback();
const async = require ('async');

//This method do not insert the additional information direct to a single model,
//but it provides validations and the additional informations for the new user profile.
module.exports.insertNewAdditionalInfos = function(newAdditionalInfos, userEmail, callback){
  var userProfileModel = loopback.getModel('UserProfile');

  var upsertQueue = async.queue(function(task, callback){
    const isAdditionalInfosValid = validateAdditionalInfos(newAdditionalInfos);

    if(isAdditionalInfosValid){
      callback(200, newAdditionalInfos)
    }else{
      callback(400, null);
    }
  });

  upsertQueue.push({name: 'additionalInformation'}, function(err, resultObject) {
    callback(err, resultObject);
  });
}

//Validate the additionals informations as a whole.
validateAdditionalInfos = function(additionalInformation){
    const birthdateIsValid = validateBirthdate(additionalInformation.birthdate);
    const phoneNumberIsValid = validatePhoneNumber(additionalInformation.phone);

    if(birthdateIsValid && phoneNumberIsValid){
      return true;
    }else{
      return false;
    }

}

//Validates if birthdate trails correctly the properties.
validateBirthdate = function(birthdate){
  console.log("Birthdate")
  if(validate.isNull(birthdate)){
    console.log("is null")
    return false;
  }else{
    if(validate.isEmpty(birthdate)){
      console.log("is empty")
      return false;
    }else{
      if(birthdateIsAfterToday(birthdate)){
        console.log("the birthdate greater than today")
        return false;
      }else{
        if(birthdateIsTooBig(birthdate)){
          console.log("you are the oldest man in the world")
          return false;
        }else{
          return true;
        }
      }
    }
  }
}

//Check if phone number adopt correctly the properties.
validatePhoneNumber = function(phoneNumber){
  console.log("Phone Number")
  if(validate.isNull(phoneNumber)){
    console.log("is null")
    return false;
  }else{
    if(validate.isEmpty(phoneNumber)){
      console.log("is empty")
      return false;
    }else{
      if(!validate.isNumeric(phoneNumber)){
        console.log("the phone number is not numeric")
        return false;
      }else{
        return true;
      }
    }
  }
}

//Verify if the birthdate is bigger than today.
birthdateIsAfterToday = function (birthdate){
  const currentDate = new Date();
  const localBirthDate = new Date(birthdate);

  if(localBirthDate > currentDate){
    return true;
  }else {
    return false;
  }
}

//Check if the age set by user is bigger than 150 years.
birthdateIsTooBig = function (birthdate){
  const currentDate = new Date();
  const localBirthDate = new Date(birthdate);
  const limitAge = 150;
  const age = currentDate.getFullYear() - localBirthDate.getFullYear();

  if(age >= limitAge){
    return true;
  }else{
    return false;
  }
}
