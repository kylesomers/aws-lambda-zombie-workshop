angular.module('chatApp.signup', ['chatApp.utils'])
.controller('SignupCtrl', function($scope, $state) {

    $scope.errormessage = "";

    $scope.user = {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        camp: "",
        slackuser: "",
        slackteamdomain: ""
    };

    $scope.register = function(isValid) {
        console.log($scope.user);
        if (isValid) {
            console.log("Submitted " + $scope.user.name);

            var poolData = {
                UserPoolId : USER_POOL_ID,
                ClientId : CLIENT_ID
            };

            var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
            if (typeof AWSCognito !== 'undefined') {
                AWSCognito.config.region = AWS_REGION;
            }
            console.log('AWS Region is set as ' + AWSCognito.config.region);
            var attributeList = [];

            var dataEmail = {
                Name : 'email',
                Value : $scope.user.email
            };
            var dataPhoneNumber = {
                Name : 'phone_number',
                Value : '+1' + $scope.user.phone
            };
            var dataName = {
                Name : 'name',
                Value : $scope.user.name
            };

            var dataCamp = {
                Name : 'custom:camp',
                Value : $scope.user.camp ? $scope.user.camp : "null"
            };

            var dataSlackuser = {
                Name : 'custom:slackuser',
                Value : $scope.user.slackuser ? $scope.user.slackuser : "null"
            };

            var dataSlackteamdomain = {
                Name : 'custom:slackteamdomain',
                Value : $scope.user.slackteamdomain ? $scope.user.slackteamdomain : "null"
            };

            var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
            var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);
            var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);
            var attributeCamp = new AmazonCognitoIdentity.CognitoUserAttribute(dataCamp);
            var attributeSlackuser = new AmazonCognitoIdentity.CognitoUserAttribute(dataSlackuser);
            var attributeSlackteamdomain = new AmazonCognitoIdentity.CognitoUserAttribute(dataSlackteamdomain);

            attributeList.push(attributeEmail);
            attributeList.push(attributePhoneNumber);
            attributeList.push(attributeName);
            attributeList.push(attributeCamp);
            attributeList.push(attributeSlackuser);
            attributeList.push(attributeSlackteamdomain);

            userPool.signUp($scope.user.email, $scope.user.password, attributeList, null, function(err, result){
                if (err) {
                    console.log(err);
                    $scope.errormessage = "An unexpected error has occurred. Please try again. Error: " + err;
                    $scope.$apply();
                    return;
                    
                } else {
                    cognitoUser = result.user;
                    console.log('user name is ' + cognitoUser.getUsername());
                    $state.go('confirm', { });
                }
            });

        } else {
            $scope.errormessage = "There are still invalid fields.";
            console.log("There are still invalid fields");
        }
    };

});
