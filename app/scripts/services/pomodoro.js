// Generated by CoffeeScript 1.6.3
(function() {
  var onError, service;

  onError = function(error) {
    return console.log(error);
  };

  service = (function() {
    function service() {
      this.Pomodoro = Parse.Object.extend("Pomodoro");
    }

    service.prototype.list = function(end, start, cb) {
      var query;
      if (end == null) {
        end = new Date();
      }
      if (start == null) {
        start = new Date(0);
      }
      query = new Parse.Query(this.Pomodoro);
      query.lessThan('createdAt', new Date(end.getTime()));
      query.greaterThan('createdAt', new Date(start.getTime()));
      query.descending('createdAt');
      query.limit(1000);
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

    service.prototype.add = function(cb, name, tags, sprint, rest) {
      var pomodoro;
      if (name == null) {
        name = '';
      }
      if (tags == null) {
        tags = '';
      }
      if (sprint == null) {
        sprint = 25 * 60;
      }
      if (rest == null) {
        rest = 5 * 60;
      }
      pomodoro = new this.Pomodoro();
      pomodoro.set('sprint', sprint);
      pomodoro.set('rest', rest);
      pomodoro.set("status", "work");
      pomodoro.set("name", name);
      pomodoro.set("tags", tags);
      pomodoro.set("pause", {});
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

  angular.module('manageApp').service('Pomodoro', service);

}).call(this);

/*
//@ sourceMappingURL=pomodoro.map
*/
