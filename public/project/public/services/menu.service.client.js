
(function (){
    angular
        .module("ProjectMaker")
        .factory("menuService",menuService);

    function menuService ($http) {


        var api = {
            "createMenu": createMenu,
            "findMenuByRestaurantId":findMenuByRestaurantId,
            "updateMenuItem":updateMenuItem,
            "updateMenuCategory":updateMenuCategory,
            "findMenuById":findMenuById,
            "deleteMenuById":deleteMenuById,
            "deleteMenuCategory":deleteMenuCategory,
            "setMenuId" : setMenuId,
            "getMenuId" : getMenuId


        };

        return api;


        function deleteMenuCategory(menu,restaurantId) {

            var cat = menu.catname;

            return $http.delete('/api/menucategory/'+cat);

        }

        function deleteMenuById(menuid) {
            return $http.delete('/api/menuid/'+menuid);
        }

        function findMenuById(menuid) {
            return $http.get('/api/menuid/'+menuid);
        }

        function updateMenuCategory(menu,restaurantId) {
            return $http.put('/api/menucategory/'+restaurantId,menu);
        }

        function updateMenuItem(menu,menuId) {
            return $http.put('/api/menuitem/'+menuId,menu);
        }

        function createMenu(menu) {
            return $http.post('/api/menu/',menu);
        }

        function findMenuByRestaurantId(restaurantId) {
            return $http.get('/api/menu/'+restaurantId);
        }



        function setMenuId(menuId) {
            return $http.put('/api/setmenu/'+menuId);
        }
        function getMenuId() {

            return $http.get('/api/getmenu');
        }




    }





})();