(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController);

    function LoginController($location, UserService) {
        var vm = this;

        // event handlers
        vm.login = login;
        vm.reg = reg;

        function init() {
        }
        init();

        function login(user) {
            if(user){
                var promise = UserService.findUserByCredentials(user.username, user.password);

                promise
                    .success(function (user) {
                        if (user) {

                            $location.url("/users/" + user._id);

                        }

                        else{
                            vm.error = "User not found";
                        }
                    })

                    .error(function () {

                        vm.error = "User not found";
                    })
            }

            else{
                vm.error="Enter Username and Password";
            }


        }


        function reg() {
            $location.url("/register");
        }
    }
})();