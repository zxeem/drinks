// Generated by CoffeeScript 1.6.3
(function() {
  var app, config, dependencies, rootController;

  config = function($routeProvider, $compileProvider) {
    var entities;
    Parse.initialize("WSGMmizuVjklAI6SpdIMBypeDCzKPUAo05QpWUnV", "OVNmBrjWj4ggScDNvKf159pVQM89vyNTlRIOIh4u");
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    $routeProvider.when("/", {
      redirectTo: '/pomodoro'
    });
    entities = {
      'Drink': ['Add', '_Edit', 'List', '_View'],
      'Todo': [],
      'Cash': [],
      'Idea': ['List']
    };
    _.each(entities, function(pages, e) {
      var id, le, lp, p, _i, _len, _results;
      le = e.toLowerCase();
      _results = [];
      for (_i = 0, _len = pages.length; _i < _len; _i++) {
        p = pages[_i];
        id = p[0] === '_' ? '/:id' : '';
        p = p[0] === '_' ? p.substring(1) : p;
        lp = p.toLowerCase();
        _results.push($routeProvider.when("/" + le + "/" + lp + id, {
          templateUrl: "views/" + le + "/" + lp + ".html",
          controller: "" + e + p + "Ctrl",
          access: 'user'
        }));
      }
      return _results;
    });
    $routeProvider.when('/signin', {
      templateUrl: 'views/signin.html',
      controller: 'SigninCtrl',
      access: 'public'
    });
    $routeProvider.when('/signup', {
      templateUrl: 'views/signup.html',
      controller: 'SignupCtrl',
      access: 'public'
    }).when('/pomodoro', {
      templateUrl: 'views/pomodoro.html',
      controller: 'PomodoroCtrl',
      access: 'user'
    }).when('/todo', {
      templateUrl: 'views/todo.html',
      controller: 'TodoCtrl',
      access: 'user'
    });
    return $routeProvider.otherwise({
      redirectTo: '/'
    });
  };

  dependencies = ['ui.bootstrap', 'ngRoute', 'dng.parse'];

  app = angular.module("manageApp", dependencies).config(config);

  rootController = function(root, location) {
    root.go = function(url) {
      return location.path('/' + url);
    };
    root.$on('$routeChangeStart', function(event, next) {
      if (next.access !== 'public' && !root.user) {
        return root.go('signin');
      }
    });
    if (Parse.User.current()) {
      return root.user = Parse.User.current();
    } else {
      return root.user = null;
    }
  };

  app.run(['$rootScope', '$location', rootController]);

}).call(this);

/*
//@ sourceMappingURL=app.map
*/
