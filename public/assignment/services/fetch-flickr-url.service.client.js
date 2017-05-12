(function (){
    angular
        .module("WebAppMaker")
        .factory("FetchFlickrUrlService",FetchFlickrUrlService);

    function FetchFlickrUrlService () {


        var api = {
            "setUrl": setUrl,
            "getUrl":getUrl,
            "setWidget": setWidget,
            "getWidget": getWidget

        };
        var url;
        var widget;
        return api;

        function setWidget(w) {
            widget={
                name:w.name,
                text:w.text,
                url: w.url,
                width:w.width

            };
        }

        function getWidget() {
            if (url){
                widget.url = url;
            }
            return widget;
        }



        function setUrl(urlFromFlickr) {

            url=urlFromFlickr;
        }

        function getUrl() {

            return url;

        }


    }
})();