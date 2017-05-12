(function (){
    angular
        .module("WebAppMaker")
        .factory("FlickrService",FlickrService);

    function FlickrService ($http) {



        var key = "858665ef87053abf2d1f6376b9e82163";
        var secret = "d16ad8c52ab7943f";
        var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT";


        var api = {
            "searchPhotos": searchPhotos

        };


        return api;



        function searchPhotos(searchTerm) {
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);

            return $http.get(url);
        }




    }
})();