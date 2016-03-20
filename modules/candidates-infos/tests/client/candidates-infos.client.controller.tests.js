(function () {
  'use strict';

  describe('Candidates infos Controller Tests', function () {
    // Initialize global variables
    var CandidatesInfosController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CandidatesInfosService,
      mockCandidatesInfo;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CandidatesInfosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CandidatesInfosService = _CandidatesInfosService_;

      // create mock Candidates info
      mockCandidatesInfo = new CandidatesInfosService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Candidates info Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Candidates infos controller.
      CandidatesInfosController = $controller('Candidates infosController as vm', {
        $scope: $scope,
        candidatesInfoResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleCandidatesInfoPostData;

      beforeEach(function () {
        // Create a sample Candidates info object
        sampleCandidatesInfoPostData = new CandidatesInfosService({
          name: 'Candidates info Name'
        });

        $scope.vm.candidatesInfo = sampleCandidatesInfoPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (CandidatesInfosService) {
        // Set POST response
        $httpBackend.expectPOST('api/candidates-infos', sampleCandidatesInfoPostData).respond(mockCandidatesInfo);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Candidates info was created
        expect($state.go).toHaveBeenCalledWith('candidates-infos.view', {
          candidatesInfoId: mockCandidatesInfo._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/candidates-infos', sampleCandidatesInfoPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Candidates info in $scope
        $scope.vm.candidatesInfo = mockCandidatesInfo;
      });

      it('should update a valid Candidates info', inject(function (CandidatesInfosService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/candidates-infos\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('candidates-infos.view', {
          candidatesInfoId: mockCandidatesInfo._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (CandidatesInfosService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/candidates-infos\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Candidates infos
        $scope.vm.candidatesInfo = mockCandidatesInfo;
      });

      it('should delete the Candidates info and redirect to Candidates infos', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/candidates-infos\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('candidates-infos.list');
      });

      it('should should not delete the Candidates info and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
