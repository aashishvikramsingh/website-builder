module.exports=function () {
    var api = {
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById:findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        addPage:addPage,
        deletePage:deletePage
    };

    var q = require('q');
    var mongoose=require('mongoose');
    var WebsiteSchema= require('./website.schema.server.js')();
    var WebsiteModel=mongoose.model('WebsiteModel', WebsiteSchema);

    return api;

    function createWebsiteForUser(website){
        var deferred=q.defer();
        WebsiteModel.create(website, function (err, website) {
            if (err){
                deferred.reject();
            }
            else {
                deferred.resolve(website);
            }
        });
        return deferred.promise;
    }

    function findAllWebsitesForUser(uid){
        var deferred=q.defer();
        WebsiteModel.find({_user: uid}, function (err, websites) {
            if (err){
                deferred.reject();
            }
            else
            {
                deferred.resolve(websites);
            }
        });
        return deferred.promise;
    }

    function findWebsiteById (websiteId){
        var deferred=q.defer();
        WebsiteModel.findOne({_id: websiteId}, function (err, website) {
            if (err){
                deferred.reject();
            }
            else{
                deferred.resolve(website);
            }
        });
        return deferred.promise;
    }

    function updateWebsite(websiteid, website) {
        var deferred=q.defer();
        WebsiteModel.update({_id: websiteid},
             {$set: {name: website.name,
                    description: website.description}},
             function (err, resp) {
                  if (err){
                      deferred.reject();
                  }
                  else {
                      deferred.resolve(resp);
                  }
              });
        return deferred.promise;

    }

    function deleteWebsite (websiteId) {
        var deferred=q.defer();
        WebsiteModel.remove({_id: websiteId}, function (err, resp) {
            if (err){
                deferred.reject();
            }
            else{
                deferred.resolve(resp)
            }
        });
        return deferred.promise;

    }

    function addPage (wid, pid) {
        var deferred=q.defer();
        WebsiteModel.update({_id: wid},{$push: {pages: pid}}, function (err, resp) {
            if (err){
                deferred.reject();
            }
            else{
                deferred.resolve(resp);
            }
        });
        return deferred.promise;
    }

    function deletePage(wid, pid) {
        var deferred=q.defer();
        WebsiteModel.update({_id: wid},{$pull: {pages: pid}}, function (err, resp) {
            if (err){
                deferred.reject();
            }
            else{
                deferred.resolve(resp);
            }
        });
        return deferred.promise;
    }
}
