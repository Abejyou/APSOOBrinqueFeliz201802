(function (app, DB) {
  'use strict';

  function addActionTable() {
    $('tbody [data]').click(actionTable);
  }

  function actionTable(event) {
    var content = $(event.target).text();
    var name = $(event.target).attr('data');
    var id = $(event.target).parent('tr').attr('data-id');
    console.log(name);
    var clone = $('[name="' + name + '"]').clone();
    clone.attr('value', content);
    clone.attr('data-id', id);
    $(event.target).html(clone);
    $(event.target).find('input').focus();
    $(event.target).find('input').on('blur', editTable);
  }

  function editTable(event) {
    var name = $(event.target).attr('name');
    var id = $(event.target).attr('data-id');
    app.pages.produtos.update(id, {
      [name]: $(event.target).val()
    });
    $(event.target).parent().html($(event.target).val());
  }

  function Produtos() {
    var self = this;

    self.db;
    self.template;

    self.update = function (id, data) {
      self.db.update(id, data, function () {});
    }

    self.add = function (data) {
      self.db.insert(data, function () {
        self.list();
        $('form input').val('');
      });
    }

    self.list = function () {
      self.db.getAll(function (data) {
        $('tbody').html('');
        for (var id in data) {
          var clone = $(self.template).find('[js-for]').clone();
          clone.find('[data=nome]').html(data[id].nome);
          clone.find('[data=quantidade]').html(data[id].quantidade);
          clone.find('[data=valor]').html(data[id].valor);
          clone.attr('data-id', id);
          $('tbody').append(clone);
        }
        addActionTable();
      });
    }

    self.start = function (params) {
      if (!self.db) self.db = new DB();
      self.db.table = 'produtos';

      $('form').on('submit', function (event) {
        stopevent(event);
        var postdata = getDataForm(event.target);
        self.add(postdata);
        return false;
      });
      self.list();
      window.componentHandler.upgradeAllRegistered();
      $('form input').attr('required', true);
    }
  }

  app.pages.produtos = new Produtos();

})(app, DB);
