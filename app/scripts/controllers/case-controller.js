(function () {
	'use strict';

	angular.module('ngCheckVisaApp')
		.controller('CaseCtrl', [ '$scope', '$state', '$firebase',
			function ($scope, $state, $firebase) {
				$scope.caseId = $state.params.id;
				var caseRef = new Firebase("https://checkvisa.firebaseio.com/cases/" + $scope.caseId);
				$scope.case = $firebase(caseRef);
			}
		])
})();
