(function () {
  'use strict';

  angular
    .module('candidates-infos')
    .controller('CandidatesInfosListController', CandidatesInfosListController);

  CandidatesInfosListController.$inject = ['CandidatesInfosService'];

  function CandidatesInfosListController(CandidatesInfosService) {
    var vm = this;

    vm.candidatesInfos = CandidatesInfosService.query();
  }
})();
