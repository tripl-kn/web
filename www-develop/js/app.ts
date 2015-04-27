/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/angular-translate/angular-translate.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />

/// <reference path="./controller/slideCtrl.ts" />

/// <reference path="./controller/modusChooserCtrl.ts" />


/// <reference path="./controller/triplerSearchCtrl.ts" />
/// <reference path="./controller/triplerResultCtrl.ts" />

/// <reference path="./controller/editProfileCtrl.ts" />
/// <reference path="./service/editProfileService.ts" />

/// <reference path="./controller/accomodationCtrl.ts" />

/// <reference path="./controller/moodCtrl.ts" />

/// <reference path="./controller/tripCtrl.ts" />


/// <reference path="./service/userService.ts" />
/// <reference path="./service/triplerService.ts" />
/// <reference path="./service/dataService.ts" />

/// <reference path="./mockedservice/userService.ts" />
/// <reference path="./mockedservice/triplerService.ts" />
/// <reference path="./mockedservice/dataService.ts" />


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

//set to false if backend is running on localhost
var mocked = true;

var app = angular.module('starter', ['angular-flexslider', 'smoothScroll', 'ui.router', 'pascalprecht.translate', 'emoji', 'base64'])

    .constant('basePath', '/api/')

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true
            })

            .state('welcome', {
                url: "/welcome",
                templateUrl: "../templates/welcome.html"

            })

            .state('tripresults', {
                url: "/tripresults",
                templateUrl: "../templates/tripresults.html"
            })

            .state('app.login', {
                url: "/login",
                views: {
                    'menuContent': {
                        templateUrl: "../templates/login.html"
                    }
                }
            })

            .state('app.profile', {
                url: "/profile",
                views: {
                    'menuContent': {
                        templateUrl: "../templates/profile.html"
                    }
                }
            })

            .state('editProfile', {
                url: "/editProfile",
                templateUrl: "../templates/userProfile/editProfile.html"
            });

        $urlRouterProvider.otherwise('/welcome')
    })

    .controller(Controller.TriplerSearchCtrl.controllerId, Controller.TriplerSearchCtrl)
    .controller(Controller.TriplerResultCtrl.controllerId, Controller.TriplerResultCtrl)
    .controller(Controller.SlideCtrl.controllerId, Controller.SlideCtrl)
    .controller(Controller.ModusChooserCtrl.controllerId, Controller.ModusChooserCtrl)
    .controller(Controller.AccomodationCtrl.controllerId, Controller.AccomodationCtrl)
    .controller(Controller.MoodCtrl.controllerId, Controller.MoodCtrl)
    .controller(Controller.TripCtrl.controllerId, Controller.TripCtrl)
    .controller(Controller.EditProfileCtrl.controllerId, Controller.EditProfileCtrl)



    .directive('megadate', function () {
        return {
            scope: {date: '='},
            controller: function ($scope) {
                var date = new Date($scope.date);
                $scope.date = moment(date).startOf('minute').fromNow();
            },
            template: '<p>{{date}}</p>'
        };
    })

    .config(function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'locale/locale-',
            suffix: '.json'
        }).preferredLanguage('de');
    });

if (!mocked) {
    app.service(Service.TriplerService.serviceId, Service.TriplerService)
        .service(Service.DataService.serviceId, Service.DataService)
        .service(Service.UserService.serviceId, Service.UserService)
} else {
    app.service(MockedService.TriplerService.serviceId, MockedService.TriplerService)
        .service(MockedService.DataService.serviceId, MockedService.DataService)
        .service(MockedService.UserService.serviceId, MockedService.UserService)
        .service(MockedService.EditProfileService.serviceId, MockedService.EditProfileService)
}






