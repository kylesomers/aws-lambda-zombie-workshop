console.log('Loading function');

var AWS = require('aws-sdk');

var docClient = new AWS.DynamoDB.DocumentClient();
var table = process.env.TalkersTable;
exports.handler = function(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));

  var params = {
    TableName: table,
    KeyConditionExpression: 'channel = :hkey and talktime > :rkey',
    ExpressionAttributeValues: {
      ':hkey': 'default',
      ':rkey': (Date.now() - 2000)
    },
    ConsistentRead: true
  };

  docClient.query(params, function(err, data) {
    if (err) {
      console.log('DDB Err:' + err);
      context.fail(new Error('DynamoDB Error: ' + err));
    } else {
      console.log((Date.now() - 2000));
      console.log(data);
      Talkers = [];
      Pushed = {};
      data.Items.forEach(function(talker, index, array) {
        if (Pushed.hasOwnProperty(talker.name) == false) {
          Talkers.push(talker.name);
          Pushed[talker.name] = true;
        }

      });
      context.done(null, {
        Talkers: Talkers
      });
    }

  });
};
