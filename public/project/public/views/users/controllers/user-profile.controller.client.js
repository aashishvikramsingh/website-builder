(function (){
    angular.module('ProjectMaker')
        .controller('userProfileController', userProfileController);

    function userProfileController ( $routeParams,addressAPISearchService , userService, $location, $timeout) {

        var vm = this;
        var userId;

        vm.countries=['United States'];


        vm.updateUser=updateUser;
        vm.deleteUser=deleteUser;
        vm.available=available;
        vm.loadAddressFromAPI=loadAddressFromAPI;
        vm.populateCityAndStateIfDlSel=populateCityAndStateIfDlSel;
        vm.states=["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",];

        vm.logOutUser = logOutUser;
        vm.removeAddFromDelAddressList=removeAddFromDelAddressList;

        function init () {
            var promise=userService.findCurrentUser();
            promise.success(function (user) {
                vm.user=user;
                vm.userId = user._id;
                userId = user._id;

                if(user.role=='DELIVERYBOY'){

                    currentAvailability();
                }

                if(user.role=='USER'){
                    vm.deliverAddressLength=user.deliverAddress.length;
                }


            }).error(function (err) {

            })
           } init();


        function logOutUser(user) {
            if(user.role='DELIVERYBOY'){
                vm.user.db_avail=0;

                var promise=userService.updateAvailabiltyofDB(userId,vm.user);
                promise.success(function (response) {

                    userService
                        .logout()
                        .then(function () {
                            $location.url('/home');
                        });


                }).error(function (err) {

                });

            }else{
                userService
                    .logout()
                    .then(function () {
                        $location.url('/home');
                    });
            }
        }

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

        function currentAvailability() {
            var curr_status=vm.user.db_avail;
            if(curr_status){
                $('#delBoyAvail').bootstrapToggle('on');

            }
            else{
                $('#delBoyAvail').bootstrapToggle('off');
            }
        }

        function available() {

            var val = vm.user.db_avail;

            var num;

            if(val){
                num = 1;
            }else{
                num = 0;
            }

            if (vm.user.db_avail==1){

                vm.user.db_avail=0;

                var promise=userService.updateAvailabiltyofDB(userId,vm.user);
                promise.success(function (response) {
                    $('#delBoyAvail').bootstrapToggle('off');

                }).error(function (err) {

                });

            } else{

                vm.user.db_avail=1;
                //send to db with true
                var promise=userService.updateAvailabiltyofDB(userId,vm.user);
                promise.success(function (response) {
                    $('#delBoyAvail').bootstrapToggle('on');
                }).error(function (err) {

                });

            }
        }


        function updateUser(userId, user) {
            var errors=[];
            var error='';

            if(!user.firstName){
                error="FirstName is invalid";
                errors.push(error);
            }

            if(!user.lastName){
                error="LastName is invalid";
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

            if(errors.length == 0){
                var promise=userService.updateUser(userId,user);
                promise.success(function (user) {
                    vm.user=user;

                    outputMsg("SUCCESS","Profile updated successfully");
                }).error(function (err) {
                    error="unable to update User";
                    errors.push(error);
                    outputMsg("ERROR",errors);
                })
            }
            else {
                outputMsg("ERROR",errors);
            }


        }

        function deleteUser(userId) {
            var promise=userService.deleteUser(userId);
            promise.success(function (response) {
               $location.url("/login");
            }).error(function (err) {
                vm.error("unable to delete User");
            })
        }

        function removeAddFromDelAddressList(add) {
            for(var a in vm.user.deliverAddress){
                if(vm.user.deliverAddress[a]==add){
                    var indx=vm.user.deliverAddress.indexOf(add);
                    vm.user.deliverAddress.splice(indx,1);

                }
            }
        }

        function outputMsg(msgType,msg){
            if(msgType=='SUCCESS'){
                vm.message=msg;
            }
            else{
                vm.error=msg;
            }
            $timeout(clearMessage, 5000);
        }

        function clearMessage() {
            vm.error='';
            vm.message='';
        }


    };
})();

