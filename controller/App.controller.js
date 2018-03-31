sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
  ],
  function(Controller, JSONModel, MessageToast) {
    'use strict';

    return Controller.extend('sap.ui.user.frontend.controller.App', {
      onClosePostDialog: function() {
        this.getOwnerComponent().oUtils.closeDialog(
          this.getView().byId('createDialog'),
        );
      },

      onSubmitPostForm: function() {
        const oView = this.getView();
        const oDialog = oView.byId('createDialog');
        const data = oView.getModel('newUser').getData();

        data.role = this.getView()
          .byId('selectRole')
          .getSelectedItem()
          .getProperty('text');

        if (data.email === null) {
          MessageToast.show('Input an email!');
          return;
        }

        $.ajax({
          type: 'POST',
          url: 'http://localhost:8081/api/users/create',
          dataType: 'json',
          data: JSON.stringify(data),
          contentType: 'application/json; charset=utf-8',
          success: function() {
            MessageToast.show('User created');
            oDialog.close();
          },

          error: function() {
            MessageToast.show('Error during creation!');
          },
        });
      },

      onOpenCreateDialog: function() {
        const oViewModel = new JSONModel({
          firstName: null,
          lastName: null,
          email: null,
          role: null,
        });
        let oView = this.getView();
        let oDialog = this.byId('createDialog');
        if (!oDialog) {
          oDialog = sap.ui.xmlfragment(
            oView.getId(),
            'sap.ui.user.frontend.view.fragment.CreateDialog',
            this,
          );
          oView.addDependent(oDialog);
        }

        this.getView().setModel(oViewModel, 'newUser');
        oDialog.open();
      },
    });
  },
);
