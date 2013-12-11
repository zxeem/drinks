// Generated by CoffeeScript 1.6.3
(function() {
  var controller;

  controller = function(scope, Service, timeout) {
    var aDay, amonthAgo, buildBieChartData, buildLists, dayMS, end, graphBieChart, indent, m, now;
    m = moment();
    dayMS = m.diff(moment().startOf('day'));
    scope.historyFilter = '';
    scope.tab = 'today';
    scope.entities = [];
    scope.history = [];
    scope.name = '';
    scope.tags = '';
    scope.tagsList = [];
    scope.namesList = [];
    buildBieChartData = function(entities) {
      var biedata, k, result, results, v;
      biedata = {};
      result = [];
      _.each(entities, function(e) {
        var _name;
        if (biedata[_name = e.get('tags')] == null) {
          biedata[_name] = 0;
        }
        return biedata[e.get('tags')] += 1;
      });
      console.log(biedata);
      return results = (function() {
        var _results;
        _results = [];
        for (k in biedata) {
          v = biedata[k];
          _results.push({
            'label': k,
            'value': v
          });
        }
        return _results;
      })();
    };
    graphBieChart = function(data) {
      var angle, arc, color, g, height, pie, r, svg, width;
      width = $(window).width() - 100;
      height = 500;
      r = Math.min(width, height) / 2;
      m = 10;
      color = d3.scale.category20();
      arc = d3.svg.arc().innerRadius(r / 2).outerRadius(r - m);
      pie = d3.layout.pie().sort(null).value(function(d) {
        return d.value;
      });
      angle = function(d) {
        var a;
        a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        if (a > 90) {
          return a - 180;
        } else {
          return a;
        }
      };
      svg = d3.select("#piechart svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + (width / 2) + ", " + (height / 2) + ")");
      g = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");
      g.append("path").attr("d", arc).style("fill", function(d) {
        return color(d.data.value);
      });
      g.append("svg:text").attr("transform", function(d) {
        var c;
        c = arc.centroid(d);
        if (r < 50) {
          c[0] = c[0] * 3;
          c[1] = c[1] * 3;
        }
        return "translate(" + c[0] + ", " + c[1] + ")rotate(" + (angle(d)) + ")";
      }).attr("dy", ".35em").style("text-anchor", "middle").text(function(d) {
        return "" + d.data.label + " (" + d.data.value + ")";
      });
      return svg.append("svg:text").attr("dy", ".35em").attr("text-anchor", "middle").text("Monthly shares \n " + scope.history.length);
    };
    buildLists = function(entities) {
      _.each(entities, function(e) {
        scope.tagsList.push(e.get('tags'));
        return scope.namesList.push(e.get('name'));
      });
      scope.tagsList = _.uniq(scope.tagsList);
      return scope.namesList = _.uniq(scope.namesList);
    };
    now = new Date();
    Service.list(now, new Date(now - dayMS), function(results) {
      return scope.$apply(function() {
        scope.entities = results;
        return buildLists(results);
      });
    });
    scope.remove = function(model) {
      return Service.remove(model, function() {
        return scope.$apply(function() {
          return scope.entities = _.filter(scope.entities, function(d) {
            return d.id !== model.id;
          });
        });
      });
    };
    scope.add = function() {
      var cb;
      cb = function(result) {
        return scope.$apply(function() {
          scope.entities.unshift(result);
          scope.name = '';
          return scope.tags = '';
        });
      };
      return Service.add(cb, scope.name, scope.tags);
    };
    scope.onRemove = function(model) {
      return scope.remove(model);
    };
    scope.onChange = function(model) {
      return Service.update(model);
    };
    scope.onDone = function(model) {
      if (scope.continus) {
        scope.name = model.get('name');
        scope.tags = model.get('tags');
        return scope.add();
      }
    };
    scope.again = function(model) {
      scope.name = model.get('name');
      scope.tags = model.get('tags');
      return scope.add();
    };
    scope.showHistory = function(switchtab, cb) {
      if (switchtab == null) {
        switchtab = true;
      }
      if (switchtab) {
        scope.tab = 'history';
      }
      if (scope.history.length > 0) {
        return typeof cb === "function" ? cb(scope.history) : void 0;
      } else {
        return Service.list(new Date(now - dayMS), new Date(0), function(results) {
          return scope.$apply(function() {
            console.log("Pomodoros count last month: " + results.length);
            scope.history = results;
            timeout(function() {
              return graphBieChart(buildBieChartData(results));
            });
            timeout(function() {
              return buildLists(results);
            });
            return typeof cb === "function" ? cb(results) : void 0;
          });
        });
      }
    };
    scope.isBar = true;
    amonthAgo = +(moment().subtract('days', 30).startOf('day'));
    aDay = 86400000;
    end = +(moment().add('days', 2).startOf('day'));
    scope.lastMonth = _.range(amonthAgo, end, aDay);
    indent = function(arr) {
      var a, day, i, index, lastMonth, _i, _len;
      lastMonth = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = scope.lastMonth.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(0);
        }
        return _results;
      })();
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        a = arr[_i];
        day = +(moment(a.createdAt).startOf('day'));
        index = _.indexOf(scope.lastMonth, day);
        if (!(index >= 0)) {
          continue;
        }
        lastMonth[index]++;
      }
      return lastMonth;
    };
    scope.c3BuildData = function(historyData) {
      var data, res;
      data = scope.entities.concat(historyData);
      data = _.groupBy(data, function(d) {
        return d.get('tags');
      });
      res = _.map(data, function(v, k) {
        return [k].concat(indent(v));
      });
      return res;
    };
    scope.showReports = function() {
      var graph;
      scope.tab = 'reports';
      graph = function(historyData) {
        var chart, columns, config, data, monthStrings, type, types;
        data = scope.c3BuildData(historyData);
        type = 'bar';
        types = scope.isBar ? _.zipObject(_.map(data, function(d) {
          return [d[0], type];
        })) : [];
        monthStrings = _.map(scope.lastMonth, function(d) {
          return moment(d).format('MM DD');
        });
        columns = [['date'].concat(monthStrings)].concat(data);
        config = {
          data: {
            x: 'date',
            x_format: '%m %d',
            columns: columns,
            types: types,
            groups: [_.map(data, _.first)]
          },
          axis: {
            x: {
              type: 'timeseries'
            }
          },
          subchart: {
            show: true
          }
        };
        return chart = c3.generate(config);
      };
      if (scope.history.length > 0) {
        return graph(scope.history);
      } else {
        return scope.showHistory(false, graph);
      }
    };
    scope.filtered = function(e) {
      var regex;
      regex = new RegExp(".*" + scope.historyFilter + ".*", 'i');
      if (!scope.historyFilter) {
        return true;
      }
      return regex.test(e.get('name')) || regex.test(e.get('tags'));
    };
    scope["switch"] = function() {
      $('#chart').empty();
      scope.isBar = !scope.isBar;
      return scope.showReports();
    };
    $('#whatispomodoro').popover({});
    return $('.withtooltip').tooltip({});
  };

  angular.module('manageApp').directive('pomodorolist', function() {
    return {
      templateUrl: "views/directives/pomodorolist.html",
      restrict: 'E',
      scope: true,
      controller: ['$scope', 'Pomodoro', '$timeout', controller]
    };
  });

}).call(this);

/*
//@ sourceMappingURL=pomodorolist.map
*/
