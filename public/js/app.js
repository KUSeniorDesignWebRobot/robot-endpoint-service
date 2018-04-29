'use strict';

var app = angular.module('myApp', ['rzModule', 'ui.bootstrap']);
var socket = io('http://localhost:3000');

app.controller('demo', function ($scope, $http, $log, $timeout) {
  $scope.sessionReady = false;
  $scope.reportMessages = [];
  $scope.controls = [];

  $scope.init = function demoInit() {
    // Set up session
    $http.post('/session', {}).then(function (data, status, headers) {
      $log.log(data);
      $scope.sessionId = data.data.sessionId;
      $scope.sessionToken = data.data.sessionToken;

      var messageBody = {
        sessionId: $scope.sessionId,
        sessionToken: $scope.sessionToken,
        robotId: robot.RobotId
      };
      $log.log(messageBody);
      socket.emit('establish', messageBody);
      socket.on('establish', function (res) {
        if (res.acknowledged == 'true') {
          $log.log(res);
          $scope.manifest = res.manifest;
          socket.on('reportMessage', $scope.onReportMessage);
          socket.on('close', $scope.onClose);
          $scope.sessionReady = true;
          $scope.$apply();
          $scope.ready();
        } else {
          $log.log(res);
          $log.warn('Session request rejected');
        }
      });
    });
  };

  $scope.ready = function ready() {
    $scope.createControls();
  };

  $scope.onReportMessage = function onReportMessage(message) {
    $log.info(message);
    $scope.reportMessages.push(message);
    $scope.$apply();
  };

  $scope.onClose = function onClose() {
    $log.info('Server closed connection');
  };

  $scope.sendMessage = function demoSendMessage() {
    socket.emit('commandMessage', $scope.cmessage);
    $log.info($scope.cmessage);
    $scope.cmessage = '';
  };

  $scope.sampleControls = function sampleControls() {};

  $scope.createControls = function createControls() {
    $scope.controls = $scope.manifest.actuators.map(function (actuator) {
      var floor = void 0,
          ceil = void 0;
      if (actuator.valueRange.gte !== undefined) {
        floor = actuator.valueRange.gte;
      } else if (actuator.valueRange.gt !== undefined) {
        floor = actuator.valueRange.gt + 1;
      }
      if (actuator.valueRange.lte !== undefined) {
        ceil = actuator.valueRange.lte;
      } else if (actuator.valueRange.lt !== undefined) {
        ceil = actuator.valueRange.lt - 1;
      }

      var control = {
        id: actuator._id,
        description: actuator.description,
        expirationBehavior: actuator.expirationBehavior,
        value: actuator.defaultValue,
        options: {
          floor: floor,
          ceil: ceil,
          step: 1,
          showSelectionBarFromValue: actuator.defaultValue,
          id: actuator._id
        }
      };
      if (actuator.expirationBehavior == "static") {
        control.options.onStart = function () {};
        control.options.onEnd = function () {
          control.value = actuator.defaultValue;
        };
      }
      return control;
    });
    $scope.$broadcast('rzSliderForceRender');
  };

  $scope.init();

  $log.info($scope.controls);
});