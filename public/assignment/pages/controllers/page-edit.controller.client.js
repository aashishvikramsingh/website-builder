(function (){
    angular
        .module("WebAppMaker")
        .controller("EditPageController",EditPageController);

    function EditPageController($routeParams, PageService, $location){
        var vm =this;
        vm.websiteId=$routeParams['wid'];
        vm.userId=$routeParams['uid'];
        vm._id=$routeParams['pid'];


        vm.edit=edit;
        vm.delPage=delPage;

        function init() {

            var promise = PageService.findPageByWebsiteId(vm.websiteId);
            promise.success(function(pages){
                vm.pages=pages;
            })


            promise = PageService.findPageById(vm._id);
            promise.success(function (page){
                vm.page=page;
            })
        }
        init();



        function edit(page){
            if (page.name && page.description) {
                var promise = PageService.updatePage(vm._id, page);
                promise.success(function () {
                    $location.url("/users/" + vm.userId + "/website/" + vm.websiteId + "/page");
                })
            }

            else {
                vm.error="All fields are mandatory";
            }

        }

        function delPage(){
            var promise = PageService.deletePage(vm._id);
            promise.success(function (){
                $location.url("/users/"+vm.userId+"/website/"+vm.websiteId+"/page");
            })
        }
    }
})();