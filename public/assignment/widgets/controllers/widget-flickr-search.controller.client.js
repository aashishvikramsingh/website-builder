(function(){

    angular
        .module("WebAppMaker")
        .controller("ImageSearchController",ImageSearchController);

    function ImageSearchController($routeParams, FlickrService, $location, FetchFlickrUrlService) {
        var vm = this;

        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.widgetId = $routeParams['wgid'];
        vm.widgetType=$routeParams['wt'];
        vm.searchText="";

        vm.searchPhotos=searchPhotos;
        vm.selectPhoto=selectPhoto;

        function intit() {

        }
        intit();

        function searchPhotos(searchTerm) {
            FlickrService
                .searchPhotos(searchTerm)
                .then(function(response) {
                    data = response.data.replace("jsonFlickrApi(","");
                    data = data.substring(0,data.length - 1);
                    data = JSON.parse(data);
                    vm.photos = data.photos;
                });
        }

        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            FetchFlickrUrlService.setUrl(url);

            if (vm.widgetId){
                $location.url("/users/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+vm.widgetId);
            }
            else{

                $location.url("/users/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/new/"+vm.widgetType);
            }


        }
    }


})();