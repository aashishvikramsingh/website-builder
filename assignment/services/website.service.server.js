module.exports=function(app, model){
     app.post("/api/user/:userId/website", createWebsite);
     app.get("/api/user/:userId/website", findAllWebsitesForUser);
     app.get("/api/website/:websiteId", findWebsiteById);
     app.put("/api/website/:websiteId", updateWebsite);
     app.delete("/api/website/:websiteId", deleteWebsite);


    var UserModel =model.UserModel;
    var WebsiteModel=model.WebsiteModel;
    var PageModel=model.PageModel;
    var WidgetModel=model.WidgetModel;

    function createWebsite(req,res){
        var userId=req.params.userId;
        var website=req.body;
        var newWebsite={
            name: website.name,
            _user: userId,
            // _id: ((new Date()).getTime()).toString(),
            description: website.description
        };


        WebsiteModel.createWebsiteForUser(newWebsite)
            .then(function (newWebsite) {
                UserModel.addWebsite(userId, newWebsite._id)
                    .then(function () {
                        res.json(newWebsite);
                    }), function () {
                    res.sendStatus(404);
                }

            }, function () {
                res.sendStatus(404);
            });




    }

    function findAllWebsitesForUser(req,res){
        var userId=req.params.userId;

        WebsiteModel.findAllWebsitesForUser(userId)
            .then(function (websites) {

                var websites_res=[];

                for (var w in websites){

                      var temp ={
                          _id: websites[w]._id,
                          name: websites[w].name,
                          description: websites[w].description,
                          developerId: websites[w]._user,
                          pages: websites[w].pages
                      }
                        var website_date= new Date (websites[w].dateCreated);
                        temp.created =website_date.toUTCString();
                        websites_res.push(temp);
                }

                res.json(websites_res);},  function () {
                    res.sendStatus(404);
            })


    }

    function findWebsiteById(req,res){

        var websiteId=req.params.websiteId;

        WebsiteModel.findWebsiteById(websiteId)
            .then(function (website) {
                var ws ={
                    _id: website._id,
                    name: website.name,
                    description: website.description,
                    developerId: website._user,
                    pages: website.pages
                };
                var website_date= new Date (website.dateCreated);
                ws.created =website_date.toUTCString();
                res.json(ws);
            }, function () {
                res.sendStatus(404);
            });

    }

    function updateWebsite (req, res){
        var websiteId=req.params.websiteId;
        var website=req.body;
        var ws ={
            _id: website._id,
            name: website.name,
            description: website.description,
            _user: website.developerId,
            pages: website.pages
        };
        WebsiteModel.updateWebsite(websiteId,ws)
            .then(function (resp) {
                WebsiteModel.findWebsiteById(websiteId)
                    .then(function (website) {
                        var temp ={
                            _id: website._id,
                            name: website.name,
                            description: website.description,
                            developerId: website._user,
                            pages: website.pages
                        }
                        var website_date= new Date (website.dateCreated);
                        temp.created =website_date.toUTCString();
                        res.json(temp);

                    },function () {
                        res.sendStatus(404);
                    });

            },function (error) {
                res.sendStatus(404);
            });
   }

    function deleteWebsite(req, res){
        var websiteId=req.params.websiteId;

        WebsiteModel.findWebsiteById(websiteId)
            .then(function (website) {
                var userId=website._user;
                var pageIds=website.pages;

                WebsiteModel.deleteWebsite(websiteId)
                    .then(function (resp) {
                        UserModel.deleteWebsiteId(userId, websiteId)
                            .then(function (resp) {
                                pageIds.forEach(function (p) {
                                   PageModel.findPageById(p)
                                       .then(function(page){
                                           var widgetids=page.widgets;
                                           widgetids.forEach(function (w) {
                                               WidgetModel.deleteWidget(w);
                                           })
                                           PageModel.deletePage(p);

                                       }, function () {
                                           res.sendStatus(404);
                                       })
                                });
                                res.send(200);
                            }, function () {
                                res.sendStatus(404).send("Unable to update website in user");
                            });

                    }, function () {
                        res.sendStatus(404).send("Unable to delete website");
                    });


            }, function () {
                res.sendStatus(404).send("Website not found");
            });

    }

}