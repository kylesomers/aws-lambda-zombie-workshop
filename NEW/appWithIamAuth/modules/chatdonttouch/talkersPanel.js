angular.module('chatApp.talkersPanel', [])
.controller('talkersPanelCtrl', function($scope, $rootScope, $http, $timeout) {

    $rootScope.$on("chatting", function() {
        var poll = function() {
            $timeout(function() {
                if($rootScope.chatting) {
                    console.log('Retrieving Talkers from Server'); 
                    var body = '';
                    var req = {
                        method: 'GET',
                        url: MESSAGES_ENDPOINT + '/talkers',
                        headers: {
                            Authorization: $rootScope.chatuser.jwt,
                            "Content-Type": "application/json"
                        }
                    }
                    $http(req).then(function successCallback(response) {
                        if($rootScope.chatting) {
                            console.log('talkers are: ' + response.data.Talkers);
                            $scope.talkers = response.data.Talkers;
                            
                        } else {
                            $scope.talkers = null;
                        }
                        
                    }, function errorCallback(response) {
                            console.error('There was an error: ', response);
                        // or server returns response with an error status.
                    });
                    poll();
                }
            }, 1000);
        };
        poll();
    });
    $rootScope.$on("not chatting", function() {
        //clear our model, which will clear out the messages from the panel
     	$scope.talkers = null;
    });

});
