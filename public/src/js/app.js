var app = angular.module('myApp', ['rzModule', 'ui.bootstrap']);
var socket = io('http://localhost:3000');

const manifest = {
  "robot_id": "067c8c59-710a-4c15-8265-b7f1e49b828c",
  "description": "This is our demo robot manifest",
  "actuators": [{
      "description": "right hand open/close",
      "_id": "0083ef20-81ed-4746-8fd9-069309c73bab",
      "valueRange": {
        "gte": 500,
        "lte": 2500
      },
      "channel": 2,
      "expirationBehavior": "static",
      "defaultValue": 1500
    },
    {
      "description": "right wrist rotate",
      "_id": "e1b97e17-9cd3-4361-9df3-04db98d0c829",
      "valueRange": {
        "gte": 500,
        "lte": 2500
      },
      "channel": 3,
      "expirationBehavior": "dynamic",
      "defaultValue": 1500
    },
    {
      "description": "right wrist up/down",
      "_id": "666b086f-19ca-4ab0-bfa8-a8b55fb21a3b",
      "valueRange": {
        "gte": 500,
        "lte": 2500
      },
      "channel": 4,
      "expirationBehavior": "dynamic",
      "defaultValue": 1500
    },
    {
      "description": "right shoulder sideways up/down",
      "_id": "78e7c177-9e01-4447-bb7f-bc08ff7e0932",
      "valueRange": {
        "gte": 500,
        "lte": 1700
      },
      "channel": 5,
      "expirationBehavior": "dynamic",
      "defaultValue": 1500
    },
    {
      "description": "right shoulder rotate forward/back",
      "_id": "cf162a81-4e7e-43a9-b763-45442920080e",
      "valueRange": {
        "gte": 500,
        "lte": 2500
      },
      "channel": 7,
      "expirationBehavior": "dynamic",
      "defaultValue": 1500
    },
    {
      "description": "torso base rotation",
      "_id": "31c75c75-35ac-4790-8976-e302a07c9bb3",
      "valueRange": {
        "gte": 500,
        "lte": 2500
      },
      "channel": 9,
      "expirationBehavior": "dynamic",
      "defaultValue": 1500
    },
    {
      "description": "head rotate",
      "_id": "80c853c0-a6b2-4325-8b50-3b8c548e6241",
      "valueRange": {
        "gte": 500,
        "lte": 2500
      },
      "channel": 10,
      "expirationBehavior": "dynamic",
      "defaultValue": 1500
    },
    {
      "description": "left shoulder rotate forward/back",
      "_id": "26ae67d5-b2fe-475b-9c1e-66a6d1227f32",
      "valueRange": {
        "gte": 500,
        "lte": 1700
      },
      "channel": 11,
      "expirationBehavior": "dynamic",
      "defaultValue": 1500
    },
    {
      "description": "left shoulder sideways up/down",
      "_id": "4cc162b0-2c7b-4e0a-8d4b-f14f3409379d",
      "valueRange": {
        "gte": 500,
        "lte": 1700
      },
      "channel": 12,
      "expirationBehavior": "dynamic",
      "defaultValue": 1500
    },
    {
      "description": "left wrist rotation",
      "_id": "06ad41f2-4ddc-4b36-96b1-d0268ff1a625",
      "valueRange": {
        "gte": 500,
        "lte": 2500
      },
      "channel": 13,
      "expirationBehavior": "dynamic",
      "defaultValue": 1500
    },
    {
      "description": "left hand open/close",
      "_id": "6d59eeda-1e80-4b3d-a98c-6e6610d23613",
      "valueRange": {
        "gte": 500,
        "lte": 2500
      },
      "channel": 14,
      "expirationBehavior": "dynamic",
      "defaultValue": 1500
    },
    {
      "description": "left wrist up/down",
      "_id": "d67a0343-e109-4639-a113-7251dbc60bf0",
      "valueRange": {
        "gte": 500,
        "lte": 2500
      },
      "channel": 15,
      "expirationBehavior": "dynamic",
      "defaultValue": 1500
    }
  ]
};

app.controller('demo', function($scope, $http, $log, $timeout) {
  $scope.sessionReady = false;
  $scope.reportMessages = [];
  $scope.controls = [];

  $scope.init = function demoInit() {
    // Set up session
    $http.post('/session', {}).then(function(data, status, headers) {
      $log.log(data);
      $scope.sessionId = data.data.sessionId;
      $scope.sessionToken = data.data.sessionToken;

      let messageBody = {
        sessionId: $scope.sessionId,
        sessionToken: $scope.sessionToken,
        robotId: robot.RobotId
      };
      $log.log(messageBody);
      socket.emit('establish', messageBody);
      socket.on('establish', res => {
        if (res.acknowledged == 'true') {
          $log.log(res);
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

  $scope.sampleControls = function sampleControls() {

  };

  $scope.createControls = function createControls(manifest) {
    $scope.controls = manifest.actuators.map(actuator => {
      let floor, ceil;
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
        control.options.onStart = function() {
        };
        control.options.onEnd = function() {
          control.value = actuator.defaultValue;
        };
      }
      return control;
    });
  };
  $scope.slider = {
    value: 5,
    options: {
      floor: -10,
      ceil: 10,
      showSelectionBarFromValue: 0
    }
  };


  $scope.init();


  $scope.createControls(manifest);
  $log.info($scope.controls);
  $scope.$broadcast('rzSliderForceRender');
});
