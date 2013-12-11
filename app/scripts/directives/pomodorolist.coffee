controller = (scope, Service, timeout)->

  m = moment()
  dayMS = m.diff moment().startOf('day')

  scope.historyFilter = ''
  scope.tab = 'today'
  scope.entities = []
  scope.history = []
  scope.name = ''
  scope.tags = ''

  scope.tagsList = []
  scope.namesList = []

  buildLists = (entities)->
    _.each entities, (e)->
      scope.tagsList.push e.get('tags')
      scope.namesList.push e.get('name')
    scope.tagsList = _.uniq scope.tagsList
    scope.namesList = _.uniq scope.namesList
  #
  # Listing today
  now = new Date()
  Service.list now, new Date(now - dayMS), (results)->
    scope.$apply ->
      scope.entities = results
      buildLists results

  scope.remove = (model)->
    Service.remove model, ->
      scope.$apply ->
        scope.entities = _.filter scope.entities, (d)->
          d.id != model.id

  scope.add = ->
    cb = (result)->
      scope.$apply ->
        scope.entities.unshift result
        scope.name = ''
        scope.tags = ''

    Service.add cb, scope.name, scope.tags

  scope.onRemove = (model)->
    scope.remove model

  scope.onChange = (model)->
    Service.update model

  scope.onDone = (model)->
    if scope.continus
      scope.name = model.get('name')
      scope.tags = model.get('tags')
      scope.add()

  scope.again = (model)->
    scope.name = model.get('name')
    scope.tags = model.get('tags')
    scope.add()

  scope.showHistory = (switchtab=yes, cb)->
    scope.tab ='history' if switchtab
    # Listing history
    if scope.history.length > 0
      cb?(scope.history)
    else
      Service.list new Date(now - dayMS), new Date(0), (results)->
        scope.$apply ->
          console.log "Pomodoros count last month: #{results.length}"
          scope.history = results
          timeout -> buildLists results
          cb?(results)

  scope.isBar = yes

  scope.buildGraph = (data)->
    d3.select('svg g').remove()
    data = scope.buildData(scope.isBar, data)
    if scope.isBar
      chart = nv.models.multiBarChart()
    else
      chart = nv.models.cumulativeLineChart()
                .x((d)->d[0])
                .y((d)->d[1])
                .clipEdge(yes)
    chart.xAxis
      .axisLabel('Dates')
      .tickFormat((d)-> moment(d).format('MMM Do'))
    chart.yAxis
      .axisLabel('Pomodoris')
      .tickFormat d3.format(",.1f")
    d3.select("#reports svg").datum(data)
      .transition().duration(500).call chart
    nv.utils.windowResize chart.update
    chart

  scope.buildData = (isBar, historyData)->
    data = scope.entities.concat(historyData)
    data = _.groupBy data, (d)-> d.get('tags')
    data = _.map data, (arr, tag)->
      days = _.groupBy(arr, (d)->moment(d.createdAt).startOf('day').unix()*1000)
      v = _.map(days, (pomodoros, day)->
        count = if pomodoros then pomodoros.length else 0
        day = parseInt day
        if isBar then {x: day, y: count} else [day, count]
      )
      v = _.sortBy v, (d)->
        ret = if isBar then d.x else d[0]
        ret
      {key: tag, values: v}
    data = _.sortBy data, 'key'
    return data

  amonthAgo = +(moment().subtract('days', 30).startOf('day'))
  aDay = 86400000
  end = +(moment().add('days', 2).startOf('day'))
  scope.lastMonth = _.range(amonthAgo, end, aDay)

  indent = (arr)->
    lastMonth = (0 for i in [0...scope.lastMonth.length])
    for a in arr
      day = +(moment(a.createdAt).startOf('day'))
      index = _.indexOf scope.lastMonth, day
      continue unless index >= 0
      lastMonth[index]++

    return lastMonth

  scope.c3BuildData = (historyData)->
    data = scope.entities.concat(historyData)
    data = _.groupBy data, (d)-> d.get('tags')
    res = _.map data, (v, k)-> [k].concat indent(v)
    res

  scope.showReports = ->
    scope.tab = 'reports'
    graph = (historyData)->
      data = scope.c3BuildData historyData
      type = 'bar'
      types = if scope.isBar then _.zipObject _.map(data, (d)->[d[0], type]) else []
      monthStrings = _.map scope.lastMonth, (d)->
        moment(d).format 'MM DD'
      columns = [['date'].concat monthStrings].concat data
      config =
        data:
          x: 'date'
          x_format: '%m %d'
          columns: columns
          types: types
          groups: [_.map(data, _.first)]
        axis:
          x:
            type : 'timeseries'
        subchart:
          show: yes

      chart = c3.generate config

    if scope.history.length > 0
      graph scope.history
    else
      scope.showHistory no, graph

  scope.filtered = (e)->
    regex = new RegExp ".*#{scope.historyFilter}.*", 'i'
    return yes unless scope.historyFilter
    regex.test(e.get('name')) or regex.test(e.get('tags'))

  scope.switch = ->
    $('#chart').empty()
    scope.isBar = not scope.isBar
    scope.showReports()

  $('#whatispomodoro').popover({})
  $('.withtooltip').tooltip({})

angular.module('manageApp')
  .directive('pomodorolist', () ->
    templateUrl: "views/directives/pomodorolist.html"
    restrict: 'E'
    scope: true
    controller: ['$scope', 'Pomodoro', '$timeout', controller]
  )
