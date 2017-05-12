(function (){

    angular

        .module("WebAppMaker")

        .controller("RegisterController",RegisterController);


    function RegisterController(UserService,$location){

        var vm = this;

        vm.register = register;

        function register(user) {

            if (user)
            {
                var newuser = {

                    username: user.regUser,

                    password: user.regPassword,

                    firstName: user.fname,

                    lastName: user.lname,

                    email: user.email,

                    phone: user.phone
                };

                UserService
                    .createUser(newuser)
                    .success(function (user) {
                        $location.url('/users/' + user._id);
                    })
                    .error(function () {

                        vm.error = "Unable to register.";
                    });
            }

        }

    }
})();
