(function (){
    angular
        .module("ProjectMaker")
        .controller("restaurantEditController",restaurantEditController);

    function restaurantEditController($routeParams, $location, userService,addressAPISearchService , restaurantService, Upload, $timeout){
        var vm = this;
        var ownerId; //= $routeParams.uid;

        var restaurantId;
        vm.hours=["HH","00","01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12","13", "14", "15", "16", "17", "18", "19", "20", "21", "22","23"];
        vm.mins=["MM","00","15","30","45"];
        vm.city=["Boston", "Newyork"];
        vm.country=["United States"];
        vm.booleanVal=['No','Yes'];
        vm.speciality=[];
        vm.days=[];
        vm.count=0;

        vm.updateRestaurant = updateRestaurant;
        vm.deleteRestaurant=deleteRestaurant;
        vm.addNewSpeciality=addNewSpeciality;
        vm.deleteSpeciality=deleteSpeciality;
        vm.uploadImage=uploadImage;
        vm.loadAddressFromAPI=loadAddressFromAPI;
        vm.populateCityAndStateIfDlSel=populateCityAndStateIfDlSel;
        vm.states=["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",];



        function init() {





            var promise=userService.findCurrentUser();
            promise.success(function (user) {
                vm.user=user;
                vm.userId = user._id;
                ownerId = user._id;
                vm.ownerId = ownerId;

                userService
                    .getRestaurantId()
                    .success(function (restaurantId) {
                        vm.restaurantId = restaurantId;
                        restaurantId=restaurantId.replace(/"/g,'');


                restaurantService
                .findRestaurantById(restaurantId)
                .success(function (restaurant) {

                    vm.restaurant = restaurant;



                    for (var s in restaurant.foodTypes){
                        ++vm.count;
                        var newObj={
                            key:vm.count,
                            value:restaurant.foodTypes[s]
                        };
                        vm.speciality.push(newObj);

                    }


                    setDeliveryandPickupforModel();
                    vm.file=restaurant.logoUrl;



                }).error(function (err) {
                throwError('Unable to fetch restaurant Information');
            }).error(function (err) {

                });});
        })}
        init();


        function loadAddressFromAPI() {

            if(vm.restaurant.streetAddress){
                var formattedSpace=vm.restaurant.streetAddress.replace(/\s+/g,'+');
                var formatedSpaceAndPound=formattedSpace.replace(/#/g, '%23');

                var promise = addressAPISearchService.getAuthkeys()
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

        function populateCityAndStateIfDlSel() {

            if (vm.addressFromAPI){
                var cityAndState=vm.addressFromAPI[0].text.split(', ')[1].split(' ');
                vm.restaurant.city=cityAndState[0];
                vm.restaurant.state=cityAndState[1];

            }

            else{
                vm.restaurant.city='';
                vm.restaurant.state='';
            }


        }


        function updateRestaurant(restaurant) {

            var errors=[];
            var error='';


            if(restaurant){

                restaurant=formatTiming(restaurant);

                restaurant.foodTypes=[];
                restaurant=setFoodTypes(restaurant);
                restaurant=setDeliveryAndPickupFlag(restaurant);
                restaurant.ownerId = ownerId;
                restaurant.logoUrl=vm.url;


                if(!restaurant.name){
                    error="Invalid Restaurant Name";
                    errors.push(error);
                }

                if(!restaurant.pin){
                    error="Invalid pin";
                    errors.push(error);
                }

                if(!restaurant.phone){
                    error="Invalid phone";
                    errors.push(error);
                }

                if(!restaurant.streetAddress){
                    error="Invalid address";
                    errors.push(error);
                }

                if(!restaurant.city){
                    error="Invalid city";
                    errors.push(error);
                }

                if(!restaurant.country){
                    error="Invalid country";
                    errors.push(error);
                }

                if(!restaurant.cuisine){
                    error="Need at least one cuisine";
                    errors.push(error);
                }

                if(errors.length==0){

                    restaurant.name=restaurant.name.toUpperCase();
                    restaurant.streetAddress=restaurant.streetAddress.toUpperCase();
                    restaurant.city=restaurant.city.toUpperCase();


                    restaurantService
                        .updateRestaurant(restaurantId,restaurant)
                        .success(function (restaurant) {
                           $location.url("/user/restaurant")

                        })
                }
                else {
                    throwError(errors);
                }

            }
            else{
                error="Please fill in the details";
                errors.push(error);
                throwError(errors);
            }





        }



        function deleteRestaurant () {

                var r = confirm("You really want to delete this restaurant. This cannot be undone.");
                if (r == true) {
                    restaurantService
                        .deleteRestaurant(restaurantId)
                        .success(function (response) {
                            $location.url("/user/restaurant");
                        }).error(function (err) {
                        throwError("unable to delete the restaurant");
                    });

                }



        }

        function addNewSpeciality() {
            ++vm.count;
            var newObj={
                key:vm.count,
                value:''
            };

            vm.speciality.push(newObj);
        }

        function deleteSpeciality(speciality) {
            for (var s in vm.speciality) {
                if(vm.speciality[s].key==speciality.key){
                    vm.speciality.splice(s,1);
                }
            }
        }

        function setFoodTypes(restaurant) {
            var cuisine='';
            for (var s in vm.speciality){
                restaurant.foodTypes.push(vm.speciality[s].value);
                cuisine+=vm.speciality[s].value+' ';
            }
            restaurant.cuisine=cuisine;
            return restaurant;
        }

        function setDeliveryandPickupforModel () {
            if(vm.restaurant.offersPickup){
                vm.restaurant.offersPickup="Yes";
            }
            else {
                vm.restaurant.offersPickup="No";
            }

            if(vm.restaurant.offersDelivery){
                vm.restaurant.offersDelivery="Yes";
            }
            else {
                vm.restaurant.offersDelivery="No";
            }

        }



        function uploadImage()
        {
            if (vm.file) {
                vm.upload(vm.file);
            }
        }


        vm.upload = function (file) {


            Upload.upload({
                url: '/api/restaurant/upload',
                data:{file:file}
            }).then(function (resp) {
                if(resp.data.error_code === 0){

                    vm.error="";
                    vm.success = 'Image successfully uploaded.';
                    vm.url = resp.data.fileUrl;



                } else {
                    vm.message="";
                    vm.error = 'An error occurred';
                }
            }, function (resp) {
                vm.message="";
                vm.error =  resp.status;
                vm.error =  'Error status: ' + resp.status;
            });
        };

        function formatTiming(restaurant) {



            for(var i in restaurant.hours){


                if(restaurant.hours[i][1] !== 'HH' && restaurant.hours[i][2] !== 'MM' && restaurant.hours[i][3] !== 'HH' && restaurant.hours[i][4] !== 'MM' ){
                    var formattedTime='';
                    var unit='';
                    if(restaurant.hours[i][1] > 12){
                        if(restaurant.hours[i][1]-12 <10){
                            formattedTime='0';
                        }

                        formattedTime+=restaurant.hours[i][1]-12;
                        unit='PM';
                    }
                    else if(restaurant.hours[i][1] == 0){
                        formattedTime=12;
                        unit='AM';
                    }
                    else{
                        formattedTime=restaurant.hours[i][1] ;
                        unit='AM';
                    }
                    formattedTime+=':'+restaurant.hours[i][2]+' '+unit+' - ' ;

                    if(restaurant.hours[i][3] > 12){
                        if(restaurant.hours[i][3]-12 < 10){
                            formattedTime+='0';
                        }

                        formattedTime+=restaurant.hours[i][3]-12;
                        unit='PM';
                    }
                    else if(restaurant.hours[i][3] == 0){
                        formattedTime+=12;
                        unit='AM';
                    }
                    else{
                        formattedTime+=restaurant.hours[i][3] ;
                        unit='AM';
                    }
                    formattedTime+=':'+restaurant.hours[i][4]+' '+unit;



                    var startTimeInDateFormat=new Date();
                    startTimeInDateFormat.setHours(parseInt(restaurant.hours[i][1]));
                    startTimeInDateFormat.setMinutes(parseInt(restaurant.hours[i][2]));
                    var endTimeInDateFormat=new Date();
                    endTimeInDateFormat.setHours(parseInt(restaurant.hours[i][3]));
                    endTimeInDateFormat.setMinutes(parseInt(restaurant.hours[i][4]));
                    restaurant.hours[i][0]=formattedTime;
                    restaurant.hours[i][5]=startTimeInDateFormat;
                    restaurant.hours[i][6]=endTimeInDateFormat;


                }
                else{
                    restaurant.hours[i]=[];
                }
            }


            return restaurant;
        }


        function setDeliveryAndPickupFlag (restaurant) {
            if(restaurant.offersPickup=='Yes'){
                restaurant.offersPickup=true;
            }
            else {
                restaurant.offersPickup=false;
            }

            if(restaurant.offersDelivery=='Yes'){
                restaurant.offersDelivery=true;
            }
            else {
                restaurant.offersDelivery=false;
            }
            return restaurant;

        }

        function throwError(errorMsg){
            vm.error=errorMsg;


            $timeout(clearError, 10000);
        }

        function clearError() {
            vm.error='';
        }


    }
})();