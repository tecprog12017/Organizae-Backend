const validate = require('./validators.js');
const loopback = require('loopback');
const app = loopback();
const async = require ('async');

module.exports = function(Address) {

};

//This method just allows a insertion of an address to a single user.So, different users could have the same address.
module.exports.insertNewAddress = function(newAddress, userEmail, callback) {
  var addressModel = loopback.getModel('Address');

  //Validate a single address to a specific user.
  addressModel.validatesUniquenessOf('cep, city, state, neighbourhood, number, complement', {scopedTo: ['addressUserEmail']});

  var upsertQueue = async.queue(function(task, callback) {
    const isAddressValid = validateAddress(newAddress);

    if (isAddressValid) {
      newAddress.addressUserEmail = userEmail;
      addressModel.findOrCreate({where: {'addressUserEmail': userEmail}}, newAddress, function(err, addressInstance, wasCreated) {
        if (!err) {
          if (!wasCreated) {
            addressInstance.updateAttributes(newAddress, function(err, obj) {
              if (!err) {
                callback(200, addressInstance);
              } else {
                callback(400, null);
              }
            });
          } else {
            callback(200, addressInstance);
          }
        } else {
          callback(400, null);
        }
      });
    } else {
      callback(400, null);
    }
  });

  upsertQueue.push({name: 'address'}, function(err, resultObject) {
    callback(err, resultObject);
  });
};

//This method validate all single properties of address to return the real context of a given address.
validateAddress = function(Address) {
  const addressCepIsValid = validateAddressCEP(Address.cep);
  const addressCityIsValid = validateAddressCity(Address.city);
  const addressStateIsValid = validateAddressState(Address.state);
  const addressNumberIsValid = validateAddressNumber(Address.number);

  if (addressCepIsValid && addressCityIsValid && addressStateIsValid && addressNumberIsValid) {
    return true;
  } else {
    return false;
  }
};

//Check if given CEP attends correctly the properties the standard CEP.
validateAddressCEP = function(addressCep) {
  console.log('Address CEP');
  if (validate.isNull(addressCep)) {
    console.log('is null');
    return false;
  } else {
    const cep = addressCep.toString();
    if (validate.isEmpty(cep)) {
      console.log('is empty');
      return false;
    } else {
      if (!validate.isNumeric(addressCep)) {
        console.log('is not numeric');
        return false;
      } else {
        if (!checkSizeOfCEPCode(addressCep)) {
          console.log('is not at size ');
          return false;
        } else {
          return true;
        }
      }
    }
  }
};

//Check the given city name is really a correct name.
validateAddressCity = function(addressCity) {
  console.log('Address City');
  if (validate.isNull(addressCity)) {
    console.log('is null');
    return false;
  } else {
    if (validate.isEmpty(addressCity)) {
      console.log('is empty');
      return false;
    } else {
      if (!validate.isAlphabetic(addressCity)) {
        console.log('is not alphabetic');
        return false;
      } else {
        return true;
      }
    }
  }
};

//Check if the given state initial follows the pattern of the brazilian states initials.
validateAddressState = function(addressState) {
  console.log('Address State');
  if (validate.isNull(addressState)) {
    console.log('is null');
    return false;
  } else {
    if (validate.isEmpty(addressState)) {
      console.log('is empty');
      return false;
    } else {
      if (!validate.isAlphabetic(addressState)) {
        console.log('is not alphabetic');
        return false;
      } else {
        if (!checkSizeOfAddressStateCode(addressState)) {
          console.log('is not at the size ');
          return false;
        } else {
          return true;
        }
      }
    }
  }
};

//This method verify if the given house number is a number.
validateAddressNumber = function(addressNumber) {
  console.log('Address Number');
  if (validate.isNull(addressNumber)) {
    console.log('is null');
    return false;
  } else {
    const number = addressNumber.toString();
    if (validate.isEmpty(number)) {
      console.log('is empty');
      return false;
    } else {
      if (!validate.isNumeric(addressNumber)) {
        console.log('is not numeric');
        return false;
      } else {
        return true;
      }
    }
  }
};

//Validate if the size of CEP code follow the brazilian pattern of 8 numbers.
checkSizeOfCEPCode = function(value) {
  const sizeOfCEPCode = 8;
  value = value.toString();

  if (value.length == sizeOfCEPCode) {
    return true;
  } else {
    return false;
  }
};

//Check if the state initials respects the standard of two letters.
checkSizeOfAddressStateCode = function(value) {
  const sizeOfRgStateCode = 2;

  if (value.length == sizeOfRgStateCode) {
    return true;
  } else {
    return false;
  }
};
