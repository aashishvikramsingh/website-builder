(function(){
    angular
        .module("ProjectMaker")
        .controller("restaurantSearchMenuController", restaurantSearchMenuController);
    function restaurantSearchMenuController(userService,restaurantService,menuService, sessionHolderService,$location, $routeParams, $timeout){


        var vm = this;
        var address=$routeParams['add'];
        var name= $routeParams['rn'];
        var restaurantId=$routeParams['rid'];
        var restaurantName=$routeParams['rname'];
        var cart=[];
        var selItems={};
        var offerPickup;
        var offerDelivery;

        vm.restaurantName=restaurantName;
        var userId;

        vm.increaseItemCount=increaseItemCount;
        vm.decreaseItemCount=decreaseItemCount;
        vm.checkOut=checkOut;
        vm.navigateBack=navigateBack;


        function init() {

            var promise=userService.findCurrentUser();
            promise.success(function (user) {
                vm.user=user;
                vm.userId = user._id;
                userId = user._id;



                var promise=restaurantService.findRestaurantById(restaurantId);
            promise.success(function (restDetails) {



                vm.logoUrl=restDetails.logoUrl;
                vm.address=restDetails.streetAddress+' '+restDetails.city+' '+restDetails.state;
                vm.name=restDetails.name;
                offerDelivery=restDetails.offersDelivery;
                offerPickup=restDetails.offersPickup;

                vm.partner=restDetails.partner;

                if(restDetails.partner){


                        var promise = menuService.findMenuByRestaurantId(restDetails._id);
                        promise.success(function (menu) {

                            var groups = {};
                            for (var i = 0; i < menu.length; i++) {
                                var groupName = menu[i].category;
                                if (!groups[groupName]) {
                                    groups[groupName] = [];
                                }
                                groups[groupName].push([menu[i].itemName,menu[i].price,menu[i]._id]);
                            }
                            myArray = [];
                            for (var groupName in groups) {
                                myArray.push({group: groupName, entry: groups[groupName]});
                            }

                            vm.result = myArray;

                            vm.menu = menu;

                        }).error(function (err) {

                        })
                }
                else{

                    searchMenuForThisRestaurant();
                }



            }).error(function (err) {
                vm.error="Unable to load menu for this restaurant";
                $timeout(clearError, 3000);
            })
            }).error(function (err) {

            });








        }
        init();

        function searchMenuForThisRestaurant () {


            var promise = restaurantService.getRestaurantKeys()
            promise.success(function (keys) {

                var promise = restaurantService.searchMenu(keys,restaurantId);
                promise
                    .success(function (response) {

                        vm.menu=response;

                    }).error(function (err) {

                })
            })

        }

        function increaseItemCount( itemKey,   itemName, price) {

            var flag=0;
            var count;
            for (var i in cart){
                if (cart[i].itemId == itemKey){
                    cart[i].totCount+=1;
                    count=cart[i].totCount;

                    flag=1;
                }

            }

            if(flag==0){
                selItems={

                    itemId: itemKey,
                    name: itemName,
                    basePrice: price,
                    totCount: 1
                }
                count=1;


                cart.push(selItems);
            }

            angular.element(document.querySelector("#count-"+itemKey)).html(count);

        }
        
        function decreaseItemCount( itemKey,  name, basePrice) {

            var count;
            for (var i in cart){
                if (cart[i].itemId == itemKey){
                    if(cart[i].totCount >0)
                    cart[i].totCount-=1;
                    count=cart[i].totCount;

                    if(cart[i].totCount ==0){
                        cart.splice(i,1);
                        count='';

                    }
                }

            }
            angular.element(document.querySelector("#count-"+itemKey)).html(count);

        }

        function checkOut() {


            if(userId && (offerPickup || offerDelivery)){
                if (cart.length > 0){
                    var cartDetails={
                        rId: restaurantId,
                        rName: restaurantName,
                        items:cart
                    }

                    sessionHolderService.setCart(cartDetails);
                    $location.url(navigationPreffix()+'/restaurant/'+restaurantId+'/'+restaurantName+'/menu/cart')


                }

                else {
                    vm.error="Please select Dishes first";
                    $timeout(clearError, 3000);

                }
            }

            else{
                if(userId){
                    vm.error="No Delivery or Pickup service available at this restaurant";

                }

                else
                    {
                    vm.error="Please Login to proceed with payment";
                }





                $timeout(clearError, 10000);
            }




        }

        function clearError() {
            vm.error="";
        }


        function navigateBack() {
         $location.url(navigationPreffix());
        }

        function navigationPreffix() {
            if(userId){

                if(name){
                    return ('/user/searchResult/name/'+name+'/address/'+address);
                }
                else{
                    return ('/user/searchResult/address/'+address);
                }

            }else{

                if(name){
                    return ('/searchResult/name/'+name+'/address/'+address);
                }
                else{
                   return ('/searchResult/address/'+address);
                }
            }
        }

    }
})();



