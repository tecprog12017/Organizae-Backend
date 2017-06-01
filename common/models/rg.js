const validate = require('./validators.js');
const loopback = require('loopback');
const app = loopback();
const async = require ('async');

module.exports = function(Rg) {

};

//This method just allows a insertion of a rgNumber to a single user. One rgNumber could be in differents Expedition states.
//So, different users could have the same rgNumber but at different states.
module.exports.insertNewRg = function(newRg, userEmail, callback) {
  var rgModel = loopback.getModel('Rg');

  //Validate unique of rgNumber to each state.
  rgModel.validatesUniquenessOf('rgNumber', {scopedTo: ['rgExpeditionState']});

  var upsertQueue = async.queue(function(task, callback) {
    const isRgValid = validateRg(newRg);

    if (isRgValid) {
      newRg.rgUserEmail = userEmail;
      rgModel.findOrCreate({where: {'rgUserEmail': userEmail}}, newRg, function(err, rgInstance, wasCreated) {
        if (!err) {
          if (!wasCreated) {
            rgInstance.updateAttributes(newRg, function(err, obj) {
              if (!err) {
                callback(200, rgInstance);
              } else {
                callback(400, null);
              }
            });
          } else {
            callback(200, rgInstance);
          }
        } else {
          callback(400, null);
        }
      });
    } else {
      callback(400, null);
    }
  });

  upsertQueue.push({name: 'rg'}, function(err, resultObject) {
    callback(err, resultObject);
  });
};

//Check the entire rg and verify if follow the correctly the requirements.
validateRg = function(Rg) {
  const rgNumberIsValid = validateRgNumber(Rg.rgNumber);
  const rgExpeditionStateIsValid = validateRgExpeditionState(Rg.rgExpeditionState);

  if (rgNumberIsValid && rgExpeditionStateIsValid) {
    return true;
  } else {
    return false;
  }
};

//Check if rgNumber is corrected set and follow the properties requirements.
validateRgNumber = function(RgNumber) {
  console.log('Rg Number');
  if (validate.isNull(RgNumber)) {
    console.error('is null');
    return false;
  } else {
    if (validate.isEmpty(RgNumber)) {
      console.error('is empty');
      return false;
    } else {
      if (!validate.isNumeric(RgNumber)) {
        console.error('is not numeric');
        return false;
      } else {
        if (!checkMinimumSizeOfRgNumber(RgNumber)) {
          console.error('is not minimum size');
          return false;
        } else {
          return true;
        }
      }
    }
  }
};

//Check if RgExpeditionState is corrected set and follow the properties requirements.
validateRgExpeditionState = function(RgExpeditionState) {
  console.info('Rg Expedition State');
  if (validate.isNull(RgExpeditionState)) {
    console.error('is null');
    return false;
  } else {
    if (validate.isEmpty(RgExpeditionState)) {
      console.error('is empty');
      return false;
    } else {
      if (!validate.isAlphabetic(RgExpeditionState)) {
        console.error('is not alphabetic');
        return false;
      } else {
        if (!checkSizeOfRgStateCode(RgExpeditionState)) {
          console.error('is not at the size');
          return false;
        } else {
          return true;
        }
      }
    }
  }
};

//Verify if the rgNumber respects the minium size of five numbers.
checkMinimumSizeOfRgNumber = function(value) {
  const minimumSizeOfRgNumber = 5;

  if (value.length >= minimumSizeOfRgNumber) {
    return true;
  } else {
    return false;
  }
};

//Verify if the rgExpeditionState respects the state initials of two letters.
checkSizeOfRgStateCode = function(value) {
  const sizeOfRgStateCode = 2;

  if (value.length == sizeOfRgStateCode) {
    return true;
  } else {
    return false;
  }
};
