(function (){
    angular
        .module ("WebAppMaker")
        .controller("PageListController",PageListController);

    function PageListController($routeParams, PageService, $location){
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];

        function init() {

                var promise = PageService.findPageByWebsiteId(vm.websiteId);
                promise.success(function(page){
                    vm.pages=page;
                })
                    .error(function(){
                        vm.error="Unable to find Pages for this Website";
                    })

        }
        init();


    }

})();