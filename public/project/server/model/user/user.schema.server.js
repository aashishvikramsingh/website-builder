module.exports=function(){
    var mongoose = require('mongoose');
    var role=['ADMIN', 'USER', 'OWNER', 'DELIVERYBOY'];

    var UserSchema = mongoose.Schema({

        username:  {type: String, index: {unique: true}},
        password: String,
        firstName: String,
        lastName: String,
        email: {type: String, index: {unique: true}},
        role:{type: String, enum: role},
        phone: String,
        address: String,
        db_avail:{type:Number, default:0},
        deliverAddress: [String],
        dateCreated: {type: Date, default: Date.now},
        city: String,
        state: String,
        country: String,
        pin:String,
        OrderId: [{type: mongoose.Schema.Types.ObjectId, ref: 'OrderModel'}],

        restaurantID: [{type: String}],
        google: {
            id: String,
            token: String
        }


    }, {collection: 'userdb'});

    return UserSchema;
};