# Lab 2: Integration of Typing Indicator

In this lab you will create a typing indicator functionality in your chat application that allows survivors to view who in the chat room is currently typing. 

## Architecture Overview

![Overview of Typing Indicator Architecture](/Images/TypingIndicatorOverview.png)

To configure this functionality, you will modify your API to integrate with backend Lambda functions that are responsible for querying and returning the users currently typing in the system, as well as updating metadata in the "talkers" DynamoDB table that contains details about which survivors are typing at which times. The survivor chat app continuously polls this API endpoint with GET requests to determine who is typing. As survivors are typing, POST requests are made to this same endpoint to update the talkers DynamoDB table.

The typing indicator shows up in the web chat client in a section below the chat message panel. The UI and backend Lambda functions have already been implemented, and this lab focuses on how to configure your new integration in API Gateway.

The application uses [CORS](http://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html). This lab will both wire up the backend Lambda function as well as perform the necessary steps to enable CORS.

In this lab you will perform the following steps - 

1. Modify the /talkers resources to integrate with backend Lambda functions instead of existing MOCK endpoints.

2. Learn how to enable CORS on API Gateway methods.

## Lab Instructions

> Note: Before starting this lab, please make sure you have already [launched the CloudFormation template](../README.md##Get-Started) and the status of the stack is CREATE_COMPLETE.

### 1. Change Mock Integration to Lambda Integration

You will configure your API to use Lambda functions as the backend integration instead of MOCK Integrations that were deployed for you when you created the workshop.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. Navigate to the API Gateway service. You can search for it on the main console homepage or type in the service name to quickly access the service (as shown below)

![API Gateway in Management Console](/Images/Typing-Step1.png)

2. On the APIs listing screen in API Gateway, click into your Zombie chat API. It should be prefixed with the name of your CloudFormation stack that launched it. This should be "ZombieAPI-[YOUR_STACK_NAME]". Select that API.

3. Click the **GET** method of your **/zombie/talkers** resource. You can do this by clicking the "GET" method under the /zombie/talkers resource. The GET method is highlighted in blue in the image below. Click there.
![GET Method](/Images/Typing-Step3.png)

*This GET HTTP method is used by the survivor chat app to perform continuous queries on the DynamoDB talkers table to determine which users are typing.*

4. Click the **Integration Request** box to modify the backend  Integration Request.

5. On the **Integration Request** screen, change the integration to **Lambda Function** by selecting the radio button option.

> Note: Currently, this API method is configured to use a "MOCK" integration. MOCK integrations are dummy backends that are useful when you are testing and don't yet have the backend built out but need the API to return sample dummy data. You will remove the MOCK integration and configure this GET method to connect to a Lambda function that queries DynamoDB.

6. For the **Lambda Region** field, select the region in which you launched the CloudFormation stack. 

> Note: Select the region code that corresponds with the yellow CloudFormation button you clicked to launch the CloudFormation template. You can also look in the upper right corner of the AWS Management Console to see which region you are in. For example if you launched your stack in Virginia (us-east-1), then you will select us-east-1 as your Lambda Region.

> Note: When you launched the CloudFormation template, the launch also created several Lambda functions for you locally in the region where you launched your CFN stack - this includes functions for retrieving data from and putting data into a DynamoDB "Talkers" table with details about which survivors are currently typing in the chat room.

7. For the Lambda Function field, begin typing "gettalkers" in the text box. In the auto-fill dropdown, select the function that contains "GetTalkersFromDynamoDB" in the name. It should look something like this.... **[CloudformationTemplateName]-[XXXXXXX]-GetTalkersFromDynamoDB-[Your Region]**.

> Note: This Lambda function is written in NodeJs. It performs GetItem DynamoDB requests on a Table called Talkers. This talkers table contains records that are continuously updated whenever users type in the chat room. By hooking up this Lambda function to your GET method, it will get invoked by API Gateway when the chat app polls the API with GET requests.

8. Select the blue **Save** button and click **OK** if a pop up asks you to confirm that you want to switch to Lambda integration. Then grant access for API Gateway to invoke the Lambda function by clicking "OK" again. This 2nd popup asks you to confirm that you want to allow API Gateway to be able to invoke your Lambda function.

9. Click the **Method Execution** back button in the upper left corner to return to the method execution overview page. You'll now configure API Gateway with the HTTP response types you want your API to expose. For simplicity we will only configure 200 reponses. Click the **Method Response** section of the Method Execution Flow.

10. Verify that a "200" Response Code exists for the Method Response. If not, add a 200 HTTP Status response. Click **Add Response**, type "200" in the status code text box and then click the little checkmark to save the method response, as shown below.

![Method Response](/Images/Typing-Step10.png)

* You've configured the GET method of the /zombie/talkers resource to allow responses with HTTP status of 200. We could add more response types but we'll skip that for simplicity in this workshop.

11. Go to the /zombie/talkers POST method by clicking the "POST" option in the resource tree on the left navigation pane.
![POST Method](/Images/Typing-Step11.png)

12. We're now going to configure to the /zombie/talkers resource to properly integrate with AWS Lambda on POST requests.

**Perform Steps 4-10 again** just as you did for the GET method. However, this time when you are selecting the Lambda Function for the Integration Request, you'll type **writetalkers** in the auto-fill and select the function that looks something like this... **[CloudformationTemplateName]-[XXXXXXX]-WriteTalkersToDynamoDB-[Your Region]**. This way on POST requests, API Gateway will invoke your **writetalkers** Lambda function. Don't forget to return to the Method Response section for this POST method and add a "200" HTTP response status as you did for the GET method earlier, if it doesn't exist already.

* In the above steps you are configuring the POST method that is used by the chat app to insert data into DynamoDB Talkers table with details about which users are typing. You're performing the same exact method configuration for the POST method as you did for your GET method. However, since this POST method is used for sending data to the database, it triggers a different backend Lambda function. This function writes data to DynamoDB while the "GetTalkersToDynamoDB" function was used to retrieve data from DynamoDB. In practice, these two functionalities could be written into a single shared backend Lambda function.

13. Navigate to the /zombie/talkers OPTIONS method.

14. Select the Method Response.

15. If it does not exist, add a 200 method response. Click "Add Response", type "200" in the status code text box and then click the little checkmark to save the method response.

16. Go back to the OPTIONS method flow and select the Integration Response. (To go back, there should be a blue hyperlink titled "Method Execution" which will bring you back to the method execution overview screen).

17.  Add a new Integration response with a method response status of 200. Click the "Method response status" dropdown and select "200". Leave the "Content Handling" option set to **Passthrough**. When done, click the blue **Save** button.

* In this section you configured the OPTIONS method simply to respond with HTTP 200 status code. The OPTIONS method type is simply used so that clients can retrieve details about the API resources that are available as well as the methods associated with them.

18. Select the /zombie/talkers resource on the left navigation tree.
![talker resource](/Images/Typing-Step19.png)

19. Click the "Actions" box and select "Enable CORS" in the dropdown.

20. Select Enable and Yes to replace the existing values. You should see all green checkmarks for the CORS options that were enabled, as shown below.
![talker resource](/Images/Typing-Step21.png)

> Note: If you don't see all green checkmarks, this is probably because you forgot to add the HTTP Status 200 code for the Method Response Section. Go back to the method overview section for your POST, GET, and OPTIONS method and make sure that it shows "HTTP Status: 200" in the Method Response box.

21. Click the "Actions" box and select Deploy API  
![talker resource](/Images/Typing-Step22.png)

* In this workshop we deploy the API to a stage called "ZombieWorkshopStage". In your real world scenario, you'll likely create different stages of the API to reflect different versions that you'd like to maintain such as dev, staging, prod or others.

</p></details>

## Completion

Head back to the survivor chat app and **Refresh the page** type messages. POST requests are being made to the Talkers API resource which is updating a DynamoDB table continuously with timestamps along with who is typing. Simultaneously, the application is performing a continuous polling (GET Requests) against /zombie/talkers to show which survivors are typing. This displays

![talker resource](/Images/Typing-Done.png)

In this lab you successfully configured your API to support typing indicators in the web client!

