sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
  ],
  function(Controller, JSONModel) {
    'use strict';

    return Controller.extend('sap.ui.user.frontend.controller.App', {
      onOpenDialog: function(oEvent) {
        const oItem = oEvent.getSource();
        const role = oItem.getAggregation('firstStatus').getProperty('text');
        const number = oItem.getProperty('number').split(' ');
        const firstName = number[0];
        const lastName = number[1];
        const email = oItem.getProperty('title');
        const oViewModel = new JSONModel({
          firstName,
          lastName,
          email,
          role,
          password: '',
        });
        let oView = this.getView();
        let oDialog = this.byId('userDialog');
        if (!oDialog) {
          oDialog = sap.ui.xmlfragment(
            oView.getId(),
            'sap.ui.user.frontend.view.fragment.UserDialog',
            this,
          );
          oView.addDependent(oDialog);
        }

        this.getView().setModel(oViewModel, 'singleUser');
        oDialog.open();
      },

      onCloseDialog: function() {
        this.getView()
          .byId('userDialog')
          .close();
      },

      onSubmitForm: function() {
        const oView = this.getView();
        const oModel = oView.getModel('singleUser');
        const oDialog = oView.byId('userDialog');

        $.ajax({
          type: 'PUT',
          url: 'http://localhost:8081/api/users/update',
          dataType: 'json',
          data: JSON.stringify(oModel.getData()),
          contentType: 'application/json; charset=utf-8',
          success: function() {
            sap.m.MessageToast.show('User Updated');
            oDialog.close();
            oView.getModel().refresh(true);
          },

          error: function() {
            sap.m.MessageToast.show('Error while updating');
          },
        });
      },
    });
  },
);
