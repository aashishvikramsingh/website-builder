module.exports=function () {

    var model= {
        UserModel: require('./user/user.model.server')(),
        RestaurantModel: require('./restaurant/restaurant.model.server')(),
        MenuModel : require('./menu/menu.model.server')(),
        OrderModel:require('./order/order.model.server')()
    };
    return model;
};
