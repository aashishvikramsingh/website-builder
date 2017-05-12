module.exports=function(){
    var mongoose = require('mongoose');


    var OrderSchema = mongoose.Schema({
        restaurantId:  {type: String},
        dbId: {type: String},
        dbName:String,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        userFullName:String,
        deliverAddress: String,
        dateCreated: {type: Date, default: Date.now},
        items:[],
        totalAmount:Number,
        delivered: {type: Boolean, default: false},
        restLogo:String,
        restName:String,
        timestamp:String,
        scheduled:{type: Boolean, default: false},
        customerPhone:String

    }, {collection: 'orderdb'});

    return OrderSchema;
};