sap.ui.define(
  ['sap/ui/base/ManagedObject', 'sap/ui/model/json/JSONModel'],
  function(ManagedObject, JSONModel) {
    'use strict';

    return ManagedObject.extend('sap.ui.user.frontend.util.Utils', {
      closeDialog: function(dialog) {
        dialog.close();
      },

      populateExistingUser: function(oItem) {
        const role = oItem.getAggregation('firstStatus').getProperty('text');
        const fullName = oItem.getProperty('number').split(' ');
        const firstName = fullName[0];
        const lastName = fullName[1];
        const email = oItem.getProperty('title');
        const oExistingUser = new JSONModel({
          firstName,
          lastName,
          email,
          role,
          password: null,
        });

        return oExistingUser;
      },
    });
  },
);
