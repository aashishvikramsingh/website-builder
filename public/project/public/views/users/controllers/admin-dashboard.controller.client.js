(function () {
    angular.module('ProjectMaker')
        .controller('adminDashboardController', adminDashboardController);

    function adminDashboardController ($location, userService, restaurantService, orderTrackService) {
        var vm = this;
        vm.currActivePaneIfUser='';
        var test=10;
        var state=0;
        vm.mode='console';
        vm.findUsers=findUsers;
        vm.findRestaurants=findRestaurants;
        vm.findOrders=findOrders;
        vm.adminDashBoard=adminDashBoard;
        vm.deleteOrder=deleteOrder;
        vm.deleteRestaurant=deleteRestaurant;
        vm.deleteUser=deleteUser;
        vm.updateUser = updateUser;
        vm.logout = logout;
        vm.hamOpenNav=hamOpenNav;
        vm.closeNav=closeNav;
        vm.openNav=openNav;
        // vm.refresh  = refresh;

        function init() {


            findUsers('ALLUSERS');




        }init();

        function logout() {
            userService
                .logout()
                .then(function () {
                    $location.url('/home');
                });
        }
        var $li = $('#categories li').click(function() {
            $li.removeClass('active');
            $(this).addClass('active');
        });


        function findUsers(role) {
            vm.mode='users';
            vm.currActivePaneIfUser=role;
            var promise=userService.findUsers(role);
            promise.success(function (users) {

                vm.data=users;
            }).error(function (err) {

            })
            if(role=='ALLUSERS'){

            }else {
                closeNav();
            }


        }


        // function refresh() {
        //     init();
        //     closeNav();
        // }

        function findRestaurants() {
            vm.mode='restaurants';
            var promise=restaurantService.findRestaurant();
            promise.success(function (restaurants) {
                vm.data=restaurants;
            }).error(function (err) {

            })
            closeNav();
        }

        function findOrders() {
            vm.mode='orders';
            var promise=orderTrackService.findOrders();
            promise.success(function (orders) {
                vm.data=orders;
            }).error(function (err) {

            })
            closeNav();
        }


        function adminDashBoard() {

           findUsers('ALLUSERS');

            vm.mode='console';



            var chart = new CanvasJS.Chart("chartContainer",
                {
                    title: {
                        text: "Total Customers On Board"
                    },
                    legend: {
                        maxWidth: 350,
                        itemWidth: 120
                    },
                    data: [
                        {
                            type: "pie",
                            showInLegend: true,
                            legendText: "{indexLabel}",
                            dataPoints: [
                                {y: test, indexLabel: "Consumers"},
                                {y: 2175498, indexLabel: "Restaurant Owners"},
                                {y: 3125844, indexLabel: "Delivery Boys"}
                            ]
                        }
                    ]
                });

            chart.render();

    }


        function updateUser(userId){

            $location.url("/admin/edit/"+userId);
        }

        function deleteUser(userId) {
            var promise=userService.deleteUser(userId);
            promise.success(function (res) {
                findUsers(vm.currActivePaneIfUser);
            }).error(function (err) {
                vm.error='Unable to delete the order';
            })
        }

        function deleteOrder(orderId) {
            var promise=orderTrackService.deleteOrder(orderId);
            promise.success(function (res) {
                findOrders();
            }).error(function (err) {
                vm.error='Unable to delete the order';
            })
        }

        function deleteRestaurant(resId) {
            var promise=restaurantService.deleteRestaurant(resId);
            promise.success(function (res) {
                findRestaurants();
            }).error(function (err) {
                vm.error='Unable to delete the order';
            })
        }

        function hamOpenNav() {
            if (state==0){
                state = 1;
                document.getElementById("mySidenav").style.width = "250px";
            }

            else {
                state=0;
                closeNav();

            }

        }

        function openNav() {

            document.getElementById("mySidenav").style.width = "250px";
            state=1;

        }

        function closeNav() {
            document.getElementById("mySidenav").style.width = "0";
            state=0;
        }


    }
})();

