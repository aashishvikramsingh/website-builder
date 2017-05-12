(function(){
    angular
        .module("WebAppMaker")
        .controller("NewWebsiteController",NewWebsiteController);

    function NewWebsiteController($routeParams, WebsiteService, $location){
        var vm = this;
        vm.userId=$routeParams['uid'];

        vm.newWebsite = newWebsite;

        function init() {
            var promise = WebsiteService.findWebsitesByUser(vm.userId);
            promise.success(function(websites){

                vm.websites=websites;
            })
        }
        init();


        function newWebsite(siteInfo){
            if(siteInfo) {

                var promise = WebsiteService.createWebsite(vm.userId, siteInfo);
                promise.success(function(){
                    $location.url("/users/"+vm.userId+"/website");
                })
                    .error(function () {
                        vm.error="Unable to create the New Website";
                    })
            }

        }

    }
})();