
(function (){
    angular
        .module("ProjectMaker")
        .factory("orderTrackService",orderTrackService);

    function orderTrackService ($http) {

    var api={
        "findOrdersForThisRestaurant":findOrdersForThisRestaurant,
        "assignDelivery":assignDelivery,
        "orderedDelivered":orderedDelivered,
        "findOrders":findOrders,
        "deleteOrder":deleteOrder,

    };

    return api;



        function findOrdersForThisRestaurant(restaurantId) {
            return $http.get('/api/restaurant/'+restaurantId+'/orders');
        }


        function assignDelivery (order) {
            return $http.put('/api/restaurant/'+order.restaurantId+'/orders/delivery', order);
        }

        function orderedDelivered (order) {

            return $http.put('/api/restaurant/'+order.restaurantId+'/orders/markdelivered', order);
        }

        function findOrders() {
            return $http.get('/api/orders');
        }

        function deleteOrder(orderId) {
            return $http.delete('/api/order/'+orderId);
        }



    }





})();