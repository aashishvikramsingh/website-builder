module.exports = function () {
    var q = require('q');


    var mongoose = require('mongoose');

    var MenuSchema = require('./menu.schema.server.js')();
    var MenuModel = mongoose.model('MenuModel', MenuSchema);

    var api = {
        createMenu: createMenu,
        findMenuByRestaurantId:findMenuByRestaurantId,
        updateMenuItem:updateMenuItem,
        updateMenuCategory:updateMenuCategory,
        findMenuById:findMenuById,
        findMenu:findMenu,
        deleteMenuById:deleteMenuById,
        deleteMenuCategory:deleteMenuCategory

    };


    return api;

    function deleteMenuCategory(catname) {



        var deferred = q.defer();
        MenuModel

            .remove({category:catname}
            ,function (err,response) {
                    if(err){
                        deferred.reject(err);
                    }else{
                        deferred.resolve(response);
                    }

                });
        return deferred.promise;

    }

    function deleteMenuById(menuid) {
        var deferred = q.defer();
        MenuModel
            .remove({_id:menuid},function (err,response) {
                if (err){
                    deferred.reject(err);
                }else {
                    deferred.resolve(response);
                }});


        return deferred.promise;
    }




    function findMenu(menu) {
        var deferred = q.defer();
        MenuModel
            .find({itemName:menu.itemName,
                    price:menu.price,
                    restaurantId:menu.restaurantId},function (err,menu){
                                                                if (err){
                                                                    deferred.abort(err);
                                                                }else {
                                                                    deferred.resolve(menu);
                                                                }});


        return deferred.promise;
    }

    function findMenuById(menuid) {
        var deferred = q.defer();
        MenuModel
            .findOne({_id:menuid},function (err,menu){
                if (err){
                    deferred.abort(err);
                }else {
                    deferred.resolve(menu);
                }});
        return deferred.promise;
    }



    function updateMenuCategory(restaurantId,menu) {
        var deferred = q.defer();


        MenuModel
            .find({category:menu.catname}, function (err, items) {
                if(err){
                    deferred.reject();
                }
                else{
                    items.forEach(function (i) {
                        MenuModel.update({_id: i._id},{$set: {category: menu.newcat}}, function (err, response) {
                            if(err){
                                deferred.reject();
                            }
                            else{
                                deferred.resolve(response)
                            }
                        })
                    })
                }
            })
        return deferred.promise;
    }




    function updateMenuItem(menuId,menu) {
        var deferred = q.defer();

        MenuModel
            .update({_id:menuId},{
            $set:{
                itemName:menu.itemName,
                price:menu.price
            }},function(err,menu){
            if(err){
                deferred.reject(err);
            }else{
                deferred.resolve(menu);
            }
            });
        return deferred.promise;
    }


    function findMenuByRestaurantId(restaurantId) {
        var deferred = q.defer();
        MenuModel
            .find({restaurantId:restaurantId},function (err,menu){
                if (err){
                      deferred.reject(err);
                  }else {
                    deferred.resolve(menu);
        }}).sort({'category': 1});

    return deferred.promise;
}


function createMenu(menu) {
        var deferred = q.defer();
        MenuModel
            .create(menu,function (err,menu) {
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(menu);
                }
            });

        return deferred.promise;
    }


};