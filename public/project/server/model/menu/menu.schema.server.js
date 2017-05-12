/**
 * Created by Pratik on 4/1/2017.
 */
module.exports=function(){
    var mongoose = require('mongoose');


    var MenuSchema = mongoose.Schema({

        itemName: String,
        price: {type: Number},
        restaurantId : String,
        category:String,
        dateCreated: {type: Date, default: Date.now}

    }, {collection: 'menudb'});

    return MenuSchema;
};
