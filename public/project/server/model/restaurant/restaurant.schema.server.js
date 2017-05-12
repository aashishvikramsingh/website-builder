
module.exports=function(){
    var mongoose = require('mongoose');



    var RestaurantSchema = mongoose.Schema({
        _id: {type:String, index: {unique: true}},
        name:  String,
        ownerId : String,
        menuId : [String],
        orderId:[{type: mongoose.Schema.Types.ObjectId, ref: 'OrderModel'}],
        deliveryBoysId : [String],
        phone: String,
        streetAddress: String,
        city: String,
        state:String,
        country: String,
        pin:String,
        logoUrl:String,
        timestamp:String,
        hours:{
            "Monday":[String],
            "Tuesday":[String],
            "Wednesday":[String],
            "Thursday":[String],
            "Friday":[String],
            "Saturday":[String],
            "Sunday":[String]
        },
        open:Boolean,
        foodTypes:[String],
        cuisine: String,
        offersDelivery:{type: Boolean, default: false},
        offersPickup:{type: Boolean, default: false},
        dateCreated: {type: Date, default: Date.now},
        url: String,
        partner: {type: Boolean, default: false},
    }, {collection: 'restaurantdb'});

    return RestaurantSchema;
};

