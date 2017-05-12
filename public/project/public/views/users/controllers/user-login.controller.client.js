/**
 * Created by aashi on 3/30/2017.
 */
(function (){
    angular.module('ProjectMaker')
        .controller('userLoginController', userLoginController);

    function userLoginController(userService, $location, $timeout) {

        var vm = this;
        vm.login = login;

        vm.registerUser=registerUser;

        function login(user) {

            var errors=[];
            var error='';

            if(!user){
                error="Username and password cannot be empty";
                errors.push(error);
                throwError(errors);
            }

            else{
                if(!user.username){
                    error="Username cannot be empty";
                    errors.push(error);
                }

                if(!user.password){
                    error="Password cannot be empty";
                    errors.push(error);
                }

                if(errors.length == 0) {
                    userService
                        .login(user)
                        .then(function (user) {
                            if (user) {
                                // $location.url('/user/' + user._id);
                                if(user.role=='USER'){
                                    $location.url("/user/searchResult");
                                }else if(user.role=='OWNER'){
                                    $location.url("/user/restaurant");
                                }else if(user.role=='DELIVERYBOY'){
                                    $location.url("/user/profile");
                                }
                                else if(user.role=='ADMIN'){
                                    $location.url("/admin");
                                }
                            }
                        }, function (err) {
                           error="Unable to find user";
                           errors.push(error);
                           throwError(errors);

                        });
                }

            }





        }

        function registerUser(role) {
            $location.url("/register/"+role);
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