const path = require('path');
const child_process = require('child_process');
const fs = require('fs');
const vm = require("vm");
const http = require("http");
const https = require("https");
const url = require('url');
const os = require('os');

(function ($) {
  'use strict';

  const _path = os.homedir();

  function createFolders(file, mode, nofile) {
    if (!file) return;
    mode = mode ? mode : '0777';
    var array = file.split(path.sep);
    var result = array[0];
    while (array.length > (nofile ? 0 : 1)) {
      if (fs.existsSync(result)) {
        array.shift();
        result += path.sep + array[0];
      } else {
        fs.mkdirSync(result, mode);
      }
    }
  }

  function resolvePath(table) {
    var file = path.resolve(_path, 'BrinquedoFeliz/', table + '.json');
    if (!fs.existsSync(file)) {
      createFolders(file);
      fs.writeFileSync(file, JSON.stringify({}));
    }
    return file;
  }


  function DB() {
    var self = this;

    self.table;
    self.cache;

    self.getById = function (id, callback) {
      return self.cache[id];
    }

    self.getAll = function (callback) {
      if (self.cache) {
        callback(self.cache);
        return;
      }
      fs.readFile(resolvePath(self.table), function (e, value) {
        var result = null;
        try {
          result = JSON.parse(value.toString());
        } catch (e) {
          console.error('Erro ao tentar ler o arquivo de banco');
        }
        if (result) {
          self.cache = result;
        }
        callback(result);
      });
    }

    self.update = function (id, data, callback) {
      if (!id) return;
      if (!data) return;
      $.extend(self.cache[id], data);
      fs.writeFile(resolvePath(self.table), JSON.stringify(self.cache), callback);
    }

    self.insert = function (data, callback) {
      if (!data) return;
      if (!callback) callback = () => {};
      if (!self.cache) {
        self.getAll(function (data, callback) {
          self.insert(data, callback)
        }.bind(this, data, callback));
        return;
      }
      var id = Object.keys(self.cache).length + 1;
      $.extend(self.cache, {
        [id]: data
      });
      fs.writeFile(resolvePath(self.table), JSON.stringify(self.cache), callback);
    }

  }

  window.DB = DB;
})($);
