var AWS = require('aws-sdk');
var path = require('path');

var creds = new AWS.EnvironmentCredentials('AWS');

exports.handler = function(event, context, callback) {
    console.log('event: ' + JSON.stringify(event));
    var proxy = {
        endpoint: 'https://' + event.requestContext.apiId + '.execute-api.' + process.env.region + '.amazonaws.com',
        resource: '/' + event.requestContext.stage + '/' + process.env.resource,
        region: process.env.region
    };
    console.log('proxy: ' + JSON.stringify(proxy));
    proxyMessage(proxy, context);
}

function proxyMessage(proxy, context) {
    console.log('received proxy: ' + JSON.stringify(proxy));
    var awsEndpoint = new AWS.Endpoint(proxy.endpoint);
    var req = new AWS.HttpRequest(awsEndpoint);

    req.method = 'GET';
    req.path = proxy.resource;
    req.port = '443';
    req.region = proxy.region;
    req.headers['presigned-expires'] = false;
    req.headers['Host'] = awsEndpoint.host;
    //req.body = {};
    
    console.log('req: ' + JSON.stringify(req));
    var signer = new AWS.Signers.V4(req,'execute-api');  // es: service code
    signer.addAuthorization(creds, new Date());

    var send = new AWS.NodeHttpClient();
    var bodyChunks = [];
    send.handleRequest(req, null, function(httpResp) {
        var respBody = '';
        httpResp.on('data', function (chunk) {
            respBody += chunk;
            bodyChunks.push(chunk);
        });
        httpResp.on('end', function () {
            var body = Buffer.concat(bodyChunks);
            var responseCode = httpResp.statusCode; console.log('responseCode: ' + responseCode);
            console.log('BODY: ' + body);
            var response = {
                statusCode: httpResp.statusCode,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json'
                },
                body: body.toString()
            };
            console.log('Message sent. Response: ' + JSON.stringify(response));
            context.succeed(response);
        });
    }, function(err) {
        console.log('Error: ' + err);
        context.fail('Lambda failed with error ' + err);
    });
}