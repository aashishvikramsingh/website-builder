module.exports = function () {

    var q = require('q');
    var api = {
        createUser: createUser,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserById: findUserById,
        addWebsite:addWebsite,
        deleteWebsiteId: deleteWebsiteId
    };

    var mongoose = require('mongoose');

    var UserSchema = require('./user.schema.server.js')();
    var UserModel = mongoose.model('UserModel', UserSchema);

    return api;

    function createUser(user) {
        var deferred=q.defer();
        // return UserModel.create(user);
        UserModel.create(user, function (err, user) {
            if(err){
                deferred.reject();

            }
            else{
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function findUserByUsername(username){
        var deferred=q.defer();
         UserModel.findOne({username: username}, function (err, user) {
             if(err){
                 deferred.reject();

             }
             else{
                 deferred.resolve(user);
             }

         });
        return deferred.promise;
    }

    function findUserByCredentials(username, password){
        var deferred=q.defer();
         UserModel.findOne({username: username, password:password}, function (err, user) {
             if(err){
                 deferred.reject();

             }
             else{
                 deferred.resolve(user);
             }
         });
        return deferred.promise;
    }

    function updateUser(id, user) {
        var deferred=q.defer();
          UserModel.update({_id: id},
             {$set: {password: user.password,
                     firstName: user.firstName,
                     lastName: user.lastName,
                     email: user.email}},
          function (err, user) {
              if(err){
                  deferred.reject();

              }
              else{
                  deferred.resolve(user);
              }

          });

        return deferred.promise;
    }

    function deleteUser(id){
        var deferred=q.defer();
        UserModel.remove({_id: id}, function (err) {
            if(err){
                deferred.reject();

            }
            else{
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    function findUserById(id){
        var deferred=q.defer();

        UserModel.findOne({_id: id}, function (err, user) {
            if(err){
                deferred.reject();

            }
            else{
                deferred.resolve(user);
            }

        });
        return deferred.promise;
    }

    function addWebsite (uid, wid) {
        var deferred=q.defer();
         UserModel.update({_id:uid},{$push: {websites: wid}}, function (err, user) {
            if(err){
                deferred.reject();

            }
            else{
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    }

    function deleteWebsiteId (uid, wid) {
        var deferred=q.defer();
        UserModel.update({_id: uid},{$pull: {websites: wid}}, function (err) {
            if(err){
                deferred.reject();

            }
            else{
                deferred.resolve();
            }
        });

        return deferred.promise;
    }
};