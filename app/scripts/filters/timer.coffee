filter = ->
  (input) ->
    if input > 60
      input /= 60
    "#{parseInt(input, 10)}"
    
angular.module('drinksApp')
  .filter 'timer', filter
