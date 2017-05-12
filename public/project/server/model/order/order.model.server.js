module.exports=function () {

    var q = require('q');
    var mongoose = require('mongoose');

    var OrderSchema = require('./order.schema.server.js')();
    var OrderModel = mongoose.model('OrderModel', OrderSchema);

    var api = {
        createOrder: createOrder,
        getCurrentOrder: getCurrentOrder,
        markOrderDelivered: markOrderDelivered,
        getAllOrdersForThisCustomerId:getAllOrdersForThisCustomerId,
        updateOrderWithDB:updateOrderWithDB,
        findOrders:findOrders,
        deleteOrder:deleteOrder,
        findOrder: findOrder,


    };
    return api;


    function createOrder(order) {
        var deferred = q.defer();
        OrderModel.create(order, function (err, res) {

            if (err) {

                deferred.reject(err);
            }
            else {


                deferred.resolve(res);
            }
        })

        return deferred.promise;

    }

    function getCurrentOrder(uid, currtime) {
        var deferred = q.defer();
        OrderModel.findOne({userId: uid, timestamp: currtime}, function (err, order) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(order)
            }
        });
        return deferred.promise;
    }

    function updateOrderWithDB (order) {
        var deferred = q.defer();
        OrderModel.update({_id: order._id},{$set: {dbId: order.dbId, dbName: order.dbName, scheduled: true}}, function (err, order) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(order)
            }
        });
        return deferred.promise;
    }

    function markOrderDelivered (order) {
        var deferred = q.defer();
        OrderModel.update({_id: order._id},{$set: {delivered: true}}, function (err, order) {
            if (err) {

                deferred.reject(err);
            }
            else {

                deferred.resolve(order)
            }
        });
        return deferred.promise;
    }


    function getAllOrdersForThisCustomerId(uid) {
        var deferred = q.defer();
        OrderModel.find({userId: uid}).sort('-_id').exec(function (err, order) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(order)
            }
        });
        return deferred.promise;
    }


    function findOrders() {
        var deferred = q.defer();
        OrderModel.find().sort('-_id').exec(function (err, order) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(order)
            }
        });
        return deferred.promise;
    }

    function deleteOrder(orderId) {
        var deferred = q.defer();
        OrderModel.remove({_id: orderId},function (err, order) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(order)
            }
        });
        return deferred.promise;
    }

    function findOrder(orderId) {
        var deferred = q.defer();
        OrderModel.findOne({_id: orderId},function (err, order) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(order)
            }
        });
        return deferred.promise;
    }
}