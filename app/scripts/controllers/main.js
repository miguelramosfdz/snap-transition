'use strict';

angular.module('scrollviewTestApp')
  .controller('MainCtrl', function ($scope, $famous, $timeline, $window) {

    var Transitionable = $famous['famous/transitions/Transitionable'];
    var Easing = $famous['famous/transitions/Easing'];

    $scope.sideWidth = window.innerWidth - 100;

    $scope.leftT = new Transitionable(1);
    $scope.rightT = new Transitionable(2);

    var states = {
      left: "entering",
      right: "leaving"
    }

    var duration = 300;

    $scope.goLeft = function() {
      states.left = "entering";
      states.right = "leaving";
      $scope.leftT.set(1, {duration: duration});
      $scope.rightT.set(2, {duration: duration});
    };

    $scope.goRight = function() {
      states.left = "leaving";
      states.right = "entering";
      $scope.leftT.set(0, {duration: duration});
      $scope.rightT.set(1, {duration: duration});
    };

    $scope.timelineFor = function(x) {
      if (states[x] === "entering") {
        return $scope.enter;
      }
      else {
        return $scope.exit;
      }
    };

    $scope.enter = {
      translate: $timeline([
        [0.5, [-$window.innerWidth, 0, 0]],
        [1, [0, 0, 0]],
        [1.5, [$window.innerWidth, 0, 0]]
      ]),
      opacity: function() { return 1; }
    };

    $scope.exit = {
      translate: $timeline([
        [0, [-$window.innerWidth * 0.2, 0, -1]],
        [1, [0, 0, -1]],
        [2, [$window.innerWidth * 0.2, 0, -1]]
      ]),
      opacity: $timeline([
        [0.3, 0],
        [1, 1],
        [1.7, 0]
      ])
    };


    window.l = $scope.leftT;

  });
