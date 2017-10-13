var app = angular.module("chatApp",
    ['ui.router',
    'ngResource',
    'ngMessages',
    'chatApp.signin',
    'chatApp.signup',
    'chatApp.confirm',
    'chatApp.chat',
    'chatApp.chatPanel',
    'chatApp.talkersPanel',
    'chatApp.chatMessages']
);

app.config(function($stateProvider, $urlRouterProvider) {
    //AWSCognito.config.region = AWS_REGION;
    /*
    var poolData = {
        UserPoolId: USER_POOL_ID,
        ClientId: CLIENT_ID
    };
    */
    //userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    AWSCognito.config.region = AWS_REGION;
    

    $stateProvider
    .state('signin', {
        url: '/signin',
        views: {
            '' : {
                templateUrl: 'modules/signin/signin.html',
                controller: 'SigninCtrl'
            }
        }
    })

    .state('signup', {
        url: '/signup',
        views: {
            '' : {
                templateUrl: 'modules/signup/signup.html',
                controller: 'SignupCtrl'
            }
        }
    })

    .state('confirm', {
        url: '/confirm',
        views: {
            '' : {
                templateUrl: 'modules/confirm/confirm.html',
                controller: 'ConfirmCtrl'
            }
        }
    })

    .state('chat', {
        url: '/chat',
        views: {
            '' : {
                templateUrl: 'modules/chat/chat.html',
                controller: 'ChatCtrl'
            },
            'chatPanel@chat' : {
                templateUrl: 'modules/chat/chatPanel.html',
                controller: 'chatPanelCtrl'
            },
            'talkersPanel@chat' : {
                templateUrl: 'modules/chat/talkersPanel.html',
                controller: 'talkersPanelCtrl'
            },
            'chatMessages@chat' : {
                templateUrl: 'modules/chat/chatMessages.html',
                controller: 'chatMessageCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/signin');

});

var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};

app.directive("compareTo", compareTo);
