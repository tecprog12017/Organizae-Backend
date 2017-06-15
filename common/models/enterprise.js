//Importing references to all the other models
var app = require('../../server/server');
var assert = require('assert');
var consts = require('./constants.js');

module.exports = function(Enterprise) {
  Enterprise.validatesUniquenessOf('cnpj');

  //Method used to register an enterprise on the database
  Enterprise.Register = function(enterprise, callback) {
    //Used to check if the enterprise object was passed correctly from the client side
    if (enterprise != null) {
      //Does nothing
    } else {
      //Drops the server
      assert(false);
    };

    //Referencing User Profile model
    var UserProfile = app.models.UserProfile;

    //Used to ensure that the owner is registered on the system
    UserProfile.findOne({where: {'email': enterprise.owner.email}}, function(err, obj) {
      if (obj != null) {
        //Used to check the registration on the enterprise on the system
        delete enterprise.oldCnpj;
        Enterprise.upsert(enterprise, function(err, obj) {
          //Return Success if the enterprise is not registered on the system
          if (!err) {
            callback(null, 200);
          } else {
            //Return an error if the enterprise is already registered on the system
            callback(null, 400);
          }
        });
      } else {
        //Return an error if the user is not registered on the system
        callback(null, 400);
      }
    });
  };

  Enterprise.remoteMethod('Register', {
    http: {path: '/register-enterprise', verb: 'post'},
    accepts: {arg: 'enterprise', type: 'Object',
              required: true, http: {source: 'body'}},
    returns: {arg: 'status', type: 'string'}});

  Enterprise.Edit = function(editedEnterprise, callback) {
    //Checks if the method can run with the passed object and drops otherwise
    if (editedEnterprise != null) {
      //Does nothing
    } else {
      //Runs normally
      assert(false);
    }

    Enterprise.findOne({where: {'cnpj': editedEnterprise.oldCnpj}}, function(err, obj) {
      //Runs normally if the enteprise is found
      if (obj != null) {
        delete editedEnterprise.oldCnpj;
        delete editedEnterprise.confirmationPassword;
        //Upserts the found object on the database with new information
        Enterprise.update({'cnpj': obj.cnpj}, editedEnterprise, function(err, response) {
          //Returns a successfull status to the user
          if (!err) {
            callback(null, 200);
          } else {
            //Returns an error status to the user
            callback(null, 400);
          }
        });
      } else {
        //Returns an error status to the user
        callback(null, 400);
      }
    });
  };

  Enterprise.remoteMethod('Edit', {
    http: {path: '/edit-enterprise', verb: 'post'},
    accepts: {arg: 'editedEnterprise', type: 'Object',
    required: true, http: {source: 'body'}},
    returns: {arg: 'status', type: 'string'}});

  Enterprise.Delete = function(enterprise, callback) {
    //Used to check if the enterprise object was passed correctly from the client side
    if (enterprise != null) {
      //Does nothing
    } else {
      //Drops the server
      assert(false);
    }

    //Finds the enterprise that will be deleted
    Enterprise.findOne({where: {'cnpj': enterprise.cnpj}}, function(err, foundEnterprise) {
      //Runs normally
      if (foundEnterprise != null) {
        Enterprise.remove({'cnpj': enterprise.cnpj}, function(err, obj) {
          //Returns a status showing that the enterprise was deleted sucessfully
          if (!err) {
            callback(null, 200);
          } else {
          //Returns a status showing that there was an error occurred on the http request
            console.error(err);
            callback(null, 400);
          }
        });
      } else {
        //Returns a status showing that an error ocurred in the request
        callback(null, 400);
      }
    });
  };

  //Method used to list all enterprises that belong to an user
  Enterprise.Consult = function(user, callback) {
    Enterprise.find({where: {'owner': user}}, function(err, obj) {
      if (obj[0] != null) {
        //There are enterprises registered to logged user, return them
        callback(null, obj);
      } else {
        // creating error to send to as response, no enterprises found
        var error = new Error('This user has no enterprises!');
        error.status = consts.ERRORCODE;
        callback(error, consts.ERRORCODE);
      }
    });
  };

  Enterprise.remoteMethod('Consult', {
    http: {path: '/consult-enterprises', verb: 'get'},
    accepts: {arg: 'user', type: 'string',
              required: true},
    returns: {arg: 'query', type: 'Object'}});

  Enterprise.remoteMethod('Delete', {
    http: {path: '/delete-enterprise', verb: 'post'},
    accepts: {arg: 'enterprise', type: 'Object',
              required: true, http: {source: 'body'}},
    returns: {arg: 'status', type: 'string'}});

    //Method used to assign one or more user to an enterprise on the database
  Enterprise.AddEmployee = function(enterprise, users, callback) {
    //Used to check if the enterprise and users object was passed correctly from the client side
    if (enterprise != null && users != null) {
      //Does nothing
    } else {
      //Drops the server
      assert(false);
    };

    //Here finds the enterprise by checking the email of ower and the enterprise name
    Enterprise.findOne({where: {'owner': enterprise.owner.email, 'name': enterprise.name}}, function(err, obj) {
      if (obj != null) {
        //
        var allEmployees = [];
        var allEmployees = uniqueEmployeeByEnterprise(obj.employees, users.employees);

        obj.updateAttributes({employees: allEmployees}, function(err, obj) {
          //Return Success if can add users to enterprise
          if (!err) {
            callback(null, 200);
          } else {
            //Return an error
            callback(null, 400);
          }
        });
      } else {
        //Return an error if the given enterprise not registered on the system
        callback(null, 400);
      }
    });
  };

  //This method generate a single vector if all employees of an enterprise,
  // making sure that isn't a duplicate employee email
  uniqueEmployeeByEnterprise = function(oldEmployees, newEmployees) {
    var employeesResult = [];

    //Check if there is something already in database
    if (oldEmployees != null) {
      employeesResult = oldEmployees.concat(newEmployees);
    } else {
      employeesResult = newEmployees;
    }

    //Run all the vector verify that is no other employee email equal
    for (var currentPosition = 0; currentPosition < employeesResult.length; currentPosition++) {
      for (var nextPosition = currentPosition + 1; nextPosition < employeesResult.length; nextPosition++) {
        if (employeesResult[currentPosition] === employeesResult[nextPosition]) {
          employeesResult.splice(nextPosition--, 1);
        }
      }
    }

    return employeesResult;
  };

  Enterprise.remoteMethod('AddEmployee', {
    http: {path: '/add-employee', verb: 'post'},
    accepts: [{arg: 'enterprise', type: 'Object', required: true},
              {arg: 'users', type: 'Object', required: true}],
    returns: {arg: 'status', type: 'string'}});

  //Method used by the get-employees remoteMethod
  Enterprise.ListEmployees = function(enterprise, callback) {
    if (enterprise != null) {
      //Do nothing
    } else {
      //Drops the server
      assert(false);
    }

    Enterprise.findOne({where: {'cnpj': enterprise.cnpj}}, function(err, obj) {
      //Returns a list of the employees to the user
      if(obj[0] != null || obj != null){
        callback(null, obj.employees);
      } else {
        //Returns an error for the user
        callback(null, 400);
      }
    });
  };

  //Remote method used to provide a means to get the employees on the database
  Enterprise.remoteMethod('ListEmployees', {
    http: {path:'/get-employees', verb: 'get'},
    accepts: {arg: 'enterprise', type: 'Object', required: true,
      http: {source: 'body'}},
    returns: {arg: 'employees', type: 'Object'}});
};
