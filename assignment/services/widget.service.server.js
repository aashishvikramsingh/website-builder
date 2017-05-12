module.exports=function(app, model){

    app.post("/api/page/:pageId/widget",createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId",findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.put("/api/page/:pageId/widget", updateIndex);


    var PageModel=model.PageModel;
    var WidgetModel=model.WidgetModel;

    function createWidget(req, res){
        var pageId= req.params.pageId;
        var widget= req.body;
        var type=widget.widgetType;
        widget.type=type;

        WidgetModel.createWidget(pageId, widget)
            .then(function (widget) {
                PageModel.addWidget(pageId, widget._id)
                    .then(function () {
                        res.json(widget);
                    },function () {
                        res.sendStatus(404);
                    })

            }, function (err) {
               res.sendStatus(404);
            });

    }


    function findAllWidgetsForPage (req, res){
        var pageId=req.params.pageId;
        WidgetModel.findAllWidgetsForPage(pageId)
            .then(function (widgets) {

                res.json(widgets);
            }, function (err) {
                res.sendStatus(404);
            })
    }

    function findWidgetById(req, res){
        var widgetId=req.params.widgetId;
        WidgetModel.findWidgetById(widgetId)
            .then(function (widget) {
                res.json(widget);
            }, function (err) {
                res.sendStatus(404);
            })
    }


    function updateWidget(req, res){
        var widgetId=req.params.widgetId;
        var widget=req.body;
        WidgetModel.updateWidget(widgetId, widget)
            .then(function (widget) {
                res.json(widget);
            },function () {
                res.sendStatus(404);
            });
    }

    function deleteWidget(req, res){
        var widgetId= req.params.widgetId;
        WidgetModel.findWidgetById(widgetId)
            .then(function (widget) {
                var pageId=widget._page;
                WidgetModel.deleteWidget(widgetId)
                    .then(function () {

                        PageModel.deleteWidgetId(pageId, widgetId)
                            .then(function () {
                                res.sendStatus(200);
                            }, function () {
                                res.sendStatus(404);
                            })
                    }, function () {
                        res.sendStatus(404);
                    });
            }, function () {
                res.sendStatus(404);
            });


    }

    function updateIndex(req, res){
        var pageId=req.params.pageId;
        var initial=req.query.initial;
        var final=req.query.final;
        WidgetModel.reorderWidget(pageId, initial, final)
            .then(function () {
                res.sendStatus(200);
            }, function () {
                res.sendStatus(404);
            })
    }


}