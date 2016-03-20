(function () {
  'use strict';

  // Candidates infos controller
  angular
    .module('candidates-infos')
    .controller('CandidatesInfosController', CandidatesInfosController);

  CandidatesInfosController.$inject = ['$scope', '$state', 'Authentication', 'candidatesInfoResolve'];

  function CandidatesInfosController ($scope, $state, Authentication, candidatesInfo) {
    var vm = this;

    vm.authentication = Authentication;
    vm.candidatesInfo = candidatesInfo;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Candidates info
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.candidatesInfo.$remove($state.go('candidates-infos.list'));
      }
    }

    // Save Candidates info
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.candidatesInfoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.candidatesInfo._id) {
        vm.candidatesInfo.$update(successCallback, errorCallback);
      } else {
        vm.candidatesInfo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('candidates-infos.view', {
          candidatesInfoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
