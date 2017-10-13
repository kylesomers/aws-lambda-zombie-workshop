console.log('Loading function');
var aws = require('aws-sdk');
var docClient = new aws.DynamoDB.DocumentClient();


exports.handler = function(event, context, callback) {
    console.log("request: " + JSON.stringify(event));
    var table = process.env.TalkersTable;
    var params = {
        TableName: table,
        KeyConditionExpression: 'channel = :channel',
        ExpressionAttributeValues: { ':channel': 'default' },
        Limit: 20,
        ScanIndexForward: true //we want to sort the results ascending from oldest to newest so recent messages appear at the bottom!
    }
    console.log("Querying DynamoDB");
    docClient.query(params, function(err, data) {
        if (err) {
            callback(err)
        } else {
            console.log(JSON.stringify(data));
            var responseBody = {
                statusCode: 200,
                body: data.Items,
                headers: {
                    'Access-Control-Allow-Origin' : '*' // Required for CORS support to work
                },
            };
            callback(null, responseBody)
        }
    });
}