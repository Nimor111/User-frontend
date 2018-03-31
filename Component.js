sap.ui.define(
  ['sap/ui/core/UIComponent', 'sap/ui/user/frontend/util/Utils'],
  function(UIComponent, Utils) {
    'use strict';

    return UIComponent.extend('sap.ui.user.frontend.Component', {
      metadata: {
        manifest: 'json',
      },

      init: function() {
        UIComponent.prototype.init.apply(this, arguments);

        this.oUtils = new Utils(this.byId('app'));
        this.oListUtils = new Utils(this.byId('usersListView'));
      },
    });
  },
);
