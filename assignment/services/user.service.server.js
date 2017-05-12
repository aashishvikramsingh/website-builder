module.exports=function(app,model){
    app.get("/api/user", findUser);
    app.post("/api/user", createUser);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);
    app.get("/api/user/:userId", findUserById);


    var UserModel =model.UserModel;
    var WebsiteModel=model.WebsiteModel;
    var PageModel=model.PageModel;
    var WidgetModel=model.WidgetModel;


    function findUserByCredentials(req,res){
        var username=req.query.username;
        var password=req.query.password;
        UserModel.findUserByCredentials(username,password)
            .then(function (user) {

                if (user)
                {
                    var newUser = {
                        username: user.username,
                        password: user.password,
                        _id: user._id,
                        email: user.email,
                        firstName:user.firstName,
                        lastName:user.lastName,

                        phone: user.phone
                    };

                    var user_date= new Date (user.dateCreated);
                    newUser.dateCreated =user_date.toUTCString();

                    res.json(newUser);

                }
                else
                {
                    res.sendStatus(404);
                }

            }, function () {
            res.sendStatus(404);

        });
    }

    function createUser(req, res){
        var user=req.body;
        UserModel.findUserByUsername(user.username)
            .then(function(response){

                if (response == null){

                    var newUser = {
                        username: user.username,
                        password: user.password,

                        email: user.email,
                        firstName:user.firstName,
                        lastName:user.lastName,
                        dateCreated: ((new Date()).getTime()).toString(),
                        phone: user.phone
                    };

                    UserModel.createUser(newUser)
                        .then(function (resp) {
                            res.json(resp);

                        }, function(){
                            res.sendStatus(404).send("Unable to create a new user");

                        })
                }
                else {
                    res.sendStatus(404).send("Username is not available");

                }
            }), function(){
                res.sendStatus(404).send("error while processing request");

        };
    }



    function updateUser(req, res){
        var modifiedUser = req.body;
        var userId=req.params.userId;

        UserModel.updateUser(userId, modifiedUser)
            .then(function (resp) {
                UserModel.findUserById(userId)
                    .then(function (user) {
                        var user_date= new Date (user.dateCreated);
                        user.dateCreated =user_date.toUTCString();

                        res.json(user);

                    },function () {
                        res.sendStatus(404);
                    })

            }, function () {
            res.sendStatus(404);

        });
    }

    function findUser(req, res){
        var username=req.query.username;
        var password=req.query.password;

        if (username && password){
            findUserByCredentials(req,res);
        }

        else{
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res){
        var username=req.query.username;
        UserModel.findUserByUsername(username)
            .then(function(user){
                var newUser = {
                    username: user.username,
                    password: user.password,
                    _id: user._id,
                    email: user.email,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    phone: user.phone
                };

                var user_date= new Date (user.dateCreated);
                newUser.dateCreated =user_date.toUTCString();

                res.json(newUser);

            }, function (error) {
            res.sendStatus(404).send(error);

        });}



    function deleteUser(req,res){
        var userId=req.params.userId;

        UserModel.findUserById(userId)
            .then(function(user){

                var websiteids=user.websites;


                UserModel.deleteUser(userId)
                    .then(function (resp) {


                        websiteids.forEach(function (webId) {
                            WebsiteModel.findWebsiteById(webId)
                                .then(function (website) {

                                    var pageIds = website.pages;


                                    WebsiteModel.deleteWebsite(webId)
                                        .then(function (resp) {

                                           pageIds.forEach(function (p) {
                                               PageModel.findPageById(p)

                                                   .then(function (page) {
                                                       var widgetIds=page.widgets;


                                                       PageModel.deletePage(p)
                                                           .then(function (resp) {
                                                               widgetIds.forEach(function (widId) {
                                                                   WidgetModel.deleteWidget(widId);
                                                               })
                                                           },function () {
                                                               res.sendStatus(404);
                                                           })
                                                       }, function () {
                                                           res.sendStatus(404);
                                                   })
                                               })

                                           }, function () {
                                                res.sendStatus(404);
                                        })
                                    },function () {
                                        res.sendStatus(404);
                                })
                        });
                        res.sendStatus(200);
                    }, function () {
                        res.sendStatus(404);
                    })
                res.sendStatus(200);
            }, function () {
                res.sendStatus(404);
            })

    }

    function findUserById(req, res){
        var userId=req.params.userId;
        UserModel.findUserById(userId)
            .then(function (user) {

                var newUser = {
                    username: user.username,
                    password: user.password,
                    _id: user._id,
                    email: user.email,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    phone: user.phone
                };

                var user_date= new Date (user.dateCreated);
                newUser.dateCreated =user_date.toUTCString();

               res.json(newUser);

            },function () {
                res.sendStatus(404);

            });

    }

}