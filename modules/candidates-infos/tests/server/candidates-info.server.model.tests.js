'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CandidatesInfo = mongoose.model('CandidatesInfo');

/**
 * Globals
 */
var user, candidatesInfo;

/**
 * Unit tests
 */
describe('Candidates info Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      candidatesInfo = new CandidatesInfo({
        name: 'Candidates info Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return candidatesInfo.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) { 
      candidatesInfo.name = '';

      return candidatesInfo.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    CandidatesInfo.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
