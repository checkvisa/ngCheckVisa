'use strict';

/**
 * @ngdoc overview
 * @name ngCheckVisaApp
 * @description
 * # ngCheckVisaApp
 *
 * Main module of the application.
 */
angular
  .module('ngCheckVisaApp', [
	'ui.router',
	'ui.bootstrap',
	'firebase',
	'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch'
  ])
	.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('main', {
				url: '/',
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.state('about', {
				url: '/about',
				templateUrl: 'views/about.html'
			})
			.state('case', {
				url: '/case/:id',
				templateUrl: 'views/case.html',
				controller: 'CaseCtrl'
			});
		}
	]);
