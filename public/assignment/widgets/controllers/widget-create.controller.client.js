(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetCreateController", WidgetCreateController);

    function WidgetCreateController($routeParams, WidgetService, $location, Upload, FetchFlickrUrlService) {
        var vm = this;
        vm.mode="NEW";
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.widgetType=$routeParams['wt'];
        vm.widget="";

        vm.headerSize=["1","2","3","4","5","6"];
        vm.mediaWidth=["10%","20%","30%","40%","50%","60%","70%","80%","90%","100%"];



        vm.getEditorTemplateUrl = getEditorTemplateUrl;
        vm.createWidget=createWidget;
        vm.uploadImage = uploadImage;
        vm.callFlickSearch=callFlickSearch;


        function init() {
            var widget=FetchFlickrUrlService.getWidget();
            FetchFlickrUrlService.setWidget('');
            FetchFlickrUrlService.setUrl('');
            vm.widget=widget;
        }
        init();



        function getEditorTemplateUrl(type) {

            return 'widgets/templates/editors/widget-'+type+'-edit.view.client.html';
        }

        function createWidget(widget){
            if (widget){
                  widget.widgetType=vm.widgetType;
                  var promise = WidgetService.createWidget(vm.pageId,widget);
                  promise.success(function(){
                      $location.url("/users/"+vm.userId +"/website/"+vm.websiteId +"/page/"+vm.pageId+"/widget");
                  })
                      .error(function(){
                          vm.error="Unable to create the widget";
                      })
            }

        }

        function uploadImage()
        {
            if (vm.file) { //check if from is valid
                vm.upload(vm.file); //call upload function
            }
        }


        vm.upload = function (file) {
            Upload.upload({
                url: '/api/widget/image/upload',
                data:{file:file}
            }).then(function (resp) {
                if(resp.data.error_code === 0){

                    vm.error="";
                    vm.success = 'Image successfully uploaded.';
                    vm.widget.url = resp.data.fileUrl;
                } else {
                    vm.message="";
                    vm.error = 'An error occurred';
                }
            }, function (resp) {
                vm.message="";
                vm.error =  resp.status;
                vm.error =  'Error status: ' + resp.status;
            });
        };

        function callFlickSearch () {

            FetchFlickrUrlService.setWidget(vm.widget);
            $location.url("/users/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+vm.widgetType+"/flickr");
        }

    }
})();
