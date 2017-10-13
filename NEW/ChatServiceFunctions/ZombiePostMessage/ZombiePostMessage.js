'use strict';
console.log('Loading function');
var aws = require('aws-sdk');
var docClient = new aws.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
    var table = process.env.MessagesTable
    console.log("request: " + JSON.stringify(event));

    var body = JSON.parse(event.body);

    var params = {
        TableName: table,
        Item: {
            channel: body.channel,
            message: body.message,
            timestamp: body.timestamp,
            name: body.name,
            email: body.email
        }
    };
    
    console.log('item is: ' + JSON.stringify(params.Item));
    var response;
    docClient.put(params, function(err, data) {
        if (err) {
            response = {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(err)
            };
            callback(err);

        } else {
            console.log('success: ' + JSON.stringify(data));
            
            response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json'
                },
                body: 'success'
            };
            
            callback(null, response)
        }
    });
};