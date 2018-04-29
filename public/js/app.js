'use strict';

var app = angular.module('myApp', ['rzModule', 'ui.bootstrap']);
var socket = io('http://localhost:3000');

function uuidv4() {
  // source: https://stackoverflow.com/a/2117523
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

app.controller('demo', function ($scope, $http, $log, $timeout, $interval) {
  $scope.sessionReady = false;
  $scope.reportMessages = [];
  $scope.controls = [];

  $scope.init = function demoInit() {
    $scope.robot = robot;
    $scope.configurationId = uuidv4(); //required by the spec but not used
    $scope.config = {
      ttl: 1000,
      sampleIntervalMillis: 50
    };

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
    $scope.sampleInterval = $interval($scope.sampleControls, $scope.config.sampleIntervalMillis);
  };

  $scope.onReportMessage = function onReportMessage(message) {
    $log.info(message);
    $scope.reportMessages.push(message);
    $scope.$apply();
  };

  $scope.onClose = function onClose() {
    $log.info('Server closed connection');
    $scope.stop();
  };

  $scope.sendMessage = function sendMessage(message) {
    var channel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'commandMessage';

    socket.emit(channel, message);
  };

  $scope.sampleControls = function sampleControls() {
    var sample_timestamp = Date.now() / 1000.0;
    var instructions = $scope.controls.map(function (control) {
      return {
        ttl: $scope.config.ttl,
        value: control.value,
        type: control.expirationBehavior,
        actuator_id: control.id,
        timestamp: sample_timestamp
      };
    });

    var commandMessage = {
      message_id: uuidv4(),
      message_type: "command",
      robot_id: $scope.robot.RobotId,
      configuration_id: $scope.configurationId,
      timestamp: sample_timestamp,
      session_id: $scope.sessionId,
      instructions: instructions
    };

    $scope.sendMessage(commandMessage);
  };

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
    $scope.$apply();
  };

  $scope.stop = function stop() {
    $scope.sampleInterval.cancel();
    // TODO
  };

  $scope.init();

  $log.info($scope.controls);
});