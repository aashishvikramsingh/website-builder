module.exports=function(app,model){

    var bcrypt = require("bcrypt-nodejs");
    var passport = require('passport');
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var LocalStrategy = require('passport-local').Strategy;

    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/loggedin', loggedin);
    app.post('/api/logout', logout);

    app.post("/api/user", createUser);
    app.put("/api/user/:uid", updateUser);
    app.delete("/api/user/:uid", deleteUser);
    app.get("/api/user/:uid", findUserById);
    app.get("/api/user",findUserByCredentials);
    app.get("/api/users/:rst",findDeliveryBoyByRestaurant);
    app.put("/api/users/:uid",updateAvailabiltyofDB);
    app.get("/api/users/activedelboys/:rst",findActiveDeliveryBoyByRestaurant);
    app.get( "/api/users/:uid/orders",getAllOrdersForThisDeliveryBoy);
    app.put("/api/user/:uid/deliveryAddress", updateDeliveryAddresses);
    app.get("/api/findCurrentUser",findCurrentUser);
    app.get("/api/users", findUsers);
    app.put("/api/user/:uid/removeRestaurant/:rid", removeRestaurentFromOwner);
    app.put("/api/setrest/:rid", setRestaurantId);
    app.get("/api/getrest", getRestaurantId);
    app.put("/api/setdbid/:dbid",setDBId);
    app.get("/api/getdbid",getDBId);



    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/google/callback',
        passport.authenticate('google', {
            successRedirect: '/#/user/searchResult',
            failureRedirect: '/#/login'
        }));


    var UserModel = model.UserModel;
    var RestaurantModel = model.RestaurantModel;
    var MenuModel=model.MenuModel;



    function localStrategy(username, password, done) {

        UserModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    var restId;
    function setRestaurantId(req,res) {
        restId = req.params['rid'];

        res.json(restId);
    }

    function getRestaurantId(req,res) {

        res.json(restId);
    }

    var dbId;
    function setDBId(req,res) {
        restId = req.params['dbid'];
        res.json(restId);
    }

    function getDBId(req,res) {

        res.json(restId);
    }





    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        UserModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }


    function findCurrentUser(req,res) {
        res.json(req.user);
    }


    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    };

    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    function googleStrategy(token, refreshToken, profile, done) {
        UserModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return UserModel.createUser(newGoogleUser)
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }



    function updateAvailabiltyofDB(req,res) {
        var userId = req.params['uid'];
        var user = req.body;

        UserModel
            .updateAvailabiltyofDB(userId,user)
            .then(function (response) {
                res.json(response)

            },function (err) {
                res.send(err);

            });
    }


    function findDeliveryBoyByRestaurant(req,res) {
        var restaurantID = req.params['rst'];

        RestaurantModel
            .findRestaurantById(restaurantID)
            .then(function (restaurant) {

                UserModel
                    .findUserByDeliveryboy(restaurant.deliveryBoysId)
                    .then(function (response) {

                        res.json(response);
                    }, function (err) {
                        res.send(err);
                    })
            });}





    function findUserByCredentials(req,res) {
        var username = req.query.username;
        var password = req.query.password;


        UserModel
            .findUserByCredentials(username,password)
            .then(function (user) {
                if(user  && bcrypt.compareSync(password, user.password)){
                    res.json(user);
                }
                else{
                    res.sendStatus(404);
                }


                }, function (err) {

                res.sendStatus(404);
            });
    }





    function createUser(req, res){
        var user=req.body;

        user.password = bcrypt.hashSync(user.password);


        if(user.role=="DELIVERYBOY"){
            UserModel
                .createUser(user)
                .then(function (reponse) {
                    UserModel.findUserByUsername(reponse.username)
                        .then(function (user) {
                            RestaurantModel
                                .addDeliveryBoy(user)
                                .then(function (response1) {
                                    res.json(user);
                        })
                }, function (err) {
                    res.sendStatus(404).send(err);
                })});

        }else{
            UserModel
                .createUser(user)
                .then(function (reponse) {
                    UserModel.findUserByUsername(reponse.username)
                        .then(function (user) {

                            req.login(user, function(err) {
                                if(err) {
                                    res.status(400).send(err);
                                } else {

                                    res.json(user);
                                }
                            });


                        }, function (err) {

                            res.sendStatus(err.code);
                        })
                }, function (err) {
                    res.sendStatus(404).send(err);
                })
        }

    };
    function findUserById(req, res) {
        var userId= req.params['uid'];

        UserModel.findUserById(userId)
            .then(function (user) {


                res.json(user);
            }, function (err) {

                res.send(err);
            })
    }

    function updateUser (req, res) {
        var userId = req.params['uid'];
        var user=req.body;
        UserModel.updateUser(userId, user)
            .then(function (user) {

                UserModel.findUserById(userId)
                    .then(function (user) {


                        res.json(user);
                    }, function (err) {

                        res.send(err);
                    })

            }, function (err) {
                res.send(err);
            })
    }

    function deleteUser (req, res) {
        var userId = req.params['uid'];
        UserModel.findUserById(userId)
            .then(function (user) {

                if(user.role=='OWNER'){
                    var resturantList=user.restaurantID;

                    resturantList.forEach(function (restId) {

                        RestaurantModel.findRestaurantById(restId)
                            .then(function (restaurantDetails) {
                                var deliveryBoyIds=restaurantDetails.deliveryBoysId;
                                var menuIds=restaurantDetails.menuId;
                                var ownerId=restaurantDetails.ownerId;


                                RestaurantModel
                                    .deleteRestaurant(restId)
                                    .then(function (response) {
                                        deliveryBoyIds.forEach(function (deliveryBoy) {
                                            UserModel.deleteUser(deliveryBoy)
                                                .then(function (response) {

                                                }, function (err) {
                                                    res.sendStatus(404);
                                                })
                                        })

                                        menuIds.forEach(function (m) {

                                            MenuModel.deleteMenuById(m)
                                                .then(function (response) {

                                                }, function (err) {

                                                    res.sendStatus(404);
                                                })
                                        })

                                        UserModel.removeRestaurentFromOwner(restId, ownerId)
                                            .then(function (response) {

                                            },function (err) {
                                                res.sendStatus(404);
                                            })


                                        res.sendStatus(200);

                                    },function (err) {
                                        res.sendStatus(err.code);

                                    });
                            }, function (err) {
                                res.sendStatus(404);
                            })


                    })

                }

                if(user.role=='DELIVERYBOY'){
                    var restaurantId=user.restaurantID;
                    RestaurantModel.removeDeliveryBoyFromRestaurant(user._id, restaurantId[0])
                        .then(function (response) {

                        }, function (err) {
                            res.sendStatus(404);
                        })

                }


                UserModel.deleteUser(userId)
                    .then(function (response) {
                        res.sendStatus(200);
                    }, function (err) {
                        res.sendStatus(err);
                    })


            }, function (err) {
                res.sendStatus(404);
            })


    }



    function findActiveDeliveryBoyByRestaurant(req,res) {
        var restaurantID = req.params['rst'];
        var activeDelBoys=[];
        RestaurantModel
            .findRestaurantById(restaurantID)
            .then(function (restaurant) {

                UserModel
                    .findUserByDeliveryboy(restaurant.deliveryBoysId)
                    .then(function (response) {
                        for (var i in response){
                            if(response[i].db_avail==1){
                                activeDelBoys.push(response[i]);
                            }

                        }
                        res.send(activeDelBoys);
                    }, function (err) {
                        res.send(err);
                    })
            });}


            function getAllOrdersForThisDeliveryBoy(req,res) {

                var userId = req.params['uid'];
                UserModel.getOrders(userId)
                    .then(function (userAndOrder) {

                        res.json(userAndOrder);
                    }, function (err) {
                        res.send(err);
                    })
            }


            function updateDeliveryAddresses(req, res) {
                var userId = req.params['uid'];
                var deliveryAddresses=req.body;
                UserModel.updateDeliveryAddresses(userId, deliveryAddresses)
                    .then(function (resp) {

                        res.sendStatus(200);
                    }, function (err) {
                        res.send(404);
                    })
            }

        function findUsers(req, res) {
            var role=req.query.role;

            UserModel.findUsers(role)
                .then(function (users) {

                    res.json(users);
                }, function (err) {
                    res.send(404);
                })
        }

        function deleteOrderFromUser(req, res) {
            var userId=req.params['uid'];
            var orderId=req.params['oid'];
            UserModel.deleteOrderFromUser(orderId, userId)
                .then(function (res) {

                    res.sendStatus(200);
                }, function (err) {
                    res.send(404);
                })
        }

        function removeRestaurentFromOwner(req, res) {
            var ownerId=req.params['uid'];
            var resId=req.params['rid'];
            UserModel.removeRestaurentFromOwner(resId, ownerId)
                .then(function (res) {

                    res.sendStatus(200);
                }, function (err) {
                    res.send(404);
                })
        }



};

