//Set of common methods for all validations

//Verify is the given value is null.
module.exports.isNull = function(value) {
  if (value === null) {
    return true;
  } else {
    return false;
  }
};

//Verify is the given value is empty.
module.exports.isEmpty = function(value) {
  if (!value.trim()) {
    return true;
  } else {
    return false;
  }
};

//Verify is the given value is only numeric.
module.exports.isNumeric = function(value) {
  const numberRegex = /^\d+$/;

  if (numberRegex.test(value)) {
    return true;
  } else {
    return false;
  }
};

//Verify is the given value is only alphabetic.
module.exports.isAlphabetic = function(value) {
  const alphabeticRegex = /^[A-z]+$/;

  if (alphabeticRegex.test(value)) {
    return true;
  } else {
    return false;
  }
};
