(function () {
    angular
        .module('WebAppMaker')
        .directive('wbdvSortable', sortableDir);

    function sortableDir() {
        function linkFunc(scope, element, attributes) {
            SortIndex = [];
            element.sortable({

                handle: 'a.justify',

                axis: 'y',

                start: function (event, ui) {
                    SortIndex[0] = ui.item.index();

                },

                stop: function (event, ui) {
                    SortIndex[1] = ui.item.index();
                    scope.getIndexAfterSorting({'index': SortIndex});
                }

            });
}

    return {
        scope: {
            getIndexAfterSorting: '&getIndex'
        },
        link: linkFunc
    }};
})();
