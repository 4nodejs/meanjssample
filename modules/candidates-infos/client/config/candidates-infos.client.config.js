(function () {
  'use strict';

  angular
    .module('candidates-infos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Candidates infos',
      state: 'candidates-infos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'candidates-infos', {
      title: 'List Candidates infos',
      state: 'candidates-infos.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'candidates-infos', {
      title: 'Create Candidates info',
      state: 'candidates-infos.create',
      roles: ['user']
    });
  }
})();
