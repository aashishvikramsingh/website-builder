(function(){
    angular
        .module("WebAppMaker")
        .controller("ProfileController",ProfileController);

    function ProfileController($routeParams,UserService, $location){
        var vm = this;
        var userId=$routeParams['uid'];


        vm.modifyUser=modifyUser;
        vm.deleteUserProfile=deleteUserProfile;


        function init(){

            var promise=UserService.findUserById(userId);
            promise.success(function(user){


                vm.user=user;

            })
                .error(function () {
                    vm.message ="";
                    vm.error="Unable to fetch the Profile";
                })
          }init();


        function modifyUser(user){

           if (!user.firstName || !user.lastName){
               vm.message ="";
               vm.error = "First and Last name are required";
           }

           else if (!user.email){
               vm.message ="";
                vm.error = "Email is Invalid";
           }

           else if (!user.password){
               vm.message ="";
               vm.error="Provide Password";
           }

           else {
               var modifiedEntry = {
                   username: user.username,
                   email: user.email,
                   firstName: user.firstName,
                   lastName: user.lastName,
                   password: user.password,
                   phone: user.phone,
                   dateCreated: user.dateCreated
               };

               //noinspection JSDuplicatedDeclaration
               var promise = UserService.updateUser(userId, modifiedEntry);

               promise.success(function (user) {

                   if (user) {
                       vm.message = "Profile updated successfully";
                       vm.error="";
                       vm.user = user;
                   }
                   else {
                       vm.message ="";
                       vm.error = "Unable to update your information";
                   }

                   vm.user = user;
               })
                   .error(function () {
                       vm.error="Unable to update the Profile";
                   })
           }
        };


        function deleteUserProfile(user){
                    promise=UserService.deleteUser(user._id);
                    promise.success(function() {
                        $location.url("/login");
                    })
        }
    }

})();