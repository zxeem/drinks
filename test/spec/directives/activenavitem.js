// Generated by CoffeeScript 1.6.3
(function() {
  'use strict';
  describe('Directive: activenavitem', function() {
    var element;
    beforeEach(module('drinksApp'));
    element = {};
    return it('should make hidden element visible', inject(function($rootScope, $compile) {
      element = angular.element('<activenavitem></activenavitem>');
      element = $compile(element)($rootScope);
      return expect(element.text()).toBe('this is the activenavitem directive');
    }));
  });

}).call(this);
