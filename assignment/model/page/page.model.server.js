module.exports=function () {

    var api={
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage:updatePage,
        deletePage:deletePage,
        addWidget:addWidget,
        deleteWidgetId:deleteWidgetId
    }

    var q =require ('q');
    var mongoose=require('mongoose');
    var PageSchema= require("./page.schema.server")();
    var PageModel=mongoose.model('PageModel', PageSchema);

    return api;


    function createPage (wid, page) {
        var deferred = q.defer();
        page._website = wid;
        PageModel.create(page, function (err, page) {
            if (err) {
                deferred.reject();

            }
            else {
                deferred.resolve(page);
            }
        });
        return deferred.promise;
    }
    
    function findAllPagesForWebsite(wid) {
        var deferred=q.defer();
        PageModel.find({_website: wid}, function (err, pages) {
            if (err){
                deferred.reject();
            }
            else {
                deferred.resolve(pages);
            }
        });
        return deferred.promise;
    }
    
    function findPageById(pageId) {
        var deferred=q.defer();
        PageModel.findOne({_id: pageId}, function (err, page) {
            if (err){
                deferred.reject();
            }
            else{
                deferred.resolve(page);
            }
        });
        return deferred.promise;
    }

    function updatePage(pageId, page) {
        var deferred=q.defer();
        PageModel.update({_id: pageId},
                         {$set:
                             {name: page.name,
                                 title: page.title,
                                 description: page.description}},
                         function (err, page) {
                              if (err){
                                  deferred.reject();
                              }
                              else{
                                  deferred.resolve(page);
                              }
                         });
        return deferred.promise;
    }
    
    function deletePage (pageId) {
        var deferred=q.defer();
        PageModel.remove({_id: pageId}, function (err) {
            if (err){
                deferred.reject();
            }
            else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    function addWidget (pageId, widgetId) {
        var deferred=q.defer();
        PageModel.update({_id: pageId},
                        {$push: {widgets: widgetId}},
                        function (err) {
                            if (err){
                                deferred.reject();
                            }
                            else {
                                deferred.resolve();
                            }
        });

        return deferred.promise;
    }

    function deleteWidgetId (pageId, widgetId) {
        var deferred=q.defer();
        PageModel.update({_id: pageId},
            {$pull: {widgets: widgetId}},
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

}