(function(){
    angular
        .module("ProjectMaker")
        .controller("restaurantOrderTrackController", restaurantOrderTrackController);

    function restaurantOrderTrackController(orderTrackService,userService,restaurantService, $location, $routeParams, $timeout){
        var state=0;
        var vm =this;
        var userId;
        var scheduledOrder=[];
        var notScheduled=[];
        var delivered=[];
        var notDelivered=[];
        vm.scheduled=[];
        vm.notscheduled=[];
        vm.delivered=[];
        vm.notDelivered=[];
        vm.getScheduled=getScheduled;
        vm.getNotScheduled=getNotScheduled;
        vm.refresh=refresh;
        vm.assignDelivery=assignDelivery;
        vm.gotoDeliveryBoy = gotoDeliveryBoy;
        vm.openNav=openNav;
        vm.closeNav=closeNav;
        vm.hamOpenNav=hamOpenNav;

        function init() {

            var dbNameAvail=[];
            vm.scheduled=[];
            scheduledOrder=[];
            vm.notScheduled=[];
            notScheduled=[];
            vm.delivered=[];
            delivered=[];
            vm.orders=[];
            vm.delBoys=[];
            delBoys=[];
            vm.db=[];
            dbNameAvail=[];


            var promise=userService.findCurrentUser();
            promise.success(function (user) {
                vm.user=user;
                vm.userId = user._id;
                userId = user._id;

                userService
                    .getRestaurantId()
                    .success(function (restaurantId) {
                        vm.restaurantId = restaurantId;
                        restaurantId=restaurantId.replace(/"/g,'');




                        var promise=orderTrackService.findOrdersForThisRestaurant(restaurantId);
                        promise.success(function (restOrders) {
                            if (restOrders.length>0){

                                vm.orders=restOrders[0].orderId;




                                for (var o in restOrders[0].orderId){
                                    if(restOrders[0].orderId[o].scheduled && restOrders[0].orderId[o].delivered==false ){

                                        scheduledOrder.push(restOrders[0].orderId[o]);
                                    }
                                    if(restOrders[0].orderId[o].scheduled == false){
                                        notScheduled.push(restOrders[0].orderId[o]);
                                    }

                                    if(restOrders[0].orderId[o].delivered){
                                        delivered.push(restOrders[0].orderId[o]);

                                    }




                                }
                                vm.scheduled=scheduledOrder;
                                vm.notScheduled=notScheduled;
                                vm.delivered=delivered;






                                var promise=userService.findActiveDeliveryBoyByRestaurant(restaurantId);
                                promise.success(function (delBoys) {

                                    for(var rec in delBoys){

                                        dbNameAvail.push(delBoys[rec].firstName+' '+delBoys[rec].lastName);

                                    }
                                    vm.delBoys=delBoys;
                                    vm.db=dbNameAvail;

                                }).error(function (err) {
                                    throwError("Unable to fetch delivery Boys");
                                })


                            }

                            else {
                                vm.message='No orders till now'
                            }

                        }).error(function (err) {
                            throwError("Unable to find orders");
                        }).error(function (err) {

                        })})})
        }init();

        function gotoDeliveryBoy(restId) {

            $location.url('/user/restaurant/db');


        }

        function assignDelivery (order) {

            if(order.dbName){
                for (var boy in vm.delBoys){
                    if ((vm.delBoys[boy].firstName+' '+vm.delBoys[boy].lastName)==order.dbName){
                        order.dbId=vm.delBoys[boy]._id;
                    }
                }

                var promise=orderTrackService.assignDelivery(order);
                promise.success(function (res) {
                    order.scheduled=true;
                    refresh();
                }).error(function (err) {
                    vm.error="Unable to assign "+order._id+" to "+order.dbName;
                })
            }
            else {
                throwError("select a delivery boy");
            }





        }

        function getScheduled() {

            vm.orders=scheduledOrder;

        }

        function getNotScheduled() {
            vm.orders=notScheduled;

        }


        function throwError(errorMsg){
            vm.error=errorMsg;


            $timeout(clearError, 10000);
        }

        function clearError() {
            vm.error='';
        }

        function refresh() {
            init();
            closeNav();
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



