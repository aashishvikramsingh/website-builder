(function(){
    angular
        .module("ProjectMaker")
        .controller("checkOutController", checkOutController);

    function checkOutController(checkOutService,userService,sessionHolderService,$location, $routeParams, $timeout, addressAPISearchService){


        var vm = this;
        var address=$routeParams['add'];
        var name= $routeParams['rn'];
        var restaurantId=$routeParams['rid'];
        var restaurantName=$routeParams['rname'];
        vm.backPath='';
        vm.restaurantName=restaurantName;
        vm.countries=['United States'];
        vm.states=["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",];
        vm.deliveryAddresses=[];
        vm.newAddress='';
        vm.newCity='';
        vm.newState='';



        vm.loadAddressFromAPI=loadAddressFromAPI;
        vm.populateCityAndStateIfDlSel=populateCityAndStateIfDlSel;
        vm.navigateToUserOrderPage=navigateToUserOrderPage;

        var CheckOutDetails;
        var calculatedBasket;
        var cart={
            restaurantId:'',
            userId:'',
            userFullName:'',
            deliverAddress:'',
            items:[],
            totalAmount:'',
            restName:'',


        }



        vm.purchase=purchase;


        var userId;

        function init() {
            var promise=userService.findCurrentUser();
            promise.success(function (user) {
                vm.user = user;
                vm.userId = user._id;
                userId = user._id;


                checkOutDetails = sessionHolderService.getCart();
                calculatedBasket = checkOutService.calculateTotalCost(checkOutDetails);
                vm.cart = calculatedBasket;
                vm.cart.userId = vm.userId;
                var promise = userService.findUserByID(vm.userId);
                promise.success(function (userObj) {
                    vm.deliveryAddresses = userObj.deliverAddress;
                    vm.deliveryAddresses.splice(0, 0, userObj.address + ' ' + userObj.city + ' ' + userObj.state);
                    vm.selectedAddress = userObj.address + ' ' + userObj.city + ' ' + userObj.state;
                    vm.user = userObj;

                }, function (err) {
                    outputMsg("ERROR", "Unable to fetch your Details");
                    navigateToUserOrderPage();
                }).error(function (err) {

                });



        });}
        init();

        function loadAddressFromAPI() {

            if(vm.newAddress){
                var formattedSpace=vm.newAddress.replace(/\s+/g,'+');
                var formatedSpaceAndPound=formattedSpace.replace(/#/g, '%23');

                var promise=addressAPISearchService.autoCompleteAddress(formatedSpaceAndPound);
                promise.success(function (addr) {
                    vm.addressFromAPI=addr.suggestions;


                }).error(function (err) {
                    vm.error=err;
                })
            }

        }

        function populateCityAndStateIfDlSel() {

            if (vm.addressFromAPI){
                var cityAndState=vm.addressFromAPI[0].text.split(', ')[1].split(' ');
                vm.newCity=cityAndState[0];
                vm.newState=cityAndState[1];


            }

            else{
                vm.newCity='';
                vm.newState='';
            }


        }

        function purchase() {

            cart.restaurantId=vm.cart.rId;
            cart.userId=vm.cart.userId;
            cart.totalAmount=parseInt(vm.cart.amount);
            cart.restName=restaurantName;
            cart.items=[];
            cart.restName=vm.cart.rName;
            cart.items=vm.cart.items;
            cart.userFullName=vm.user.firstName+' '+vm.user.lastName;

            if(vm.address == "Existing"){
                cart.deliverAddress=vm.selectedAddress;


            }
            else if (vm.address == "New"){
                vm.deliveryAddresses.splice(0,1);
                vm.deliveryAddresses.push(vm.newAddress+' '+vm.newCity+' '+vm.newState);
                cart.deliverAddress=vm.newAddress+' '+vm.newCity+' '+vm.newState;
                userService.updateDeliveryAddresses(vm.userId,vm.deliveryAddresses)
                    .success(function () {

                    }).error(function () {

                })

            }
            else{
                cart.deliverAddress=vm.deliveryAddresses[0];
            }


            var promise=checkOutService.createOrder(cart);
            promise.success(function (order) {
                outputMsg('SUCCESS','Your order has been successfully placed');

                navigateToUserOrderPage();
            }).error(function (err) {
                outputMsg("ERROR","We are unable to process your Order currently, sorry for inconvenience");
                navigateToUserOrderPage();

            })

        }

        function navigateToUserOrderPage() {
            if (name && address){
                $location.url("/user/orders");
            }
            else {
                $location.url("/user/orders");
            }
        }

        function outputMsg(msgType, msg){
            if(msgType=='SUCCESS'){
                vm.message=msg;
            }
            else{
                vm.error=msg;
            }


            $timeout(clearError, 10000);
        }

        function clearError() {
            vm.error='';
            vm.message='';
        }


    }
})();



