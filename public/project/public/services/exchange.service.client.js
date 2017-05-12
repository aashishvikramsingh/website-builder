(function (){
    angular
        .module("ProjectMaker")
        .factory("sessionHolderService",sessionHolderService);

    function sessionHolderService () {


        var api = {
            "setCart": setCart,
            "getCart":getCart,
            "setRestToGetMenu":setRestToGetMenu,
            "getRestToGetMenu":getRestToGetMenu
        };
        var cart;
        var restObj;
        return api;

        function setCart(tempObj) {
            cart=tempObj;
        }

        function getCart() {
            var cartToSend=cart;
            cart='';
            return cartToSend;
        }

        function setRestToGetMenu (rObj) {
            restObj=rObj;
        }

        function getRestToGetMenu() {
            var restDetails=restObj;
            restObj='';
            return restDetails;
        }

    }
})();