'use strict';
/**
 * @ngdoc overview
 * @name ngCheckVisaApp
 * @description
 * # ngCheckVisaApp
 *
 * Main module of the application.
 */
angular.module('ngCheckVisaApp', [
  'ui.router',
  'ui.bootstrap',
  'firebase',
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngTouch'
]).config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('main', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    }).state('about', {
      url: '/about',
      templateUrl: 'views/about.html'
    }).state('case', {
      url: '/case/:id',
      templateUrl: 'views/case.html',
      controller: 'CaseCtrl'
    });
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name ngCheckVisaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngCheckVisaApp
 */
angular.module('ngCheckVisaApp').controller('MainCtrl', [
  '$scope',
  '$state',
  function ($scope, $state) {
    var caseRef = new Firebase('https://checkvisa.firebaseio.com/cases'), ws = new WebSocket('ws://cloud.yhathq.com/richeliteys@gmail.com/models/CheckVisa/');
    ws.onopen = function (evt) {
      this.send(JSON.stringify({
        username: 'richeliteys@gmail.com',
        apikey: 'RoVGt5VDZfHkdBLx2rre76sg998cD4IuJiYzzNmNp48'
      }));
    };
    $scope.visaTypes = [
      'B1',
      'B2',
      'F1',
      'F2',
      'H1',
      'H4',
      'J1',
      'J2',
      'L1',
      'L2'
    ];
    $scope.visaEntries = [
      'New',
      'Renewal'
    ];
    $scope.locations = [
      'BeiJing',
      'ChengDu',
      'Europe',
      'GuangZhou',
      'HongKong',
      'Kolkata',
      'MexicoCity',
      'Montreal',
      'Mumbai',
      'NewDelhi',
      'Others',
      'Ottawa',
      'Quebec',
      'ShangHai',
      'ShenYang',
      'Tijiuana',
      'Toronto',
      'Vancouver'
    ];
    $scope.majors = [
      'Aerospace Engineering',
      'Agriculture',
      'Archeology',
      'Architecture',
      'Art',
      'Atmosphere & Marine Science',
      'Bio-engineering',
      'Biochemical Engineering',
      'Bioinformatics / Biostatistics',
      'Biology',
      'Biomedical Engineering',
      'Biophysics Engineering',
      'Business / Management',
      'Chemical Engineering',
      'Chemistry',
      'Civil Engineering',
      'Computer Science/Engineering',
      'Education',
      'Eletrical Engineering',
      'Energy',
      'English',
      'Environmental Science',
      'Finance',
      'Geography',
      'Geology',
      'Industrial Engineering',
      'Information Science/Technology',
      'Law',
      'MBA',
      'Materials Science/Engineering',
      'Mathematics',
      'Mechanical Engineering',
      'Medical Engineering',
      'Medicine / Pathology / Pharmacy',
      'Music',
      'N/A',
      'Neuroscience',
      'Nuclear Engineering',
      'Optic Engieering',
      'Physics',
      'Polymer',
      'Psychology',
      'Social Science',
      'Statistics',
      'Thermal Engineering',
      'Vehicle Engieering'
    ];
    $scope.case = {
      checkDate: new Date(),
      visaType: _.first($scope.visaTypes),
      visaEntry: _.first($scope.visaEntries),
      location: _.first($scope.locations),
      major: _.first($scope.majors)
    };
    $scope.predict = function () {
      var params = {
          loc: $scope.case.location,
          major: $scope.case.visaType === 'F1' ? $scope.case.major : '',
          vtype: $scope.case.visaType,
          ventry: $scope.case.visaEntry,
          byear: moment($scope.case.checkDate).get('year'),
          bmonth: moment($scope.case.checkDate).get('month') + 1,
          bday: moment($scope.case.checkDate).get('date')
        };
      ws.send(JSON.stringify(params));
      ws.onmessage = function (evt) {
        if (evt.data) {
          var rawPrediction = angular.fromJson(evt.data), prediction = {
              waitingDays: parseInt(rawPrediction.result.y[0]),
              upperInterval: rawPrediction.result.interval_upper[0],
              lowerInterval: rawPrediction.result.interval_lower[0]
            };
          prediction.predictDate = moment().format('l');
          prediction.clearDate = moment($scope.case.checkDate).add('days', prediction.waitingDays).format('l');
          var caseData = angular.extend({ input: params }, { prediction: prediction });
          var newCase = caseRef.push(caseData, function (error) {
              if (error) {
                console.log('Data could not be saved.' + error);
              }
            });
          var newCaseId = newCase.name();
          $state.go('case', { id: newCaseId });
        }
      };
    };
  }
]);
(function () {
  'use strict';
  angular.module('ngCheckVisaApp').controller('CaseCtrl', [
    '$scope',
    '$state',
    '$firebase',
    function ($scope, $state, $firebase) {
      $scope.caseId = $state.params.id;
      var caseRef = new Firebase('https://checkvisa.firebaseio.com/cases/' + $scope.caseId);
      $scope.case = $firebase(caseRef);
    }
  ]);
}());