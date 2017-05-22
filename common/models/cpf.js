const validate = require('./validators.js');
const loopback = require('loopback');
const app = loopback();
const async = require ('async');
module.exports = function(Cpf) {

};

//This method just allows a insertion of an unique CPF.So, just one user could have that CPF number.
module.exports.insertNewCpf = function (newCpf, userEmail, callback){
    var cpfModel = loopback.getModel('Cpf');

    //Validate the unique of a CPF
    cpfModel.validatesUniquenessOf('cpf');

    var upsertQueue = async.queue(function(task, callback){
      const isCPFValid = validateCPF(newCpf);

        if(isCPFValid){
            newCpf.cpfUserEmail = userEmail
            cpfModel.findOrCreate({where: {'cpfUserEmail': userEmail}}, newCpf, function(err, cpfInstance, wasCreated){
              if(!err){
                if(!wasCreated){
                  cpfInstance.updateAttributes(newCpf, function(err, obj) {
                    if(!err){
                      callback(200, cpfInstance);
                    }else{
                      callback(400, null);
                    }
                  });
                }else{
                  callback(200, cpfInstance);
                }
              }else{
                callback(400, null);
              }
            });
          }else{
            callback(400, null);
          }
    });

    upsertQueue.push({name: 'cpf'}, function(err, resultObject) {
      callback(err, resultObject);
    });
}

//This method validate the properties of CPF number.
validateCPF = function(CPF){
  const cpfIsValid = cpfIsCorrect(CPF.cpf);
  return cpfIsValid;
}

//Check if the cpf number
cpfIsCorrect = function(cpf){
  console.log("CPF")
  if(validate.isNull(cpf)){
    console.log("is null")
    return false;
  }else{
    if(validate.isEmpty(cpf)){
      console.log("is empty")
      return false;
    }else{
      if(!validate.isNumeric(cpf)){
        console.log("is not numeric")
        console.log(cpf)
        return false;
      }else{
        if(!cpfIsValid(cpf)){
          console.log("Not a valid cpf")
          return false;
        }else{
          return true;
        }
      }
    }
  }
}

//Here is checked the veracity of the given CPF number.
cpfIsValid =  function(cpf){
    const firstDigitIsValid = validateFirstDigit(cpf);
    const secondDigitIsValid = validateSecondDigit(cpf);

    if(firstDigitIsValid && secondDigitIsValid){
      return true;
    }else{
      return false;
    }
}

//Based on cpf number check if the first verify digit is following the CPF pattern.
validateFirstDigit = function(cpf){
  const startValueOfHeights = 10;
  var sumOfValuesByHeight = 0;
  var restOfDivision = 0;
  var subtractionOfElevenAndValue = 0;

  sumOfValuesByHeight = multipleAndSumValuesByHeight(cpf, startValueOfHeights);
  restOfDivision = restOfDivisionByEleven(sumOfValuesByHeight);
  subtractionOfElevenAndValue = subtractElevenByValue(restOfDivision);

  const checkDigitResult = checkDigit(subtractionOfElevenAndValue, cpf[startValueOfHeights - 1]);

  if(checkDigitResult){
    return true;
  }
  else{
    return false;
  }
}

//Based on cpf number and the first digit check if the second verify digit is following the CPF pattern.
validateSecondDigit = function(cpf){
  const startValueOfHeights = 11;
  var sumOfValuesByHeight = 0;
  var restOfDivision = 0;
  var subtractionOfElevenAndValue = 0;

  sumOfValuesByHeight = multipleAndSumValuesByHeight(cpf, startValueOfHeights);
  restOfDivision = restOfDivisionByEleven(sumOfValuesByHeight);
  subtractionOfElevenAndValue = subtractElevenByValue(restOfDivision);

  const checkDigitResult = checkDigit(subtractionOfElevenAndValue, cpf[startValueOfHeights - 1]);

  if(checkDigitResult){
    return true;
  }
  else{
    return false;
  }
}

//The method takes a vector of numbers and multiple each value by his own position number (here know as height).
multipleAndSumValuesByHeight = function(cpf, startValueOfHeights){
  const limitLoopValue = startValueOfHeights - 1;
  var sumOfValue = 0;

  for(var count = 0, heightValue = startValueOfHeights; count < limitLoopValue; count++, heightValue--) {
    currentValue = parseInt(cpf[count]);
    sumOfValue += currentValue * heightValue;
  }

  return sumOfValue;
}

//Method to calculate the rest of a given value divided by eleven.
restOfDivisionByEleven = function(value){
  var restOfDivision = value % 11;

  return restOfDivision;
}

//Method to subtact a given value by eleven.
subtractElevenByValue = function(value){
  var result = 0;
  result = 11 - value;

  return result;
}

//Method to evalute if the calculate digit is equal to the given digit by user.
checkDigit = function(value, digit){
  const valueToCheckDigit = 9;
  const digitAsNumber = parseInt(digit);

  if(value > valueToCheckDigit){
    if(digitAsNumber === 0){
      return true;
    }else{
      return false;
    }
  }else{
    if(digitAsNumber === value){
      return true;
    }else{
      return false;
    }
  }
}
