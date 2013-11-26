// Generated by CoffeeScript 1.6.3
(function() {
  var onError, service;

  onError = function(error) {
    return console.log(error);
  };

  service = (function() {
    function service() {
      this.Entity = Parse.Object.extend("Idea");
    }

    service.prototype.list = function(cb) {
      var query;
      query = new Parse.Query(this.Entity);
      return query.find({
        success: cb,
        error: onError
      });
    };

    service.prototype.remove = function(model, cb) {
      return model.destroy({
        success: cb,
        error: onError
      });
    };

    service.prototype.add = function(cb, name, parent) {
      var idea;
      if (name == null) {
        name = '';
      }
      if (parent == null) {
        parent = 'Ideas';
      }
      idea = new this.Entity();
      pomodoro.set("parent", name);
      pomodoro.set("name", name);
      pomodoro.setACL(new Parse.ACL(Parse.User.current()));
      return pomodoro.save({
        success: cb,
        error: onError
      });
    };

    service.prototype.update = function(model, cb) {
      return model.save({
        success: cb,
        error: onError
      });
    };

    return service;

  })();

  angular.module('manageApp').service('Idea', service);

}).call(this);

/*
//@ sourceMappingURL=idea.map
*/
