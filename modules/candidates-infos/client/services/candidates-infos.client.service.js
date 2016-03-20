//Candidates infos service used to communicate Candidates infos REST endpoints
(function () {
  'use strict';

  angular
    .module('candidates-infos')
    .factory('CandidatesInfosService', CandidatesInfosService);

  CandidatesInfosService.$inject = ['$resource'];

  function CandidatesInfosService($resource) {
    return $resource('api/candidates-infos/:candidatesInfoId', {
      candidatesInfoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
