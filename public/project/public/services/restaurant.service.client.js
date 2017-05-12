
(function (){
    angular
        .module("ProjectMaker")
        .factory("restaurantService",restaurantService);

    function restaurantService ($http) {


        var api = {
            "createRestaurant": createRestaurant,
            "findRestaurantByOwner":findRestaurantByOwner,
            "findRestaurantById":findRestaurantById,
            "updateRestaurant":updateRestaurant,
            "deleteRestaurant":deleteRestaurant,
            "createAPIResturantIfNotExist":createAPIResturantIfNotExist,
            "findAllPartnerResturantsInThisLocation":findAllPartnerResturantsInThisLocation,
            "findRestaurant":findRestaurant,
            "deleteOrderFromConsole":deleteOrderFromConsole,
            "searchMenu":searchMenu,
            "getRestaurantKeys":getRestaurantKeys,
            "searchRestaurant":searchRestaurant

        };


        return api;


        function getRestaurantKeys() {

            return $http.get('/api/getRestaurantKeys');
        }



        function searchRestaurant(keys,restName,restAdd) {

            var token=keys.token;
            var formattedRestAdd=restAdd.split(' ').join('+');

            if (restName && restAdd){
                var formattedRestName=restName.split(' ').join('+');

                return $http.get('https://api.eatstreet.com/publicapi/v1/restaurant/search?access-token='+token+'&method=both&search='+formattedRestName+'&street-address='+ formattedRestAdd);
            }
            else{

                return $http.get('https://api.eatstreet.com/publicapi/v1/restaurant/search?access-token='+token+'&method=both&street-address='+ formattedRestAdd);
            }


        }




        function searchMenu(keys,restaurantId) {
            var token=keys.token;

            return $http.get('https://api.eatstreet.com/publicapi/v1/restaurant/'+restaurantId+'/menu/?access-token='+token);

        }

        function deleteRestaurant(restaurantId) {
            return $http.delete('/api/restaurant/'+restaurantId);

        }

        function updateRestaurant(restaurantId,restaurant) {
            return $http.put('/api/restaurant/'+restaurantId,restaurant);
        }

        function createRestaurant (userId,restaurant) {
            return $http.post('/api/user/'+userId+'/restaurant/',restaurant);
        }

        function findRestaurantByOwner(userId) {
            return $http.get('/api/user/'+userId+'/restaurant');
        }

        function findRestaurantById(restaurantId) {
            return $http.get('/api/restaurant/'+restaurantId);

        }

        function createAPIResturantIfNotExist (restaurant) {
         return   $http.post('/api/apiresturant/create',restaurant);
        }

        function findAllPartnerResturantsInThisLocation(search) {

            return $http.get('/api/partnerRestaurant?name='+search.name+'&address='+search.address);
        }

        function findRestaurant() {
            return $http.get('/api/restaurants');
        }
        function deleteOrderFromConsole(restaurantId, OrderId) {
            return $http.put("/api/restaurants/"+restaurantId+"/order/"+OrderId);
        }
    }
})();