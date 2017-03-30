'use strict';

module.exports = function(UserProfile) {

  UserProfile.signUp = function (user, callback) {
    
    UserProfile.upsert(user, function(err, obj){
      if (err) {
        console.error(err);
      }
      else {
        console.log('Success');
      }
    })
  }

  UserProfile.remoteMethod('signUp', {
    http: {path:'/sign-up', verb:'post'},
    accepts: {arg: 'user', type:'UserProfile', required:true},
    returns: {arg:'status', type:'string'}
  });

};
