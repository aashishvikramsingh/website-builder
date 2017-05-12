(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetEditController", WidgetEditController);

    function WidgetEditController($routeParams, WidgetService, $location, Upload, FetchFlickrUrlService) {
        var vm = this;
        vm.mode="EDIT";
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.widgetId = $routeParams['wgid'];
        vm.headerSize=["1","2","3","4","5","6"];
        vm.mediaWidth=["10%","20%","30%","40%","50%","60%","70%","80%","90%","100%"];




        vm.getEditorTemplateUrl = getEditorTemplateUrl;
        vm.deleteWidget=deleteWidget;
        vm.updateWidget=updateWidget;
        vm.uploadImage = uploadImage;
        vm.callFlickSearch=callFlickSearch;



        function init(){
            var promise = WidgetService.findWidgetById(vm.widgetId);
            promise.success(function(widget){
                var sizeInString=widget.size;
                widget.size=sizeInString.toString();
                var flickrUrl=FetchFlickrUrlService.getUrl();

                if (flickrUrl){

                    var w=FetchFlickrUrlService.getWidget();

                    widget.name=w.name;
                    widget.text=w.text;
                    widget.width=w.width;
                    widget.url=w.url;



                    FetchFlickrUrlService.setWidget("");
                    FetchFlickrUrlService.setUrl("");

                }


                vm.widget=widget;
            })
                .error(function()
                {vm.error="Unable to identify Widget type";})
        }
        init();




        function getEditorTemplateUrl(type) {
            if (type) {

                return 'widgets/templates/editors/widget-' + type + '-edit.view.client.html';
            }
        }


        function deleteWidget(){

            var promise = WidgetService.deleteWidget(vm.widgetId);
            promise.success(function(){
                $location.url("/users/"+vm.userId +"/website/"+vm.websiteId +"/page/"+vm.pageId+"/widget");
            })
                .error(function(){
                    vm.error="Unable to delete the Widget";
                })


        }

        function updateWidget(widget){
            if(widget.name && widget.text) {
                var promise = WidgetService.updateWidget(vm.widgetId, widget);
                promise.success(function(){
                    $location.url("/users/"+vm.userId +"/website/"+vm.websiteId +"/page/"+vm.pageId+"/widget");
                })
                    .error(function(){
                        vm.error="Unable to update the Widget";
                    })
            }

            else {
                vm.error="Widget name and text are mandatory";
            }

        }

        function uploadImage()
        {
            if (vm.file) {
                vm.upload(vm.file);
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
            }, function (resp) { //catch error
                vm.message="";
                vm.error =  resp.status;
                vm.error =  'Error status: ' + resp.status;
            });
        };


        function callFlickSearch (widget) {
            var wt = 'IMAGE';

            FetchFlickrUrlService.setWidget(widget);
            $location.url("/users/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+wt+"/"+vm.widgetId+"/flickr");

        }
    }
})();