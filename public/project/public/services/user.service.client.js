(function (){
    angular
        .module("ProjectMaker")
        .factory("userService",userService);

    function userService ($http) {



        var api = {
            "findCurrentUser":findCurrentUser,
            "login" : login,
            "loggedin": loggedin,
            "logout":logout,
            "createUser": createUser,
            "findUserByID":findUserByID,
            "findUserByCredentials":findUserByCredentials,
            "updateUser":updateUser,
            "deleteUser": deleteUser,
            "findDeliveryBoyByRestaurant":findDeliveryBoyByRestaurant,
            "updateAvailabiltyofDB":updateAvailabiltyofDB,
            "findActiveDeliveryBoyByRestaurant":findActiveDeliveryBoyByRestaurant,
            "getAllOrdersForThisDeliveryBoy":getAllOrdersForThisDeliveryBoy,
            "findAllOrdersForThisCustomer":findAllOrdersForThisCustomer,
            "updateDeliveryAddresses":updateDeliveryAddresses,
            "findUsers":findUsers,
            "setRestaurantId" : setRestaurantId,
            "getRestaurantId" : getRestaurantId,
            "setDBId" : setDBId,
            "getDBId" : getDBId

            // restaurantId : String
        };


        return api;

        function setDBId(dbId) {
            return $http.put('/api/setdbid/'+dbId);

        }

        function getDBId() {
            return $http.get('/api/getdbid');
        }



        function setRestaurantId(restId) {

            return $http.put('/api/setrest/'+restId);
        }

        function getRestaurantId() {

            return $http.get('/api/getrest');
        }

        function findCurrentUser() {
            return $http.get("/api/findCurrentUser");
        }


        function login(user) {

            return $http.post('/api/login', user)
                .then(function (response) {
                    return response.data;
                });
        }


        function logout() {
            return $http.post('/api/logout')
                .then(function (response) {
                    return response.data;
                });
        }

        function loggedin() {
            return $http.post('/api/loggedin')
                .then(function (response) {
                    return response.data;
                });
        }



        function updateAvailabiltyofDB(userId,user) {
            return $http.put('/api/users/'+userId,user);
        }


        function findDeliveryBoyByRestaurant(restaurantId) {

            return $http.get('/api/users/'+ restaurantId);
        }


        function createUser (user) {
            return $http.post('/api/user', user);
        }
        function findUserByID (userId) {
            return $http.get('/api/user/'+ userId);

        }

        function findUserByCredentials(username,password) {
            return $http.get("/api/user?username="+username+"&password="+password);
        }

        function updateUser(userId, user) {
            return $http.put("/api/user/"+userId, user);
        }

        function deleteUser(userId) {
           return $http.delete("/api/user/"+userId);
        }

        function findActiveDeliveryBoyByRestaurant(restaurantId) {
            return $http.get( "/api/users/activedelboys/"+restaurantId);
        }
        function getAllOrdersForThisDeliveryBoy(userId) {

            return $http.get( "/api/users/"+userId+"/orders/");
        }

        function findAllOrdersForThisCustomer(userId) {
            return $http.get( "/api/user/"+userId+"/customerOrders");
        }

        function updateDeliveryAddresses(userId, deliveryAddressArray) {
            return $http.put("/api/user/"+userId+"/deliveryAddress", deliveryAddressArray);
        }
        function findUsers(role) {
            return $http.get("/api/users?role="+role);
        }

    }
})();