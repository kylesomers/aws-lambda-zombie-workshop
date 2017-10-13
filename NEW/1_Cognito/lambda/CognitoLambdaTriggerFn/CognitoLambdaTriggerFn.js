"use strict";
console.log('Loading function');
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback){
    console.log(event);
    // set the appropriate region for AWS api calls    
    var table = process.env.UsersTable
    console.log('Table is: ' + table);
    var params = {};
    var triggerSource = event.triggerSource; console.log('triggerSource: ' + triggerSource);
    var userName = event.userName; console.log('username: ' + userName);
    
    if (triggerSource === "PostConfirmation_ConfirmSignUp"){
        return handleConfirmSignUp(table, event, callback);
    } else if (triggerSource === "PreAuthentication_Authentication") {
        return handlePreAuthentication(table, event, callback);
    } else {
        return callback("Invalid trigger source.", null);
    }
}

function handleConfirmSignUp(table, event, callback){
    var params = {
        TableName: table,
        Item: {
            userid: event.userName,
            phone: event.request.userAttributes['phone_number']
        }
    };
    
    docClient.put(params, function(err, data) {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        console.log('Success: PostConfirmation_ConfirmSignUp');
        callback(null, event);
    });
    
}

function handlePreAuthentication(table, event, callback) {
    var params = {
        TableName: table,
        Key: {
            userid: event.userName
        },
        UpdateExpression: 'set camp = :c, slackuser = :s, confirmed = :v, slackteamdomain = :t',
        ExpressionAttributeValues: {
            ':c' : event.request.userAttributes['custom:camp'],
            ':s' : event.request.userAttributes['custom:slackuser'] ? event.request.userAttributes['custom:slackuser'] : "null",
            ':t' : event.request.userAttributes['custom:slackteamdomain'],
            ':v' : event.request.userAttributes['email_verified']
        },
        ReturnValues:"UPDATED_NEW"
    };
    console.log('event: ' + JSON.stringify(event));
    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            return callback(err, null);
        } else {
            console.log('Success: PreAuthentication_Authentication');
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            return callback(null, event);
        }
    });
}



