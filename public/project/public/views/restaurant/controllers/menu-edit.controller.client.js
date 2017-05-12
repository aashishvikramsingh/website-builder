
(function (){
    angular
        .module("ProjectMaker")
        .controller("editMenuController",editMenuController);

    function editMenuController($routeParams,menuService,userService, $location) {
        var vm  = this;

        var userId; //= $routeParams['uid'];
        var restaurantId; //= $routeParams['rst'];
        var menuid;// = $routeParams['mid'];
        var catname = $routeParams['catname'];
        vm.catname = catname;

        vm.updateMenuItem = updateMenuItem;
        vm.updateMenuCategory = updateMenuCategory;
        vm.deleteMenuItem = deleteMenuItem;
        vm.deleteMenuCategory = deleteMenuCategory;



        function init(){

            var promise=userService.findCurrentUser();
            promise.success(function (user) {
                vm.user = user;
                vm.userId = user._id;
                userId = user._id;


                userService
                    .getRestaurantId()
                    .success(function (restaurantId) {
                        vm.restaurantId = restaurantId;
                        restaurantId = restaurantId.replace(/"/g, '');


                        menuService
                            .getMenuId()
                            .success(function (menuid) {
                                vm.menuid = menuid;
                                menuid = menuid.replace(/"/g, '');


                                if (menuid) {
                                    menuService
                                        .findMenuById(menuid)
                                        .success(function (menu) {

                                            vm.menu = menu;

                                        });
                                }

                            });
                    });
            });
        }
        init();




        function updateMenuItem(menu) {
            menuService
                .getMenuId()
                .success(function (menuid) {
                    vm.menuid = menuid;
                    menuid = menuid.replace(/"/g, '');
                    menuService
                        .updateMenuItem(menu, menuid)
                        .success(function (menuf) {
                            $location.url("/user/restaurant/menu");
                        }).error(function (err) {
                    });

                });
        }

        function updateMenuCategory(menucat) {
            menucat.catname = catname;

            menuService
                .updateMenuCategory(menucat,restaurantId)
                .success(function (reponse) {
                    $location.url("/user/restaurant/menu");
                }).error(function (err) {
            });

        }

        function deleteMenuItem(menu) {

            menuService
                .getMenuId()
                .success(function (menuid) {
                    vm.menuid = menuid;
                    menuid = menuid.replace(/"/g, '');

                    menuService
                        .deleteMenuById(menuid)
                        .success(function (response) {
                            $location.url("/user/restaurant/menu");
                        }).error(function (err) {

                    });});
        }


        function deleteMenuCategory(catname) {
            var menu = {};
            menu.catname = catname;
            menuService
                .deleteMenuCategory(menu,restaurantId)
                .success(function (response) {
                    $location.url("/user/restaurant/menu");
                }).error(function (err) {

            });
        }

    }})();