(function (){
    angular.module('ProjectMaker')
        .controller('userOrderController', userOrderController);

    function userOrderController ( $routeParams, userService, $location) {

        var vm = this;
        var userId;
        var state=0;
        vm.refresh=refresh;

        vm.openNav=openNav;
        vm.closeNav=closeNav;
        vm.hamOpenNav=hamOpenNav;


        vm.logout = logout;

        function init () {
            vm.orders=[];

            var promise=userService.findCurrentUser();
            promise.success(function (user) {
                vm.user=user;
                vm.userId = user._id;
                userId = user._id;



                var promise=userService.findAllOrdersForThisCustomer(userId);
            promise.success(function (orderList) {
                vm.orders=orderList;
                filterDeliveredandUnDeliverdOrders(vm.orders);


            }).error(function (err) {
                throwError("Unable to fetch your orders");
            })}).error(function (err) {

            });


        } init();

        function logout() {
            userService
                .logout()
                .then(function () {
                    $location.url('/home');
                });
        }
        function filterDeliveredandUnDeliverdOrders(orders) {
            var deliveredOrders=[];
            var notDelivered=[];
            vm.delivered=[];
            vm.notDelivered=[];


            for(var o in orders){
                if (orders[o].delivered){
                    deliveredOrders.push(orders[o]);
                }

                else{
                    notDelivered.push(orders[o]);
                }


            }

            vm.delivered=deliveredOrders;
            vm.notDelivered=notDelivered;

        }


        function refresh() {

            init();
            closeNav();
        }

        function throwError(errorMsg){
            vm.error=errorMsg;


            $timeout(clearError, 10000);
        }

        function clearError() {
            vm.error='';
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



    };
})();

