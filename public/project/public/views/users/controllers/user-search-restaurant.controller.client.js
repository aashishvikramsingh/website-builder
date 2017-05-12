(function(){
    angular
        .module("ProjectMaker")
        .controller("searchResultController", searchResultController);
    function searchResultController(userService,  restaurantService,addressAPISearchService, $location, $routeParams, $timeout, $filter){


        var vm = this;
        var address=$routeParams['add'];
        var name= $routeParams['rn'];
        var allResturants=[];
        var apiResturants=[];
        var backupRetrievedResturants=[];
        vm.restaurants=[];
        vm.restaurantFound=false;

        var weekday = new Array(7);
        weekday[0] =  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";


        vm.search={
            name: name,
            address: address
        };



        vm.searchRestaurant=searchRestaurant;
        vm.sortAtoZ=sortAtoZ;
        vm.viewMenu=viewMenu;
        vm.searchOpenRestaurant=searchOpenRestaurant;
        vm.navigateToProfile=navigateToProfile;
        vm.searchRestaurantsOfferingPickup=searchRestaurantsOfferingPickup;
        vm.searchRestaurantsOfferingDelivery=searchRestaurantsOfferingDelivery;
        vm.fetchPartnerResturants=fetchPartnerResturants;
        vm.loadAddressFromAPI=loadAddressFromAPI;
        vm.autocompleteSearchRestaurants=autocompleteSearchRestaurants;
        vm.displaySearchedRestaurantFromAutoCompleteList=displaySearchedRestaurantFromAutoCompleteList;

        function init() {

            var promise=userService.findCurrentUser();
            promise.success(function (user) {
                vm.user=user;
                vm.userId = user._id;
                userId = user._id;
            }).error(function (err) {

            });


            fetchPartnerResturants(vm.search);
            searchAPIRestaurants(vm.search);





            $(document).ready(function () {
                setTimeout(function () {
                    $('#mainCOntainer').show(500);
                }, 2000);
            })






        }
        init();






        function searchRestaurant(searchRestaurants){

            if(searchRestaurants.address){
                var refToNewResturant=[];
                var tokensWithoutNamereference=$location.url().split('/name/');
                if(tokensWithoutNamereference.length>1){
                    if (searchRestaurants.name){
                        refToNewResturant=tokensWithoutNamereference[0]+'/name/'+searchRestaurants.name+'/address/'+searchRestaurants.address;
                    }
                    else{
                        refToNewResturant=tokensWithoutNamereference[0]+'/address/'+searchRestaurants.address;
                    }
                }

                else{
                    var tokensWithoutAddressreference= $location.url().split('/address/');
                    if (searchRestaurants.name){
                        refToNewResturant=tokensWithoutAddressreference[0]+'/name/'+searchRestaurants.name+'/address/'+searchRestaurants.address;
                    }
                    else{
                        refToNewResturant=tokensWithoutAddressreference[0]+'/address/'+searchRestaurants.address;
                    }
                }

                $location.url(refToNewResturant);
            }

            else{
                throwError("Location field cannot be blank");
            }



        }




        function fetchPartnerResturants(search) {

            var promise=restaurantService.findAllPartnerResturantsInThisLocation(search);
            promise.success(function (partnerResturantsList) {



                    var todayDate=new Date();
                    var todayDay=weekday[todayDate.getDay()];


                    for (var r in partnerResturantsList){

                        if (partnerResturantsList[r].hours[todayDay].length <= 0) {
                            partnerResturantsList[r].open = false;

                        } else {
                            var data = partnerResturantsList[r].hours[todayDay];
                            var startDateAndTime=new Date();
                            startDateAndTime.setHours(data[1]);
                            startDateAndTime.setMinutes(data[2]);
                            startDateAndTime.setMilliseconds(0);

                            var closeDateAndTime=new Date();
                            closeDateAndTime.setHours(data[3]);
                            closeDateAndTime.setMinutes(data[4]);
                            closeDateAndTime.setMilliseconds(0);

                            var currentDateAndTime=new Date();





                            if (startDateAndTime.getTime() < currentDateAndTime.getTime() &&
                                closeDateAndTime.getTime()>currentDateAndTime.getTime()) {
                                partnerResturantsList[r].open = true;
                            }
                            else {
                                partnerResturantsList[r].open = false;
                            }



                        }
                        partnerResturantsList[r].apiKey = '';
                        partnerResturantsList[r].apiKey = partnerResturantsList[r]._id;
                    }

                    allResturants=partnerResturantsList;






            }).error(function (err) {

            })


        }


        function searchAPIRestaurants(search) {
            if (search.address){

                var promise = restaurantService.getRestaurantKeys()
                promise.success(function (keys) {

                    var promise = restaurantService.searchRestaurant(keys,search.name, search.address);
                    promise
                        .success(function (response) {

                            formatData(response.restaurants);

                        }).error(function (err) {

                    })
                })

            }
            else{
                throwError('Please enter location.');
                // $location.url("/");
            }
        }




        function formatData(restaurants) {
            apiResturants = restaurants;
            for (var i=0; i < apiResturants.length ; i++){

                var res="";
                for(var j=0; j < apiResturants[i].foodTypes.length ; j++){
                    res = res + apiResturants[i].foodTypes[j] + " ";
                }
                apiResturants[i].cuisine = res;
            }

            for (var i in apiResturants){
                allResturants.push(apiResturants[i]);

            }
             vm.restaurants= allResturants;
            backupRetrievedResturants=allResturants;

            if (vm.restaurants.length == 0){
                vm.restaurantFound=false;
            }
            else{
                vm.restaurantFound=true;
            }




        }

        function viewMenu (apiKey, resturantObject) {
            var restaurantName=resturantObject.name.replace(/#/g,'-');

            var resturantDetails={
                _id:apiKey,
                name:restaurantName,
                logoUrl: resturantObject.logoUrl,
                streetAddress:resturantObject.streetAddress,
                city:resturantObject.city,
                state:resturantObject.state,
                country:resturantObject.country,
                offersDelivery: resturantObject.offersDelivery,
                offersPickup:resturantObject.offersPickup,
                open:resturantObject.open

            };





            if(resturantObject.partner){
                if(userId && name){
                    $location.url('/user/searchResult/name/'+name+'/address/'+address+'/restaurant/'+apiKey+'/'+restaurantName+'/menu');
                }
                else if(userId){
                    $location.url('/user/searchResult/address/'+address+'/restaurant/'+apiKey+'/'+restaurantName+'/menu');
                }
                else if(name && address){
                    $location.url('/searchResult/name/'+name+'/address/'+address+'/restaurant/'+apiKey+'/'+restaurantName+'/menu');
                }

                else{
                    $location.url('/searchResult/address/'+address+'/restaurant/'+apiKey+'/'+restaurantName+'/menu');
                }
            }
            else{

                var promise=restaurantService.createAPIResturantIfNotExist(resturantDetails);
                promise.success(function (resp) {



                    if(userId && name){
                        $location.url('/user/searchResult/name/'+name+'/address/'+address+'/restaurant/'+apiKey+'/'+restaurantName+'/menu');
                    }
                    else if(userId){
                        $location.url('/user/searchResult/address/'+address+'/restaurant/'+apiKey+'/'+restaurantName+'/menu');
                    }
                    else if(name && address){
                        $location.url('/searchResult/name/'+name+'/address/'+address+'/restaurant/'+apiKey+'/'+restaurantName+'/menu');
                    }

                    else{
                        $location.url('/searchResult/address/'+address+'/restaurant/'+apiKey+'/'+restaurantName+'/menu');
                    }

                }).error(function (err) {


                    throwError("We are unable to fetch Menu for this restaurant right now");
                })




            }




        }




        function navigateToProfile() {
            if (userId){
                $location.url("/user/profiel");
            }
            else{
                $location.url("/login");
            }
        }

        function throwError(errorMsg){
            vm.error=errorMsg;


            $timeout(clearError,5000);
        }

        function clearError() {
            vm.error='';
        }

        function sortAtoZ(way) {
            vm.restaurants=backupRetrievedResturants;
            vm.restaurants=$filter('orderBy')(vm.restaurants, 'name', way);

        }

        function searchOpenRestaurant(criteria) {
            vm.restaurants=backupRetrievedResturants;
            vm.restaurants=$filter('filter')(vm.restaurants, {open: criteria});
            restaurantsFoundInSearch();

        }

        function searchRestaurantsOfferingPickup(criteria) {
            vm.restaurants=backupRetrievedResturants;
            vm.restaurants=$filter('filter')(vm.restaurants, {offersPickup: criteria});
            restaurantsFoundInSearch();
        }

        function searchRestaurantsOfferingDelivery(criteria) {
            vm.restaurants=backupRetrievedResturants;
            vm.restaurants=$filter('filter')(vm.restaurants, {offersDelivery: criteria});
            restaurantsFoundInSearch();
        }

        function restaurantsFoundInSearch() {
            if (vm.restaurants.length == 0){
                vm.restaurantFound=false;
            }
            else{
                vm.restaurantFound=true;
            }
        }



        function autocompleteSearchRestaurants() {
            vm.restaurants=backupRetrievedResturants;
            var availableRestaurants = vm.restaurants.map(function(obj) {return obj.name;});
            $( "#restaurantsAutoComplete" ).autocomplete({
                source: availableRestaurants
            });
        }


        function displaySearchedRestaurantFromAutoCompleteList(restObj){
            vm.restaurants=backupRetrievedResturants;
            vm.restaurants=$filter('filter')(vm.restaurants, {name: restObj});
            restaurantsFoundInSearch();
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


    }
})();



