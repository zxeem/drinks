// Generated by CoffeeScript 1.6.3
(function() {
  var crud;

  crud = function() {
    return function() {
      var config, create, get, handler, list, remove, rest, update;
      rest = {};
      handler = function(cb, errCB) {
        return function(err, data) {
          if (err) {
            return errCB(err);
          } else {
            return typeof cb === "function" ? cb(data) : void 0;
          }
        };
      };
      list = function(cb, errCB) {
        return rest.all(handler(cb, errCB));
      };
      get = withCache(function(id, cb, errCB) {
        return rest.get(id, handler(cb, errCB));
      });
      create = function(obj, cb, errCB) {
        return rest.put(Date.now(), obj, handler(cb, errCB));
      };
      update = function(obj, cb, errCB) {
        return rest.put(obj.id, obj, handler(cb, errCB));
      };
      remove = function(id, cb, errCB) {
        return rest.del(id, handler(cb, errCB));
      };
      config = function(api, baseUrl) {
        if (baseUrl == null) {
          baseUrl = '/app/api';
        }
        rest = new Indexed(api, {
          key: 'id'
        });
        return this;
      };
      return {
        config: config,
        list: list,
        get: get,
        create: create,
        update: update,
        remove: remove
      };
    };
  };

  angular.module('drinksApp').factory('Crud', crud);

}).call(this);

/*
//@ sourceMappingURL=crud.map
*/