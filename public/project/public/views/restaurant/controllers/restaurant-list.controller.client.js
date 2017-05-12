
(function () {
    angular
        .module("ProjectMaker")
        .controller("restaurantListController", restaurantListController);

    function restaurantListController($location,$routeParams, restaurantService,userService) {
        var vm = this;
        vm.gotoEdit =gotoEdit;
        vm.gotoOrder = gotoOrder;
        vm.gotoMenu = gotoMenu;
        vm.gotoDeliveryBoy = gotoDeliveryBoy;

         var ownerId;

        vm.logout = logout;


        function init() {
            var promise=userService.findCurrentUser();
            promise.success(function (user) {
                vm.user=user;
                vm.userId = user._id;
                ownerId = user._id;


                restaurantService
                .findRestaurantByOwner(ownerId)
                .success(function (restaurants) {
                    vm.restaurants = restaurants;

                })}).error(function (err) {

            });
        }
        init();
        function gotoMenu(restId) {
            userService
                .setRestaurantId(restId)
                .then(function () {
                    $location.url('/user/restaurant/menu');
                })


        }
        function gotoDeliveryBoy(restId) {
            userService
                .setRestaurantId(restId)
                .then(function () {
                    $location.url('/user/restaurant/db');
                })

        }

        function gotoOrder(restId) {

            userService
                .setRestaurantId(restId)
                .then(function () {
                    $location.url('/user/restaurant/order');
                })
        }


        function gotoEdit(restId) {

            userService
                .setRestaurantId(restId)
                .then(function () {
                    $location.url('/user/restaurant/edit');
                })




        }


        function logout() {

            userService
                .logout()
                .then(function () {
                    $location.url('/home');
                });
        }

    }
})();