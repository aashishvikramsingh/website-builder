(function (){
    angular
        .module("ProjectMaker")
        .controller("newMenuController",newMenuController);

    function newMenuController($routeParams,menuService,userService, $location){
        var vm = this;
        var userId //= $routeParams['uid'];
        var menu;
        vm.menu='';


        vm.createMenu = createMenu;
        var restaurantId;

        function init() {


            var promise=userService.findCurrentUser();
            promise.success(function (user) {
                vm.user=user;
                vm.userId = user._id;
                userId = user._id;}).error(function () {

                userService
                    .getRestaurantId()
                    .success(function (restaurantId) {
                        vm.restaurantId = restaurantId;
                        restaurantId = restaurantId.replace(/"/g, '');

                    });

            })


        }
        init();

        function createMenu(menu) {
            userService
                .getRestaurantId()
                .success(function (restaurantId) {
                    vm.restaurantId = restaurantId;
                    restaurantId = restaurantId.replace(/"/g, '');


                    menu.restaurantId = restaurantId;


                    menuService
                        .createMenu(menu)
                        .success(function (res) {
                            $location.url("/user/restaurant/menu");
                        }).error(function (err) {

                    });})

        }
    }})();

