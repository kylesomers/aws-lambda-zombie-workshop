angular.module('chatApp.signin', ['chatApp.utils'])
.controller('SigninCtrl', function($scope, $state, $localstorage) {

    $scope.errormessage = "";

    $scope.user = {
        email: "",
        password: ""
    };

    $scope.signin = function(isValid) {
        //console.log($scope.user);
        if (isValid) {

            var authenticationData = {
                Username : $scope.user.email,
                Password : $scope.user.password,
            };
            var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
            var poolData = {
                UserPoolId : USER_POOL_ID,
                ClientId : CLIENT_ID
            };
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
            var userData = {
                Username : $scope.user.email,
                Pool : userPool
            };
            var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
            try {
                cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: function (result) {
                        console.log('JWT token: ' + result);
                        console.log('Cognito User ' + cognitoUser);
                        $state.go('chat', { }); // if all went well then log them in.
                
                    },
                    onFailure: function(err) {
                        console.log(err);
                        $scope.errormessage = "Unable to sign in user. Please check your username and password.";
                        $scope.$apply();
                    }
                });
                
            } catch(e) {
                console.log(e);
            }
        } else {
            $scope.errormessage = "There are still invalid fields.";
            console.log("There are still invalid fields");
        }
    };

});
