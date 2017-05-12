
(function () {
    angular
        .module("ProjectMaker")
        .factory("SearchService", SearchService);

    function SearchService($http) {

        var api = {

            "searchRestaurant":searchRestaurant,

        };

        return api;


        function searchRestaurant(restName,restAdd) {

            var token='6fb883f6655311b6';
            var formattedRestAdd=restAdd.split(' ').join('+');

            if (restName && restAdd){
                var formattedRestName=restName.split(' ').join('+');

                return $http.get('https://api.eatstreet.com/publicapi/v1/restaurant/search?access-token=6fb883f6655311b6&method=both&search='+formattedRestName+'&street-address='+ formattedRestAdd);
            }
            else{

                 return $http.get('https://api.eatstreet.com/publicapi/v1/restaurant/search?access-token=6fb883f6655311b6&method=both&street-address='+ formattedRestAdd);
            }


        }



   }

})();