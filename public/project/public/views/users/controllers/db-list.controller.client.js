
(function (){
    angular.module('ProjectMaker')
        .controller('deliveryBoyListController', deliveryBoyListController);

    function deliveryBoyListController ($location, userService, $timeout, $routeParams) {
        var vm = this;

        var restaurantId;// = $routeParams.rst;
        vm.editdb = editdb;
        function init() {


            userService
                .getRestaurantId()
                .success(function (restaurantId) {
                    vm.restaurantId = restaurantId;
                    restaurantId = restaurantId.replace(/"/g, '');


                    userService
                        .findDeliveryBoyByRestaurant(restaurantId)
                        .success(function (dbs) {


                            vm.dbs = dbs;

                        })
                })



        }

        init();

        function editdb(dbid) {
            userService
                .setDBId(dbid)
                .then(function () {
                    $location.url('/user/restaurant/editdb');
                })


        }

    }
    }) ();
