var AWS = require('aws-sdk');

exports.handler = function(event, context, callback) {
  console.log('REQUEST RECEIVED:\n', JSON.stringify(event));
  var responseData = {};
  var responseStatus = "FAILED";  // Start out with response of FAILED until we confirm SUCCESS explicitly.

  var bucket = event.ResourceProperties.bucket; // the bucket created for the app by CloudFormation
  var constantsFileKey = event.ResourceProperties.constantsFile;
  var region = event.ResourceProperties.region; // the region where Cognito exists. Cognito not in all regions so this is passed in from CFN.
  var api = event.ResourceProperties.api;
  var s3 = new AWS.S3();
  var clientId = 'INSERT_CLIENT_ID_HERE';
  var userPoolId = 'INSERT_USER_POOL_ID_HERE';

  // If DELETE request type is sent, return success to cloudformation. User will manually tear down Cognito resources
  if (event.RequestType == "Delete") {
    responseStatus = "SUCCESS";
    console.log('responseStatus is: ' + responseStatus + ' and event is: ' + event + ' and context is: ' + context);
    sendResponse(event, context, responseStatus, responseData, callback);
  }

  // if request type is CREATE or UPDATE, create the resources
  else {

    var params = {
      Bucket: bucket,
      Key: constantsFileKey,
      Body: 'var MESSAGES_ENDPOINT = "' + api + '";\nvar AWS_REGION = "' + region + '";\nvar USER_POOL_ID = "' + userPoolId + '";\nvar CLIENT_ID = "' + clientId + '";'
    };
      
    s3.upload(params, function(err, data) {
      if (err) {
        console.log('Unable to put constants file into S3 bucket.');
        console.log('Error: ' + err);
        responseStatus = "FAILED";
        console.log('responseStatus is: ' + responseStatus + ' and event is: ' + event + ' and context is: ' + context);
        sendResponse(event, context, responseStatus, responseData, callback);
      } 
      
      else {
        console.log('Uploaded constants.js file to S3 bucket.');
        console.log('Constants file contents: ' + data.Body);
        console.log('Done processing');
        responseStatus = "SUCCESS";
        console.log('responseStatus is: ' + responseStatus + ' and event is: ' + event + ' and context is: ' + context);
        sendResponse(event, context, responseStatus, responseData, callback);
      }

    });
  } // End CREATE/UPDATE section

}

function sendResponse(event, context, responseStatus, responseData, callback) {

  var responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: 'See the details in CloudWatch Log Stream: ' + context.logStreamName,
      PhysicalResourceId: context.logStreamName,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Data: responseData
  });

  console.log('RESPONSE BODY:\n', responseBody);

  var https = require('https');
  var url = require('url');

  var parsedUrl = url.parse(event.ResponseURL);
  var options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: 'PUT',
      headers: {
        "content-type": "",
        "content-length": responseBody.length
      }
  };

  console.log('SENDING RESPONSE...\n');

  var request = https.request(options, function(response) {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
      callback(null);
  });

  request.on('error', function(error) {
    console.log('sendResponse Error:' + error);
    callback(null);
  });

  request.write(responseBody);
  request.end();
}
