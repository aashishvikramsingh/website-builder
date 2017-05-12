
(function () {
    angular
        .module("ProjectMaker")
        .factory("addressAPISearchService", addressAPISearchService);

    function addressAPISearchService($http) {

        var api = {

            "autoCompleteAddress":autoCompleteAddress,
            "getAuthkeys" : getAuthkeys
        };

        return api;

        function getAuthkeys() {
            return $http.get('/api/getAuth');
        }

        function autoCompleteAddress (keys,addressToLookUp) {
            return $http.get('https://us-autocomplete.api.smartystreets.com/suggest?auth-id='+keys.authId+'&auth-token='+keys.authToken+'&prefix='+addressToLookUp);

        }
    }

})();

