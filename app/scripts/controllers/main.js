'use strict';

angular.module('scrollviewTestApp')
  .controller('MainCtrl', function ($scope, $famous) {

    var EventHandler = $famous["famous/core/EventHandler"];
    var Transitionable = $famous['famous/transitions/Transitionable'];

    $scope.events = new EventHandler();

    $scope.t = new Transitionable(1);

    $scope.left = function() {
      var next = ($scope.t.get() === 0) ? 1 : 0;
      $scope.t.set(next, {duration: 100});
    };

    $scope.right = function() {
      var next = ($scope.t.get() === 2) ? 1 : 2;
      $scope.t.set(next, {duration: 100});
    };

  });
