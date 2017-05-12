module.exports=function () {
    var mongoose=require('mongoose');
    var validTypes = ['HEADER', 'IMAGE', 'YOUTUBE', 'HTML', 'INPUT', 'TEXT'];

    var WidgetSchema = mongoose.Schema({
        _page: {type: mongoose.Schema.Types.ObjectId, ref:'PageModel'},
        widgetType:  {type: String, enum: validTypes},
        name: String,
        text: String,
        placeholder: String,
        description: String,
        url: String,
        width: String,
        height: String,
        rows: {type: Number, default: 0},
        size: {type: Number, default: 1},
        class: String,
        icon: String,
        deletable: Boolean,
        formatted: Boolean,
        dateCreated:{type: Date, default: Date.now},
        widgetOrder: Number
    }, {collection: 'widgetdb'});

    return WidgetSchema;
}