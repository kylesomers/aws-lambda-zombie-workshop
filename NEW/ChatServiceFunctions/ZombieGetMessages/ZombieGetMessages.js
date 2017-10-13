console.log('Loading function');
var aws = require('aws-sdk');
var docClient = new aws.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
    console.log("request: " + JSON.stringify(event));
    var table = process.env.MessagesTable;
    var params = {
        TableName: table,
        KeyConditionExpression: 'channel = :channel',
        ExpressionAttributeValues: { ':channel': 'default' },
        Limit: 20,
        ScanIndexForward: false
    };
    console.log("Querying DynamoDB");
    var response;
    docClient.query(params, function(err, data) {
        if (err) {
            console.log('Error: ' + JSON.stringify(err));
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
            var messages = {
                "messages": data.Items.reverse() //flipping order of results so most recent is on the bottom ordered by timestamp
            },
            response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json'
                },
                body: (JSON.stringify(messages))
            };
            
            callback(null, response)
        }
    });
}