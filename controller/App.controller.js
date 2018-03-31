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
          password: null,
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

      onClosePostDialog: function() {
        this.getView()
          .byId('createDialog')
          .close();
      },

      onSubmitForm: function() {
        const oView = this.getView();
        const oModel = oView.getModel('singleUser');
        const oDialog = oView.byId('userDialog');
        const data = oModel.getData();

        if (data.password == null) {
          sap.m.MessageToast.show('Please fill in a password!');
          return;
        }

        $.ajax({
          type: 'PUT',
          url: 'http://localhost:8081/api/users/update',
          dataType: 'json',
          data: JSON.stringify(data),
          contentType: 'application/json; charset=utf-8',
          success: function() {
            sap.m.MessageToast.show('User Updated');
            oDialog.close();
            console.log(oView.getModel('users'));
            oView.getModel('users').refresh();
            console.log(oView.getModel('users'));
          },

          error: function() {
            sap.m.MessageToast.show('Error during update!');
          },
        });
      },

      onSubmitPostForm: function() {
        const oView = this.getView();
        const oModel = oView.getModel('newUser');
        const oDialog = oView.byId('createDialog');
        const data = oModel.getData();

        data.role = this.getView()
          .byId('selectRole')
          .getSelectedItem()
          .getProperty('text');

        if (data.email == null) {
          sap.m.MessageToast.show('Input an email!');
          return;
        }

        $.ajax({
          type: 'POST',
          url: 'http://localhost:8081/api/users/create',
          dataType: 'json',
          data: JSON.stringify(data),
          contentType: 'application/json; charset=utf-8',
          success: function() {
            sap.m.MessageToast.show('User created');
            oDialog.close();
            console.log(oView.getModel('users'));
            oView.getModel('users').refresh();
            console.log(oView.getModel('users'));
          },

          error: function() {
            sap.m.MessageToast.show('Error during creation!');
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

      onDeleteUser: function() {
        console.log('Clicked delete');

        const oView = this.getView();
        const oModel = oView.getModel('singleUser');
        const oDialog = oView.byId('userDialog');
        const data = oModel.getData();

        $.ajax({
          type: 'DELETE',
          url: 'http://localhost:8081/api/users/delete/' + data.email,
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          success: function() {
            sap.m.MessageToast.show('User deleted');
            oDialog.close();
            oView.getModel('users').refresh();
          },

          error: function() {
            sap.m.MessageToast.show('Error during deletion!');
          },
        });
      },
    });
  },
);
