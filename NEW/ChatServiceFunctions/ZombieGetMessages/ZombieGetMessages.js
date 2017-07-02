console.log('Loading function');
var aws = require('aws-sdk');
var docClient = new aws.DynamoDB.DocumentClient();
var table = process.env.MessagesTable

exports.handler = function(event, context, callback) {
    console.log("request: " + JSON.stringify(event));
    var params = {
        TableName: table,
        KeyConditionExpression: 'channel = :channel',
        ExpressionAttributeValues: { ':channel': 'default' },
        Limit: 20,
        ScanIndexForward: false
    };
    console.log("Querying DynamoDB");
    docClient.query(params, function(err, data) {
        if (err) {
            callback(err);
        } else {
            console.log(JSON.stringify(data));
            var messages = data.Items.reverse(); //flipping order of results so most recent is on the bottom ordered by timestamp
            var responseBody = {
                statusCode: 200,
                body: messages, 
                headers: {
                    'Access-Control-Allow-Origin' : '*' // Required for CORS support to work
                },
            };
            callback(null, responseBody)
        }
    });
}