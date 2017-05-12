module.exports=function (app,model){
    app.post("/api/website/:websiteId/page",createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId",updatePage);
    app.delete("/api/page/:pageId",deletePage);

    var PageModel=model.PageModel;
    var WebsiteModel=model.WebsiteModel;
    var WidgetModel=model.WidgetModel;

    var q = require('q');
    function findAllPagesForWebsite(req, res){
        var websiteId=req.params.websiteId;
        PageModel.findAllPagesForWebsite(websiteId)
            .then(function (pages) {
                res.json(pages);
            }, function () {
                res.sendStatus(404);
            });
    }

    function createPage(req, res){
        var websiteId=req.params.websiteId;
        var newpage=req.body;

        PageModel.createPage(websiteId,newpage)
            .then(function (page) {
                WebsiteModel.addPage(websiteId, page._id)
                    .then(function () {
                        res.json(page);
                    }, function () {
                        res.sendStatus(404);
                    })

            }, function () {
                res.sendStatus(404);
            })
    }

    function findPageById(req,res){
        var pageId=req.params.pageId;
        PageModel.findPageById(pageId)
            .then(function (page) {
                res.json(page);
            }, function () {
                res.sendStatus(404);
            })
    }

    function updatePage(req, res){
        var pageId=req.params.pageId;
        var page=req.body;
        PageModel.updatePage(pageId,page)
            .then(function (page) {
                res.json(page);
            }, function () {
                res.sendStatus(404);
            });
    }

    function deletePage (req, res) {
        var pageId=req.params.pageId;
        PageModel.findPageById(pageId)
            .then(function (page) {
                var wid=page._website;
                var widgetIds=page.widgets;
                PageModel.deletePage(pageId)
                    .then(function (resp) {
                        WebsiteModel.deletePage(wid,pageId)
                            .then(function (resp) {
                                widgetIds.forEach(function (w) {

                                    WidgetModel.deleteWidget(w);
                                })

                               res.sendStatus(200);
                            }, function () {
                                res.sendStatus(404);
                            });
                    }, function () {
                        res.sendStatus(404);
                    });
            }, function () {
                res.sendStatus(404);
            })

    }


}