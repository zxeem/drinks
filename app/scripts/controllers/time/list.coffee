controller = (scope)->

  scope.show = (id)->
    $('.nav-pills .active').removeClass('active')
    $('.tab-pane.active').removeClass('active')
    $('.nav-pills li#'+id).addClass 'active'
    $('.tab-pane#'+id).addClass 'active'
    ''

angular.module('manageApp')
  .controller 'TimeListCtrl',
  ['$scope', controller]
