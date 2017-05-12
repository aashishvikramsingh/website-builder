(function (){
    angular
        .module("WebAppMaker")
        .controller("NewPageController", NewPageController);

    function NewPageController ($routeParams, PageService, $location){
        var vm = this;
        vm.userId=$routeParams['uid'];
        vm.websiteId=$routeParams['wid'];


        vm.addNewPage=addNewPage;



        function addNewPage(page) {
            if (page) {
                var promise = PageService.createPage(vm.websiteId, page);
                promise.success(function () {
                    $location.url("/users/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })
                    .error(function(){
                        vm.error="Unable to add New Page";
                    })

            }

        }


    }
})();