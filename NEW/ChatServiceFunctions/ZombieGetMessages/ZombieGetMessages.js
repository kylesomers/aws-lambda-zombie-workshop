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
        ScanIndexForward:false
    }
    console.log("Querying DynamoDB");
    docClient.query(params, function(err, data) {
        if (err) {
            callback(err)
        } else {
            callback(null, data)
        }
    });
}