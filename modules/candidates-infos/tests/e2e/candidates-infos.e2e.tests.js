'use strict';

describe('Candidates infos E2E Tests:', function () {
  describe('Test Candidates infos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/candidates-infos');
      expect(element.all(by.repeater('candidates-info in candidates-infos')).count()).toEqual(0);
    });
  });
});
