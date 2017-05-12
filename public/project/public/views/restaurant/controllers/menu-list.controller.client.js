(function (){
    angular
        .module("ProjectMaker")
        .controller("restaurantMenuController",restaurantMenuController);

    function restaurantMenuController($routeParams,menuService,userService, $location){
        var vm = this;

        var userId; //= $routeParams['uid'];
        vm.gotoItemEdit = gotoItemEdit;

        var category = [{cat: '', items:[]}];
        var eachCat = {itemName: '',
                            price:0};

        function init(){
            var restaurantId;

            var promise=userService.findCurrentUser();
            promise.success(function (user) {
                vm.user = user;
                vm.userId = user._id;
                userId = user._id;


                userService
                    .getRestaurantId()
                    .success(function (restaurantId) {
                        vm.restaurantId = restaurantId;
                        restaurantId=restaurantId.replace(/"/g,'');

                menuService
                    .findMenuByRestaurantId(restaurantId)
                    .success(function (menu) {

                        var groups = {};
                        for (var i = 0; i < menu.length; i++) {
                            var groupName = menu[i].category;
                            if (!groups[groupName]) {
                                groups[groupName] = [];
                            }
                            groups[groupName].push([menu[i].itemName, menu[i].price, menu[i]._id]);
                        }
                        myArray = [];
                        for (var groupName in groups) {
                            myArray.push({group: groupName, entry: groups[groupName]});
                        }

                        vm.result = myArray;

                        vm.menu = menu;


                    });
            });})
        }
        init();



        function gotoItemEdit(menuid) {
            menuService
                .setMenuId(menuid)
                .then(function () {
                    $location.url('/user/restaurant/menu/item');
                })

        }
    }
})();