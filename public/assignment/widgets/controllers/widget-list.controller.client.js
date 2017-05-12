(function (){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController",WidgetListController);

    function WidgetListController($routeParams, WidgetService, $sce, $location){
        var vm = this;

        vm.userId=$routeParams["uid"];
        vm.websiteId=$routeParams["wid"];
        vm.pageId=$routeParams["pid"];

        vm.getWidgetTemplateUrl=getWidgetTemplateUrl;
        vm.getYouTubeEmbedUrl=getYouTubeEmbedUrl;
        vm.getTrustedHtml=getTrustedHtml;
        vm.rearrangeList=rearrangeList;
        vm.updateAngularText=updateAngularText;





        function init(){
           var promise = WidgetService.findWidgetsByPageId(vm.pageId);
            promise.success(function(widgets){
                vm.widgets=widgets;

            })
                .error(function(){
                    vm.error = "Unable to fetch widgets for this page";
                })

        }
        init();

        function getWidgetTemplateUrl(widgetType){
            var url = "widgets/templates/widget-"+widgetType+".view.client.html";
            return url;
        }

        function getYouTubeEmbedUrl(widgeturl){
            var urltoken = widgeturl.split("/");
            var id =urltoken[urltoken.length-1];
            var url= "https://www.youtube.com/embed/"+id;
            return $sce.trustAsResourceUrl(url);


        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function rearrangeList(updatedIndex){
            var promise=WidgetService.rearrangeList(vm.pageId, updatedIndex);
            promise.error(function (){
                    vm.error="Unable to update WidgetList";
                }
            );
        }

        function updateAngularText(widget){

            if(widget.name && widget.text) {
                var promise = WidgetService.updateWidget(widget._id, widget);
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

    }
})();