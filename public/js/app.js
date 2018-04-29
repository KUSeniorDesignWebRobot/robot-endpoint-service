'use strict';

var app = angular.module('myApp', []);
var socket = io('http://localhost:3000');

app.controller('demo', function ($scope, $http, $log) {
  $scope.sessionReady = false;
  $scope.reportMessages = [];
  $scope.controls = [];

  $scope.init = function demoInit() {
    // Set up session
    $http.post('/session/demo', {}).then(function (data, status, headers) {
      $log.log(data);
      $log.info(data);
      $scope.sessionId = data['data']['sessionId'];
      $scope.sessionToken = data['data']['sessionToken'];

      var messageBody = { sessionId: $scope.sessionId, sessionToken: $scope.sessionToken };
      $log.log(messageBody);
      socket.emit('establish', messageBody);
      socket.on('establish', function (res) {
        if (res['acknowledged'] == 'true') {
          $log.log(res);
          socket.on('reportMessage', $scope.onReportMessage);
          socket.on('close', $scope.onClose);
          $scope.sessionReady = true;
          $scope.$apply();
          $scope.ready();
        } else {
          $log.warn('Session request rejected');
        }
      });
    });
  };

  $scope.ready = function ready() {};

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

  $scope.init();
});