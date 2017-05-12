(function () {
    angular
        .module("WebAppMaker")
        .factory("UserService", userService);

    function userService($http) {

        var api = {
            "findUserByCredentials": findUserByCredentials,
            "createUser":createUser,
            "updateUser":updateUser,
            "findUserById":findUserById,
            "findUserByUsername":findUserByUsername,
            "deleteUser":deleteUser

        };
        return api;

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username="+username+"&password="+password);
        }

        function createUser(user){
            return $http.post("/api/user/",user);
        }

        function updateUser(userId, modifiedUser){
            return $http.put("/api/user/"+userId, modifiedUser);
        }

        function findUserById(userId){
            return $http.get("/api/user/"+userId);
        }

        function findUserByUsername(username){
            return $http.get("/api/user?username="+username);
        }

        function deleteUser(userId){
            return $http.delete ("/api/user/"+userId);
        }

    }
})();