(function (){
    angular
        .module ("WebAppMaker")
        .service("WidgetService",WidgetService );

    function WidgetService($http){

        var typeOfWid=[
            {widgetType: "HEADER"},
            {widgetType: "IMAGE"},
            {widgetType: "HTML"},
            {widgetType: "TEXT"},
            {widgetType: "YOUTUBE"}


        ];

        this.createWidget=createWidget;
        this.findWidgetsByPageId=findWidgetsByPageId;
        this.findWidgetById=findWidgetById;
        this.updateWidget=updateWidget;
        this.deleteWidget=deleteWidget;
        this.findWidgetTypes=findWidgetTypes;
        this.rearrangeList=rearrangeList;

        function createWidget(pageId, widget) {
            return $http.post("/api/page/"+pageId+"/widget", widget);
        }

        function findWidgetsByPageId(pageId){
            return $http.get("/api/page/"+pageId+"/widget");
        }

        function findWidgetById(widgetId){
            return $http.get("/api/widget/"+widgetId);
        }

        function updateWidget(widgetId, widget) {
            return $http.put("/api/widget/"+widgetId, widget);
        }



        function deleteWidget(widgetId){
            return $http.delete("/api/widget/"+widgetId);
        }

        function rearrangeList(pageId, updatedIndex){
            return $http.put("/api/page/"+pageId+"/widget?initial="+updatedIndex[0]+"&final="+updatedIndex[1]);
        }

        function findWidgetTypes(){
            return angular.copy(typeOfWid);
        }




    }
})();