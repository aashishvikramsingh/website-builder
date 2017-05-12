(function (){
    angular
        .module("ProjectMaker")
        .factory("checkOutService",checkOutService);

    function checkOutService ($http) {


        var api = {
            "calculateTotalCost":calculateTotalCost,
            "createOrder":createOrder

        };


        return api;

        function calculateTotalCost(cart) {
            items=cart.items;
            var totPrice;
            var amount=0;

            for (item in items){
                totPrice=items[item].basePrice * items[item].totCount;
                items[item].totPrice=Number(totPrice).toFixed(2);
                amount+=totPrice;
            }
            cart.items=items;
            cart.amount=Number(amount).toFixed(2);
            return cart;


        }


        function createOrder(cart) {

            return $http.post("/api/restaurant/checkout", cart);
        }

    }
})();