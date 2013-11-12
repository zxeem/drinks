controller = (scope)->

  pomodoro = null

  scope.entities = []
  Pomodoro = Parse.Object.extend "Pomodoro"
  query = new Parse.Query Pomodoro
  query.find
    success: (results)->
      scope.$apply ->
        scope.entities = results
    error: (error)->
      console.log error

  scope.remove = (model)->
    model.destroy
      success: ->
        scope.$apply ->
          scope.entities = _.filter scope.entities, (d)->
            d.id != model.id
      error: (e)->
        console.log e

  scope.add = ()->
    pomodoro = new Pomodoro()
    pomodoro.set 'sprint', 25
    pomodoro.set 'count', 25
    pomodoro.set 'break', 5
    pomodoro.set "status", "work"
    pomodoro.save
      success: (result)->
        scope.$apply ->
          pomodoro = result
          scope.entities.push result
      error: (e)->
        console.log e

  scope.onRemove = (model)->
    scope.remove model

  scope.onChange = (model)->
    model.save
      success: ->
        console.log 'updated'
      error: (e)->
        console.log e


angular.module('drinksApp')
  .directive('pomodorolist', () ->
    templateUrl: "views/directives/pomodorolist.html"
    restrict: 'E'
    scope: true
    controller: ['$scope', controller]
  )
