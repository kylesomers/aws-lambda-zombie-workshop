console.log('Loading function');

var AWS = require('aws-sdk');

var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context) {
  console.log('Received event:', JSON.stringify(event, null, 2));

  if (event.name == null) {
    context.fail(new Error('name cannot be null: ' + JSON.stringify(event, null, 2)));
  }

  var params = {
    TableName: 'zombiestack-talkers',
    Item: {
      channel: 'default',
      talktime: Date.now(),
      name: event.name
    }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      console.log('DDB Err:' + err);
      context.fail(new Error('DynamoDB Error: ' + err));
    } else {
      console.log(data);
      context.done(null, {Status: 'Success'});
    }

  });

};
