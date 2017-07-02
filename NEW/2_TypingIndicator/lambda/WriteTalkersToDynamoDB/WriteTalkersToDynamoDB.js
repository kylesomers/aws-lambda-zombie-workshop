console.log('Loading function');

var AWS = require('aws-sdk');

var docClient = new AWS.DynamoDB.DocumentClient();
var table = process.env.TalkersTable;
exports.handler = function(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));

  if (event.name === null) {
    callback(new Error('name cannot be null: ' + JSON.stringify(event, null, 2)));
  }

  var params = {
    TableName: table,
    Item: {
      channel: 'default',
      talktime: Date.now(),
      name: event.name
    }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      console.log('DDB Err:' + err);
      callback(new Error('DynamoDB Error: ' + err));
    } else {
      console.log(data);
      callback(null, data);
    }

  });

};
