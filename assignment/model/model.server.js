module.exports=function () {
    // var mongoose = require('mongoose');
    var model= {
        UserModel: require('./user/user.model.server')(),
        WebsiteModel: require('./website/website.model.server')(),
        PageModel: require('./page/page.model.server')(),
        WidgetModel:require('./widget/widget.model.server')()
    }
    return model;
}