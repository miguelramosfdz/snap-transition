'use strict';

angular.module('scrollviewTestApp')
  .directive('trifold', function ($famous, $famousDecorator, $timeline) {
    return {
      template: '<div></div>',
      transclude: true,
      restrict: 'E',
      scope: true,
      compile: function(tElement, tAttrs, transclude){
        return {
          pre: function(scope, element, attrs){


            var isolate = $famousDecorator.ensureIsolate(scope);

            var RenderNode = $famous['famous/core/RenderNode'];
            var Modifier = $famous['famous/core/Modifier'];
            var Transform = $famous['famous/core/Transform'];
            var Transitionable = $famous['famous/transitions/Transitionable'];
            var TouchSync  = $famous["famous/inputs/TouchSync"];


            var getOrValue = function(x) {
              return x.get ? x.get() : x;
            };

            isolate._children = [];

            isolate.renderNode = new RenderNode();


            $famousDecorator.addRole('renderable',isolate);
            isolate.show();

            var t = scope.$eval(attrs.timeline) || new Transitionable(1);
            var fakeT = function() {
              var period = 1000;
              return Math.sin(Date.now() / 1000) + 1;
            };

            var linear = function(x) { return x; };

            var maybeWidth = function(i) {
              return function() {
                if (isolate._children[i]) return isolate._children[i].getSize()[0] || window.innerWidth;
                else return 0;
              };
            };

            var leftWidth = maybeWidth(0);
            var rightWidth = maybeWidth(2);

            var groupMod  = new Modifier({
              transform: function() {
                var x = $timeline([
                  [0, 0, linear],
                  [1, -position(1), linear],
                  [2, -(position(3) - position(2) + position(1))]
                ])(t.get());
                return Transform.translate(x, 0, 0);
              }
            });

            var groupModNode = isolate.renderNode.add(groupMod);

            var position = function(i) {
              if (i === 0) return 0;
              else return maybeWidth(i - 1)() + position(i - 1);
            };

            window.position = position;
            window.maybeWidth = maybeWidth;

            // syncing

            var inEvents = scope.$eval(attrs.pipeFrom);

            var sync = new TouchSync();
            inEvents.pipe(sync);

            sync.on('update', function(data) {
              t.set(t.get() - data.delta[0] / 300);
              console.log("t", t.get());
            });

            sync.on('end', function(data) {
              console.log("velocity ", data.velocity[0]);
              if (Math.abs(data.velocity[0]) > 0.5) {
                var next = data.velocity[0] > 0 ? Math.floor(t.get()) : Math.ceil(t.get());
                console.log("next", next);
              }
              else {
                var next = Math.round(t.get())
              }
              t.set(next, {duration: 100});
            });

            $famousDecorator.sequenceWith(scope, function(data) {

              var modifier = new Modifier();
              var i = isolate._children.length;
              modifier.transformFrom(function() {
                return Transform.translate(position(i), 0, 0);
              });

              groupModNode.add(modifier).add(data.renderGate);
              isolate._children.push(data.renderGate);

            });

          },
          post: function(scope, element, attrs){
            var isolate = $famousDecorator.ensureIsolate(scope);

            transclude(scope, function(clone) {
              element.find('div').append(clone);
            });

            $famousDecorator.registerChild(scope, element, isolate);
          }
        };
      }
    };
  });
