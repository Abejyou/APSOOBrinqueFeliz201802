(function () {
  'use strict';

  function resolvePath(file) {
    return path.resolve('templates/', file + '.html');
  }

  function getTemplate(page) {
    if (app.pages[page].template) return app.pages[page].template;
    app.pages[page].template = fs.readFileSync(resolvePath(page)).toString();
    return app.pages[page].template;
  }

  function App() {
    var self = this;

    self.pages = {};

    self.load = function (params) {
      if (!params) params = Array();
      if (!params.length) params[0] = 'produtos';
      var page = params[0];
      if (self.pages[page]) {
        params.pop();
        var template = getTemplate(page);
        $('.page-content').html(template);
        self.pages[page].start(params);
      } else {
        console.error('Classe ' + page + ' nao existe');
      }
    }

    self.start = function () {
      window.addEventListener('hashchange', function (event) {
        var params = location.hash.replace('#', '');
        params = params.split('/');
        self.load(params);
      }, false);
      self.load();
    }
  }

  window.app = new App();
  $(document).ready(function () {
    window.app.start();
  });
})();
