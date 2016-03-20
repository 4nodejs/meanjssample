'use strict';

/**
 * Module dependencies
 */
var candidatesInfosPolicy = require('../policies/candidates-infos.server.policy'),
  candidatesInfos = require('../controllers/candidates-infos.server.controller');

module.exports = function(app) {
  // Candidates infos Routes
  app.route('/api/candidates-infos').all(candidatesInfosPolicy.isAllowed)
    .get(candidatesInfos.list)
    .post(candidatesInfos.create);

  app.route('/api/candidates-infos/:candidatesInfoId').all(candidatesInfosPolicy.isAllowed)
    .get(candidatesInfos.read)
    .put(candidatesInfos.update)
    .delete(candidatesInfos.delete);

  // Finish by binding the Candidates info middleware
  app.param('candidatesInfoId', candidatesInfos.candidatesInfoByID);
};
