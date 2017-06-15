var app = require('../../server/server');

module.exports = function(Group) {
  Group.validatesUniquenessOf('name');

  //Used by the remote method register-group
  Group.Register = function(newGroup, callback) {
    //Used to check if the passed group isn't null
    if(newGroup != null) {
      //Do nothing
    } else {
      //Drops the server
      assert(false);
    }

    const Enterprise = app.models.enterprise;

    Enterprise.findOne({where: {'cnpj': newGroup.enterprise_cnpj}}, function(err, obj) {
      if(!err && obj != null){
        //Used to register the new group on the database
        Group.upsert(newGroup, function(err, obj) {
          //Returns a successfull status to the user
          if(!err) {
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

  //Method used to provide a means to register a group within the enterpise
  Group.remoteMethod('Register', {
    http: {path: '/register-group', verb: 'post'},
    accepts: {type: 'Object', arg: 'groups',
      required: true, http: { source: 'body'}},
    returns: {arg: 'status', type: 'string'}});
};
