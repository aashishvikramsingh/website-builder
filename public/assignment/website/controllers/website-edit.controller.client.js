(function(){
    angular
        .module("WebAppMaker")
        .controller("EditWebsiteController",EditWebsiteController);

    function EditWebsiteController ($routeParams, WebsiteService, $location) {

        var vm = this;
        vm.userId=$routeParams['uid'];
        vm.websiteId=$routeParams['wid'];


        vm.modifyWeb=modifyWeb;
        vm.deleteWebsite=deleteWebsite;


        function init(){

                var promise = WebsiteService.findWebsitesByUser(vm.userId);

                promise.success(function(website){
                    vm.websites=website;
                })
                    .error(function () {
                        vm.error="Unable to fetch the Websites";
                    })

                promise = WebsiteService.findWebsiteById(vm.websiteId);
                promise.success(function(ws){
                    vm.web=ws;
                })
                    .error(function () {
                        vm.error="Unable to fetch the website";
                    })
        }
        init();


        function modifyWeb(website){
            if(website.name && website.description) {
                var promise = WebsiteService.updateWebsite(vm.websiteId, website);
                promise.success(function () {
                    $location.url("/users/" + vm.userId + "/website");
                })
                    .error(function () {
                        vm.error="Unable to update the Website";
                    })
            }

            else if (!website.name){
                vm.error = "Website Name is mandatory field";
            }

            else{
                vm.error = "Description is mandatory field";
            }

        }

        function deleteWebsite(){

            var promise = WebsiteService.deleteWebsite(vm.websiteId);
            promise.success(function(){
                $location.url("/users/"+vm.userId+"/website");
            });

        }



    }
})();