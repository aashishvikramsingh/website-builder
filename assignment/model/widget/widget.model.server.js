module.exports=function () {
    var api = {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidget: reorderWidget
    };

    var q  = require('q');
    var mongoose = require('mongoose');
    var WidgetSchema = require('./widget.schema.server')();
    var WidgetModel = mongoose.model('WidgetModel', WidgetSchema);

    return api;

    function createWidget(pageId, widget) {
        var deferred = q.defer();
        widget._page = pageId;

        WidgetModel.findOne({_page: pageId})
            .sort('-widgetOrder')
            .exec(function (err, member) {
                if (err){
                    deferred.reject();
                }
                else{

                    if (member){

                        widget.widgetOrder = member.widgetOrder+1;

                    }

                    else{
                        widget.widgetOrder = parseInt(0);
                    }


                    WidgetModel.create(widget, function (err, widget) {
                        if (err){
                            deferred.reject();
                        }

                        else{
                            deferred.resolve(widget);
                        }
                    });
                }


            });


        return deferred.promise;
    }

    function findAllWidgetsForPage (pageId){
        var deferred = q.defer();
        WidgetModel.find({_page: pageId})
            .sort('widgetOrder')
            .exec(function (err, widgets) {

                if (err){
                    deferred.reject();
                }
                else{
                    deferred.resolve(widgets);
                }

            });



        return deferred.promise;
    }


    function findWidgetById (widgetId) {
        var deferred = q.defer();
        WidgetModel.findOne({_id: widgetId},function (err, widget) {
            if (err){
                deferred.reject();
            }
            else {

                deferred.resolve(widget);
            }
        });

        return deferred.promise;
    }

    function updateWidget (widgetId, widget) {
        var deferred = q.defer();
        WidgetModel.update({_id: widgetId},
            {$set:
                {name: widget.name,
                    text: widget.text,
                    placeholder: widget.placeholder,
                    description: widget.description,
                    url: widget.url,
                    width: widget.width,
                    height: widget.height,
                    rows: widget.rows,
                    size: widget.size,
                    class: widget.class,
                    icon: widget.icon,
                    deletable: widget.deletable,
                    formatted: widget.formatted}},
            function (err, widget) {
                if (err){
                    // deferred.reject();

                }
                else{
                    deferred.resolve(widget);
                }
            })
        return deferred.promise;
    }

    function deleteWidget (widgetId) {
        var deferred = q.defer();
        WidgetModel.findOne({_id: widgetId},function (err, widget) {
            if (err){
                deferred.reject();
            }
            else{

                var thisWidgetOrder= widget.widgetOrder;
                var thisPageId=widget._page;
                WidgetModel.remove({_id: widgetId},
                    function (err, resp) {
                        if (err){
                            deferred.reject();
                        }
                        else {
                            WidgetModel.find({_page: thisPageId,
                                    widgetOrder: {$gte: thisWidgetOrder}},
                                function (err, widgets) {

                                    if(err){
                                        deferred.reject();
                                    }
                                    else if (widgets.length == 0) {
                                        deferred.resolve();
                                    }

                                    else
                                    {
                                        widgets.forEach(function (w) {

                                            var newOrder=w.widgetOrder -1;

                                            WidgetModel.update({_id: w._id},
                                                {$set: {widgetOrder: newOrder}},
                                                function (err, resp) {
                                                    if (err){
                                                        deferred.reject();
                                                    }
                                                    else{

                                                        deferred.resolve();
                                                    }
                                                });
                                        })
                                    }
                                });

                        }
                    });

            }
        });
        return deferred.promise;
    };


    function reorderWidget (pageId, start, end) {
        var deferred = q.defer();
        WidgetModel.findOne({_page: pageId, widgetOrder: start}, function (err, widget){
            if (err){
                deferred.reject();
            }

            else{
                if(start < end){
                    WidgetModel.find({_page: pageId,
                            $and: [{widgetOrder: {$gt: start}}, {widgetOrder: {$lte: end}}]},
                        function (err, widgets) {
                            if(err){
                                deferred.reject();
                            }
                            else{
                                widgets.forEach(function (w) {

                                    var newOrder=w.widgetOrder -1;

                                    WidgetModel.update({_id: w._id},{$set: {widgetOrder: newOrder}},
                                        function (err, resp) {
                                            if (err){
                                                deferred.reject();
                                            }
                                            else{

                                                deferred.resolve();
                                            }
                                        });
                                })

                                WidgetModel.update({_page: pageId, _id: widget._id},
                                    {$set: {widgetOrder: end}},
                                    function (err) {
                                        if (err){
                                            deferred.reject();
                                        }

                                        else{
                                            deferred.resolve();
                                        }
                                    });
                            }
                        });
                }
                else{
                    WidgetModel.find({_page: pageId,
                            $and: [{widgetOrder: {$gte: end}}, {widgetOrder: {$lt: start}}]},
                        function (err, widgets) {
                            if(err){
                                deferred.reject();
                            }
                            else{
                                widgets.forEach(function (w) {

                                    var newOrder=w.widgetOrder +1;

                                    WidgetModel.update({_id: w._id},
                                        {$set: {widgetOrder: newOrder}},
                                        function (err, resp) {
                                            if (err){
                                                deferred.reject();
                                            }
                                            else{

                                                deferred.resolve();
                                            }
                                        });
                                })

                                WidgetModel.update({_page: pageId, _id: widget._id},
                                    {$set: {widgetOrder: end}},
                                    function (err) {
                                        if (err){
                                            deferred.reject();
                                        }

                                        else{
                                            deferred.resolve();
                                        }
                                    });
                            }
                        });
                }

            }
        })
        return deferred.promise;
    }
}