angular.module('starter').directive('select', function () {
    return {
        scope: {
            values: '=',
            'selectedModel': '=',
            'multiple': '=',
        },
        controller: function ($scope, hotkeys, $timeout, $rootScope) {

            //handle open/close
            $scope.opened = false;
            $scope.trigger = function () {
                $scope.opened = !$scope.opened;
            };

            if ($scope.multiple) {
                console.info('Multiple selection');

                $scope.select = function (value) {
                    
                    $scope.selectedModel.push(value);
                    $scope.trigger();
                }

            } else {

                $scope.select = function (value) {
                    $scope.selectedModel = value;
                    $scope.trigger();
                }

            }


        },
        template: '<div ng-if="!multiple" class="relative" ng-class="{open: opened}"><a ng-click="trigger()">{{selectedModel.title}}</a><ul class="sub"><li ng-click="select(mood)" ng-repeat="mood in values">{{mood.title}}</li></ul></div>' +
        '<div ng-if="multiple" class="relative" ng-class="{open: opened}"><a ng-repeat="item in selectedModel" ng-click="trigger()">{{item.title}}</a><ul class="sub"><li ng-click="select(mood)" ng-repeat="mood in values">{{mood.title}}</li></ul></div>'
    }

});
