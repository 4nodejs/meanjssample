(function () {
  'use strict';

  describe('Candidates infos Route Tests', function () {
    // Initialize global variables
    var $scope,
      CandidatesInfosService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CandidatesInfosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CandidatesInfosService = _CandidatesInfosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('candidates-infos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/candidates-infos');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CandidatesInfosController,
          mockCandidatesInfo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('candidates-infos.view');
          $templateCache.put('modules/candidates-infos/client/views/view-candidates-info.client.view.html', '');

          // create mock Candidates info
          mockCandidatesInfo = new CandidatesInfosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Candidates info Name'
          });

          //Initialize Controller
          CandidatesInfosController = $controller('CandidatesInfosController as vm', {
            $scope: $scope,
            candidatesInfoResolve: mockCandidatesInfo
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:candidatesInfoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.candidatesInfoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            candidatesInfoId: 1
          })).toEqual('/candidates-infos/1');
        }));

        it('should attach an Candidates info to the controller scope', function () {
          expect($scope.vm.candidatesInfo._id).toBe(mockCandidatesInfo._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/candidates-infos/client/views/view-candidates-info.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CandidatesInfosController,
          mockCandidatesInfo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('candidates-infos.create');
          $templateCache.put('modules/candidates-infos/client/views/form-candidates-info.client.view.html', '');

          // create mock Candidates info
          mockCandidatesInfo = new CandidatesInfosService();

          //Initialize Controller
          CandidatesInfosController = $controller('CandidatesInfosController as vm', {
            $scope: $scope,
            candidatesInfoResolve: mockCandidatesInfo
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.candidatesInfoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/candidates-infos/create');
        }));

        it('should attach an Candidates info to the controller scope', function () {
          expect($scope.vm.candidatesInfo._id).toBe(mockCandidatesInfo._id);
          expect($scope.vm.candidatesInfo._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/candidates-infos/client/views/form-candidates-info.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CandidatesInfosController,
          mockCandidatesInfo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('candidates-infos.edit');
          $templateCache.put('modules/candidates-infos/client/views/form-candidates-info.client.view.html', '');

          // create mock Candidates info
          mockCandidatesInfo = new CandidatesInfosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Candidates info Name'
          });

          //Initialize Controller
          CandidatesInfosController = $controller('CandidatesInfosController as vm', {
            $scope: $scope,
            candidatesInfoResolve: mockCandidatesInfo
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:candidatesInfoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.candidatesInfoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            candidatesInfoId: 1
          })).toEqual('/candidates-infos/1/edit');
        }));

        it('should attach an Candidates info to the controller scope', function () {
          expect($scope.vm.candidatesInfo._id).toBe(mockCandidatesInfo._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/candidates-infos/client/views/form-candidatesInfo.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
