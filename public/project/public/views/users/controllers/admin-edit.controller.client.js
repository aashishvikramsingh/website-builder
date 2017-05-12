
(function () {
    angular.module('ProjectMaker')
        .controller('adminEditController', adminEditController);

    function adminEditController ($routeParams, $location, userService, restaurantService, orderTrackService, $timeout) {

        var vm = this;
        var userId=$routeParams['uid'];

        vm.updaterole=["USER","ADMIN","OWNER","DELIVERYBOY"];
        vm.updateUser = updateUser;


        function init () {

            var promise = userService.findUserByID(userId);
                promise.success(function (user) {
                    vm.user = user;

                }).error(function (err) {
                    vm.error = err;
                })
        }
        init();




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
                    $location.url("/admin");
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
    }
})();