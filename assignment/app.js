module.exports = function(app) {
    var model = require("./model/model.server.js")();

    require('./services/user.service.server')(app, model);
    require('./services/website.service.server.js')(app, model);
    require('./services/page.service.server.js')(app, model);
    require("./services/widget.service.server.js")(app, model);
    require("./services/imageupload.service.server")(app);

};