'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CandidatesInfo = mongoose.model('CandidatesInfo'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Candidates info
 */
exports.create = function(req, res) {
  var candidatesInfo = new CandidatesInfo(req.body);
  candidatesInfo.user = req.user;

  candidatesInfo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(candidatesInfo);
    }
  });
};

/**
 * Show the current Candidates info
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var candidatesInfo = req.candidatesInfo ? req.candidatesInfo.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  candidatesInfo.isCurrentUserOwner = req.user && candidatesInfo.user && candidatesInfo.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(candidatesInfo);
};

/**
 * Update a Candidates info
 */
exports.update = function(req, res) {
  var candidatesInfo = req.candidatesInfo ;

  candidatesInfo = _.extend(candidatesInfo , req.body);

  candidatesInfo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(candidatesInfo);
    }
  });
};

/**
 * Delete an Candidates info
 */
exports.delete = function(req, res) {
  var candidatesInfo = req.candidatesInfo ;

  candidatesInfo.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(candidatesInfo);
    }
  });
};

/**
 * List of Candidates infos
 */
exports.list = function(req, res) { 
  CandidatesInfo.find().sort('-created').populate('user', 'displayName').exec(function(err, candidatesInfos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(candidatesInfos);
    }
  });
};

/**
 * Candidates info middleware
 */
exports.candidatesInfoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Candidates info is invalid'
    });
  }

  CandidatesInfo.findById(id).populate('user', 'displayName').exec(function (err, candidatesInfo) {
    if (err) {
      return next(err);
    } else if (!candidatesInfo) {
      return res.status(404).send({
        message: 'No Candidates info with that identifier has been found'
      });
    }
    req.candidatesInfo = candidatesInfo;
    next();
  });
};
