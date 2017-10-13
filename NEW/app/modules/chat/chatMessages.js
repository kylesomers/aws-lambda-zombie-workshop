angular.module('chatApp.chatMessages', [])
.controller('chatMessageCtrl', function($scope, $rootScope, $http) {

    $scope.chatPlaceholder = "Save your brains, start chatting!";
    $scope.chatMessage = null;

    $rootScope.$on("chatting", function() {
        $scope.chatPlaceholder = "Enter a message and save humanity";
    });
    $rootScope.$on("not chatting", function() {
        $scope.chatMessage = null;
        $scope.chatPlaceholder = "Save your brains, start chatting!";
    });

    $scope.lastTalking = new Date;
    $scope.chatMessageKeyPressed = function(keyEvent) {
    
        if (keyEvent.which === 13) {
            $scope.posting = true;

            var body = {
                channel: 'default',
                name: $rootScope.chatuser.name,
                email: $rootScope.chatuser.email,
                message: $scope.chatMessage,
                timestamp: Date.now()
            };
            
            var req = {
                method: 'POST',
                url: MESSAGES_ENDPOINT + '/integrations/web/messages',
                headers: {
                    Authorization: $rootScope.chatuser.jwt
                },
                data: body
            }

            console.log('Sending message: ' + JSON.stringify(req))

            $http(req)
            .then(function (response) {
                //handle success
                console.log('Message sent.');
                console.log ('user email is ' + $rootScope.chatuser.email);
                $scope.chatMessage = null;
                $scope.posting = false;
                $scope.chatPlaceholder = "Enter a message and save humanity";
                  
            }, function (response) {
                    //handle error
                    console.error('There was an error sending message: ', JSON.stringify(response));
                    window.alert('There was an error sending the message. Try again or check the console logs to see full error');
                    $scope.chatMessage = null;
                    $scope.posting = false;
                    $scope.chatPlaceholder = "Enter a message and save humanity";
                // or server returns response with an error status.
            });

        } else {
            var diff = Date.now() - $scope.lastTalking;

            // send talking update at max every .5 seconds
            if (diff < 500) {
                return;
            }

            var talkersBody = {
                channel: 'default',
                name: $rootScope.chatuser.name
            };

            var req = {
                method: 'POST',
                url: MESSAGES_ENDPOINT + '/talkers',
                headers: {
                    Authorization: $rootScope.chatuser.jwt,
                    "Content-Type": "application/json"
                },
                data: talkersBody
            }

            $http(req).then(function successCallback(response) {
                console.log('Posting to talkers.');
                $scope.lastTalking = new Date;
                  
            }, function errorCallback(response) {
                    console.error('There was an error sending typing indicator status: ', response);
                // or server returns response with an error status.
            });
        }
    };

});