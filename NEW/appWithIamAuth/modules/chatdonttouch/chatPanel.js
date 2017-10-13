
angular.module('chatApp.chatPanel', ['chatApp.chatMessages'])
.controller('chatPanelCtrl', function($scope, $rootScope, $http, $timeout) {

    $rootScope.$on("chatting", function() {

        var poll = function()
        {
            $timeout(function() {
                if($rootScope.chatting) {
                    console.log('Retrieving Messages from Server');

                    var req = {
                        method: 'GET',
                        url: MESSAGES_ENDPOINT + '/messages',
                        headers: {
                            Authorization: $rootScope.chatuser.jwt,
                            'Content-Type': 'application/json'
                        },
                    }

                    $http(req).then(function successCallback(response) {
                        if($rootScope.chatting) {
                            console.log('response is: ' + JSON.stringify(response));
                            $scope.messages = response.data.messages;
                        } else {
                            $scope.messages = null;
                        }
                        
                    }, function errorCallback(response) {
                            console.error('There was an error: ', JSON.stringify(response));
                        // or server returns response with an error status.
                    });

                    poll();
                }
            }, 2000);
        };
        poll();
    });

    $rootScope.$on("not chatting", function() {
        //clear our model, which will clear out the messages from the panel
        $scope.messages = null;
    });

});