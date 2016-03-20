(function () {
  'use strict';

  angular
    .module('candidates-infos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('candidates-infos', {
        abstract: true,
        url: '/candidates-infos',
        template: '<ui-view/>'
      })
      .state('candidates-infos.list', {
        url: '',
        templateUrl: 'modules/candidates-infos/client/views/list-candidates-infos.client.view.html',
        controller: 'CandidatesInfosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Candidates infos List'
        }
      })
      .state('candidates-infos.create', {
        url: '/create',
        templateUrl: 'modules/candidates-infos/client/views/form-candidates-info.client.view.html',
        controller: 'CandidatesInfosController',
        controllerAs: 'vm',
        resolve: {
          candidates-infoResolve: newCandidatesInfo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Candidates infos Create'
        }
      })
      .state('candidates-infos.edit', {
        url: '/:candidatesInfoId/edit',
        templateUrl: 'modules/candidates-infos/client/views/form-candidates-info.client.view.html',
        controller: 'CandidatesInfosController',
        controllerAs: 'vm',
        resolve: {
          candidates-infoResolve: getCandidatesInfo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Candidates info {{ candidates-infoResolve.name }}'
        }
      })
      .state('candidates-infos.view', {
        url: '/:candidatesInfoId',
        templateUrl: 'modules/candidates-infos/client/views/view-candidates-info.client.view.html',
        controller: 'CandidatesInfosController',
        controllerAs: 'vm',
        resolve: {
          candidates-infoResolve: getCandidatesInfo
        },
        data:{
          pageTitle: 'Candidates info {{ articleResolve.name }}'
        }
      });
  }

  getCandidatesInfo.$inject = ['$stateParams', 'CandidatesInfosService'];

  function getCandidatesInfo($stateParams, CandidatesInfosService) {
    return CandidatesInfosService.get({
      candidatesInfoId: $stateParams.candidatesInfoId
    }).$promise;
  }

  newCandidatesInfo.$inject = ['CandidatesInfosService'];

  function newCandidatesInfo(CandidatesInfosService) {
    return new CandidatesInfosService();
  }
})();
