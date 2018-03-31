sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/m/MessageToast'], function(
  Controller,
  MessageToast,
) {
  'use strict';

  return Controller.extend('sap.ui.user.frontend.controller.UsersList', {
    onOpenDialog: function(oEvent) {
      const oItem = oEvent.getSource();
      const oViewModel = this.getOwnerComponent().oListUtils.populateExistingUser(
        oItem,
      );
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

      oView.setModel(oViewModel, 'singleUser');
      oDialog.open();
    },

    onCloseDialog: function() {
      this.getOwnerComponent().oListUtils.closeDialog(
        this.getView().byId('userDialog'),
      );
    },

    onSubmitForm: function() {
      const oView = this.getView();
      const oDialog = oView.byId('userDialog');
      const data = oView.getModel('singleUser').getData();

      if (data.password === null) {
        MessageToast.show('Please fill in a password!');
        return;
      }

      $.ajax({
        type: 'PUT',
        url: 'http://localhost:8081/api/users/update',
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function() {
          MessageToast.show('User Updated');
          oDialog.close();
        },

        error: function() {
          MessageToast.show('Error during update!');
        },
      });
    },

    onDeleteUser: function() {
      const oView = this.getView();
      const oDialog = oView.byId('userDialog');
      const data = oView.getModel('singleUser').getData();

      $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8081/api/users/delete/' + data.email,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function() {
          MessageToast.show('User deleted');
          oDialog.close();
        },

        error: function() {
          MessageToast.show('Error during deletion!');
        },
      });
    },
  });
});
