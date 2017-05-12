(function(){
    angular
        .module("ProjectMaker")
        .controller("homeController", homeController);
    function homeController(userService, SearchService, $location, $routeParams, addressAPISearchService){


        var vm = this;

        var userId;

        vm.findRestaurant=findRestaurant;
        vm.loadAddressFromAPI=loadAddressFromAPI;
        vm.logout = logout;

        vm.userLoggedIn = false;
        vm.userLoggedOut = true;
        function init() {
            vm.error="";
            CheckLoggedIn();
            var promise=userService.findCurrentUser();
            promise.success(function (user) {
                vm.user=user;
                vm.userId = user._id;
                userId = user._id;
                CheckLoggedIn();
            }).error(function (err) {

            });



        }

        init();


        function CheckLoggedIn() {
            if(userId){
                vm.userId = userId;
                vm.userLoggedIn = true;
                vm.userLoggedOut = false;
            }else{
                vm.userLoggedIn = false;
                vm.userLoggedOut = true;
            }
        }



        function loadAddressFromAPI(addressTextSoFar) {
            var formattedSpace=vm.search.address.replace(/\s+/g,'+');
            var formatedSpaceAndPound=formattedSpace.replace(/#/g, '%23');

            var promise = addressAPISearchService.getAuthkeys();
            promise.success(function (keys) {

                var promise=addressAPISearchService.autoCompleteAddress(keys,formatedSpaceAndPound);
                promise.success(function (addr) {
                    vm.addressFromAPI=addr.suggestions;

                }).error(function (err) {
                    vm.error=err;
                })

            });

        }



        function logout() {
            userService
                .logout()
                .then(function () {
                    $location.url('/home');
                });
        }


        function findRestaurant (restaurant) {
            if(restaurant) {


                if (userId && restaurant.name && restaurant.city && restaurant.address) {
                    restaurant.address += restaurant.city
                    $location.url('/user/searchResult/name/' + restaurant.name + '/address/' + restaurant.address);
                }

                else if (userId && restaurant.city && restaurant.name) {
                    $location.url('/user/searchResult/name/' + restaurant.name + '/address/' + restaurant.city);

                }

                else if (userId && restaurant.city) {

                    $location.url('/user/searchResult/address/' + restaurant.city);
                }

                else if (userId && restaurant.address && restaurant.name) {
                    $location.url('/user/searchResult/name/' + restaurant.name + '/address/' + restaurant.address);
                }

                else if (userId && restaurant.address) {
                    $location.url('/user/searchResult/address/' + restaurant.address);
                }



                else if (restaurant.name && restaurant.city && restaurant.address){
                    restaurant.address+=restaurant.city
                    $location.url('/searchResult/name/'+restaurant.name+'/address/'+restaurant.address);
                }

                else if (restaurant.city && restaurant.name){
                    $location.url('/searchResult/name/'+restaurant.name+'/address/'+restaurant.city);

                }

                else if(restaurant.address && restaurant.name){
                    $location.url('/searchResult/name/'+restaurant.name+'/address/'+restaurant.address);
                }


                else if(restaurant.address){
                    $location.url('/searchResult/address/'+restaurant.address);
                }


                else if(restaurant.city){

                    $location.url('/searchResult/address/'+restaurant.city);
                }




                else {
                    vm.error = "Please enter the City.";
                }




            }
            else {
                vm.error="Please enter the City and Restaurant.";
            }



        }


    }
})();



