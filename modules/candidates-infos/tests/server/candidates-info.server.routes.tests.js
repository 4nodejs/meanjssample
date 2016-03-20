'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CandidatesInfo = mongoose.model('CandidatesInfo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, candidatesInfo;

/**
 * Candidates info routes tests
 */
describe('Candidates info CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Candidates info
    user.save(function () {
      candidatesInfo = {
        name: 'Candidates info name'
      };

      done();
    });
  });

  it('should be able to save a Candidates info if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Candidates info
        agent.post('/api/candidatesInfos')
          .send(candidatesInfo)
          .expect(200)
          .end(function (candidatesInfoSaveErr, candidatesInfoSaveRes) {
            // Handle Candidates info save error
            if (candidatesInfoSaveErr) {
              return done(candidatesInfoSaveErr);
            }

            // Get a list of Candidates infos
            agent.get('/api/candidatesInfos')
              .end(function (candidatesInfosGetErr, candidatesInfosGetRes) {
                // Handle Candidates info save error
                if (candidatesInfosGetErr) {
                  return done(candidatesInfosGetErr);
                }

                // Get Candidates infos list
                var candidatesInfos = candidatesInfosGetRes.body;

                // Set assertions
                (candidatesInfos[0].user._id).should.equal(userId);
                (candidatesInfos[0].name).should.match('Candidates info name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Candidates info if not logged in', function (done) {
    agent.post('/api/candidatesInfos')
      .send(candidatesInfo)
      .expect(403)
      .end(function (candidatesInfoSaveErr, candidatesInfoSaveRes) {
        // Call the assertion callback
        done(candidatesInfoSaveErr);
      });
  });

  it('should not be able to save an Candidates info if no name is provided', function (done) {
    // Invalidate name field
    candidatesInfo.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Candidates info
        agent.post('/api/candidatesInfos')
          .send(candidatesInfo)
          .expect(400)
          .end(function (candidatesInfoSaveErr, candidatesInfoSaveRes) {
            // Set message assertion
            (candidatesInfoSaveRes.body.message).should.match('Please fill Candidates info name');

            // Handle Candidates info save error
            done(candidatesInfoSaveErr);
          });
      });
  });

  it('should be able to update an Candidates info if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Candidates info
        agent.post('/api/candidatesInfos')
          .send(candidatesInfo)
          .expect(200)
          .end(function (candidatesInfoSaveErr, candidatesInfoSaveRes) {
            // Handle Candidates info save error
            if (candidatesInfoSaveErr) {
              return done(candidatesInfoSaveErr);
            }

            // Update Candidates info name
            candidatesInfo.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Candidates info
            agent.put('/api/candidatesInfos/' + candidatesInfoSaveRes.body._id)
              .send(candidatesInfo)
              .expect(200)
              .end(function (candidatesInfoUpdateErr, candidatesInfoUpdateRes) {
                // Handle Candidates info update error
                if (candidatesInfoUpdateErr) {
                  return done(candidatesInfoUpdateErr);
                }

                // Set assertions
                (candidatesInfoUpdateRes.body._id).should.equal(candidatesInfoSaveRes.body._id);
                (candidatesInfoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Candidates infos if not signed in', function (done) {
    // Create new Candidates info model instance
    var candidatesInfoObj = new CandidatesInfo(candidatesInfo);

    // Save the candidatesInfo
    candidatesInfoObj.save(function () {
      // Request Candidates infos
      request(app).get('/api/candidatesInfos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Candidates info if not signed in', function (done) {
    // Create new Candidates info model instance
    var candidatesInfoObj = new CandidatesInfo(candidatesInfo);

    // Save the Candidates info
    candidatesInfoObj.save(function () {
      request(app).get('/api/candidatesInfos/' + candidatesInfoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', candidatesInfo.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Candidates info with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/candidatesInfos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Candidates info is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Candidates info which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Candidates info
    request(app).get('/api/candidatesInfos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Candidates info with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Candidates info if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Candidates info
        agent.post('/api/candidatesInfos')
          .send(candidatesInfo)
          .expect(200)
          .end(function (candidatesInfoSaveErr, candidatesInfoSaveRes) {
            // Handle Candidates info save error
            if (candidatesInfoSaveErr) {
              return done(candidatesInfoSaveErr);
            }

            // Delete an existing Candidates info
            agent.delete('/api/candidatesInfos/' + candidatesInfoSaveRes.body._id)
              .send(candidatesInfo)
              .expect(200)
              .end(function (candidatesInfoDeleteErr, candidatesInfoDeleteRes) {
                // Handle candidatesInfo error error
                if (candidatesInfoDeleteErr) {
                  return done(candidatesInfoDeleteErr);
                }

                // Set assertions
                (candidatesInfoDeleteRes.body._id).should.equal(candidatesInfoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Candidates info if not signed in', function (done) {
    // Set Candidates info user
    candidatesInfo.user = user;

    // Create new Candidates info model instance
    var candidatesInfoObj = new CandidatesInfo(candidatesInfo);

    // Save the Candidates info
    candidatesInfoObj.save(function () {
      // Try deleting Candidates info
      request(app).delete('/api/candidatesInfos/' + candidatesInfoObj._id)
        .expect(403)
        .end(function (candidatesInfoDeleteErr, candidatesInfoDeleteRes) {
          // Set message assertion
          (candidatesInfoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Candidates info error error
          done(candidatesInfoDeleteErr);
        });

    });
  });

  it('should be able to get a single Candidates info that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Candidates info
          agent.post('/api/candidatesInfos')
            .send(candidatesInfo)
            .expect(200)
            .end(function (candidatesInfoSaveErr, candidatesInfoSaveRes) {
              // Handle Candidates info save error
              if (candidatesInfoSaveErr) {
                return done(candidatesInfoSaveErr);
              }

              // Set assertions on new Candidates info
              (candidatesInfoSaveRes.body.name).should.equal(candidatesInfo.name);
              should.exist(candidatesInfoSaveRes.body.user);
              should.equal(candidatesInfoSaveRes.body.user._id, orphanId);

              // force the Candidates info to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Candidates info
                    agent.get('/api/candidatesInfos/' + candidatesInfoSaveRes.body._id)
                      .expect(200)
                      .end(function (candidatesInfoInfoErr, candidatesInfoInfoRes) {
                        // Handle Candidates info error
                        if (candidatesInfoInfoErr) {
                          return done(candidatesInfoInfoErr);
                        }

                        // Set assertions
                        (candidatesInfoInfoRes.body._id).should.equal(candidatesInfoSaveRes.body._id);
                        (candidatesInfoInfoRes.body.name).should.equal(candidatesInfo.name);
                        should.equal(candidatesInfoInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      CandidatesInfo.remove().exec(done);
    });
  });
});
