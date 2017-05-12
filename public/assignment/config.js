(function(){
    angular
        .module("WebAppMaker")
        .config(configuration);

    function configuration($routeProvider, $locationProvider, $httpProvider) {

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            .when("/", {
                templateUrl: "users/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model",
                data:{
                    pageTitle:'Login'
                }
            })
            .when("default", {
                templateUrl: "users/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model",
                data:{
                    pageTitle:'Login'
                }
            })

            .when("/login", {
                templateUrl: "users/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model",
                data:{
                    pageTitle:'Login'
                }
            })
            .when("/register", {
                templateUrl: "users/templates/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model",
                data:{
                    pageTitle:'Register'
                }
            })

            .when("/users/:uid", {
                templateUrl: "users/templates/profile.view.client.html",
                controller:"ProfileController",
                controllerAs:"model",
                data:{
                    pageTitle:'Profile'
                }
            })
            .when("/users/:uid/website/new",{
                templateUrl: "website/templates/website-new.view.client.html",
                controller: "NewWebsiteController",
                controllerAs: "model",
                data:{
                    pageTitle:'New Website'
                }
            })
            .when("/users/:uid/website", {
                templateUrl: "website/templates/website-list.view.client.html",
                controller: "WebsiteListController",
                controllerAs: "model",
                data:{
                    pageTitle:'Websites'
                }
            })


            .when("/users/:uid/website/:wid/page/new",{
                templateUrl: "pages/templates/page-new.view.client.html",
                controller: "NewPageController",
                controllerAs:"model",
                data:{
                    pageTitle:'New Page'
                }
            })

            .when("/users/:uid/website/:wid/page/:pid",{
                templateUrl: "pages/templates/page-edit.view.client.html",
                controller: "EditPageController",
                controllerAs:"model",
                data:{
                    pageTitle:'Edit Page'
                }
            })

            .when("/users/:uid/website/:wid/page",{
                templateUrl: "pages/templates/page-list.view.client.html",
                controller: "PageListController",
                controllerAs:"model",
                data:{
                    pageTitle:'Pages'
                }
            })

            .when("/users/:uid/website/:wid",{
                templateUrl: "website/templates/website-edit.view.client.html",
                controller: "EditWebsiteController",
                controllerAs: "model",
                data:{
                    pageTitle:'Edit Website'
                }
            })

            .when("/users/:uid/website/:wid/page/:pid/widget",{
                templateUrl: "widgets/templates/widget-list.view.client.html",
                controller: "WidgetListController",
                controllerAs: "model",
                data:{
                    pageTitle:'Widgets'
                }
            })

            .when("/users/:uid/website/:wid/page/:pid/widget/new/:wt",{
                templateUrl: "widgets/templates/widget-create.view.client.html",
                // templateUrl: "widgets/templates/widget-edit.view.client.html",
                controller: "WidgetCreateController",
                controllerAs: "model",
                data:{
                    pageTitle:'New Widget'
                }
            })

            .when("/users/:uid/website/:wid/page/:pid/widget/new",{
                templateUrl: "widgets/templates/widget-chooser.view.client.html",
                controller: "WidgetNewController",
                controllerAs: "model",
                data:{
                    pageTitle:'Choose Widget'
                }
            })

            .when("/users/:uid/website/:wid/page/:pid/widget/:wgid",{
                templateUrl: "widgets/templates/widget-edit.view.client.html",
                controller: "WidgetEditController",
                controllerAs: "model",
                data:{
                    pageTitle:'Edit Widget'
                }
            })

            .when("/users/:uid/website/:wid/page/:pid/widget/:wt/:wgid/flickr",{
                templateUrl: "widgets/templates/widget-flickr-search.view.client.html",
                controller: "ImageSearchController",
                controllerAs: "model",
                data:{
                    pageTitle:'Flickr'
                }
            })

            .when("/users/:uid/website/:wid/page/:pid/widget/:wt/flickr",{
                templateUrl: "widgets/templates/widget-flickr-search.view.client.html",
                controller: "ImageSearchController",
                controllerAs: "model",
                data:{
                    pageTitle:'Flickr'
                }});




    }
})();