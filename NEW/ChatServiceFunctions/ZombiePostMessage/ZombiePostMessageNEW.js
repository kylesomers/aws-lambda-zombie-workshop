'use strict';
console.log('Loading hello world function');

var aws = require('aws-sdk');
var docClient = new aws.DynamoDB.DocumentClient();
var querystring = require('querystring');
var table = process.env.MessagesTable

exports.handler = function(event, context, callback) {
    var responseCode = 200;
    console.log("request: " + JSON.stringify(event));
    var body = JSON.parse(event.body); // body from API request
    
    if(body.message === null) {
        return context.fail("Message cannot be null");
    } 
    
    if (body.channel === null) {
        body.channel = 'default'
    }
    
    var params = {
        TableName: table,
        Item: {
            channel: body.channel,
            message: body.message,
            timestamp: new Date().getTime(),
            name: body.name,
            email: body.email
        }
    };
    
    console.log('item is: ' + JSON.stringify(params.Item));
    
    docClient.put(params, function(err, data) {
        if (err) {
            callback(err)
        } else {
            callback(null, responseBody)
        }
    });
    
    var responseBody = {
        statusCode: 200,
        body: JSON.stringify(body),
        headers: {
            'Access-Control-Allow-Origin' : '*' // Required for CORS support to work
        },
    };
};

