(function (){
    angular.module('ProjectMaker')
        .controller('userRegisterController', userRegisterController);

    function userRegisterController ($location, userService,addressAPISearchService, $timeout, $routeParams) {
        var vm = this;
         var role=$routeParams['role'];
         vm.role=role;

        var restaurantId = $routeParams['rst'];
        vm.restaurantId = restaurantId;

        vm.countries=['United States'];

        vm.createUser=createUser;
        vm.loadAddressFromAPI=loadAddressFromAPI;
        vm.populateCityAndStateIfDlSel=populateCityAndStateIfDlSel;
        vm.states=["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",];

        function init() {
        }init();


        function loadAddressFromAPI() {

            if(vm.user.address){
                var formattedSpace=vm.user.address.replace(/\s+/g,'+');
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





        function createUser (user) {
            var errors=[];
            var error='';

            if(!user.username){
                error="Username cannot be empty";
                errors.push(error);
            }

            if(!user.firstName){
                error="FirstName is invalid";
                errors.push(error);
            }

            if(!user.lastName){
                error="LastName is invalid";
                errors.push(error);
            }

            if(!user.email){

                error="Email is invalid";
                errors.push(error);
            }

            if(!user.phone){
                error="Phone is invalid";
                errors.push(error);
            }

            if(!user.pin){
                error="PIN is invalid";
                errors.push(error);
            }

            if(!user.address){
                error="Address is invalid";
                errors.push(error);
            }

            if(!user.city){
                error="City is invalid";
                errors.push(error);
            }

            if(!user.state){
                error="State is invalid";
                errors.push(error);
            }


            if(errors.length == 0){

                    if(user.password === user.password2 && user.password){
                         createNewUser(user);
                    }else{
                        error='Password does not match';
                        errors.push(error);
                        throwError(errors);

                    }

            }


            else{
                throwError(errors);

            }

        }


        function populateCityAndStateIfDlSel() {

            if (vm.addressFromAPI){
                var cityAndState=vm.addressFromAPI[0].text.split(', ')[1].split(' ');
                vm.user.city=cityAndState[0];
                vm.user.state=cityAndState[1];

            }

            else{
                vm.user.city='';
                vm.user.state='';
            }


        }


        function createNewUser(user) {
            if(role==0){
                user.deliverAddress=[];
                user.role='USER';

            }
            else if(role==1) {
                user.role = 'OWNER';
            }else if(role==2){
                user.role = 'DELIVERYBOY';
            }

            var promise=userService.createUser(user);
            promise.success(function (user) {


                $location.url('/user/profile');
            }).error(function (err) {
                    var errors=[];
                    errors.push('Either this username or email already taken.');
                   throwError(errors);
            })
        }

        function throwError(errorMsg){
            vm.error=errorMsg;


            $timeout(clearError, 5000);
        }

        function clearError() {
            vm.error='';
        }

    };
})();


