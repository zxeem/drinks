service = ->
  newWater = (name='Water', cal=0)->
    name: "#{name}"
    cal: cal

  newCoffee = (name='Coffee', cal=0)->
    name: "#{name}"
    cal: cal

  crud = crud().config "drink"
  crud.newCoffee = newCoffee
  crud


angular.module('drinksApp')
  .factory 'Drink',
    ['Crud', service]