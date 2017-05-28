# Lab 1: Authentication with Cognito User Pools

In this lab, you will integrate user authentication and API authorization into your serverless survivor chat application with [Amazon Cognito](https://aws.amazon.com/cognito/). 

## Architecture Overview

The Zombie survivor chat requires a survivor to sign up for a user account in order to communicate with other survivors. Once a survivor signs up for an account, they will be able to authenticate into the communications system in order to chat with other apocalypse survivors. [Amazon Cognito](https://aws.amazon.com/cognito/) provides the ability to create user directories for this purpose with [Cognito User Pools](http://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html). You will now setup the Cognito User Pool as a user directory for your survivors. 

Once a survivor has successfully logged into the communications system, their session will include temporary credentials from Cognito User Pools in the form of a JSON Web Tokens (JWT) that will be used by the application when making authenticated requests to the REST API.

  ![Authentication with Cognito User Pools](images/CognitoArchitectureOverview.png)

## Lab Instructions

> Note: Before starting this lab, please make sure you have already [launched the CloudFormation template](../README.md##Get-Started) and the status of the stack is CREATE_COMPLETE.

### 1. Create the Cognito User Pool

You will use the AWS Management Console to create a User Pool for your application.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console, in the AWS Services search bar, type `cognito` and then select **Cognito** from the drop down.

2. Choose **+Manage your User Pools**

3. In the Cognito User Pools console, select the blue **Create your User Pool** button in the upper right corner. 

4. In the Pool Name text box, name your user pool `YOUR_CLOUDFORMATION_STACK_NAME-userpool`. For example, if you left your CloudFormation stack as the default name of "zombiestack" earlier, then your user pool name would be "zombiestack-userpool". After naming your User Pool, click **Step through Settings** to continue with manual setup.

   ![CognitoUserPool-NameStep](images/CognitoUserPool-NameStep.png)

5. On the attributes page, select the **Required** checkbox for the following attributes: `email, name, phone number`. Make sure that all three are selected before continuing.

  > Cognito User Pools allows you to define attributes that you'd like to associate with users of your application. These represent values that your users will provide when they sign up for your app. They are available to your application as a part of the session data provided to your client apps when users authenticate with Cognito.

6. Click the link **Add custom attribute**. Type a **Name** of `slackuser` exactly as typed here and leave the rest of the fields as is. Then click **Add another attribute** and add another custom attribute named `slackteamdomain`, leaving the rest of the fields as is. Finally, add a 3rd custom attribute by clicking **Add another attribute** and type `camp` as the name, leaving the rest of the fields as is. Click **Next Step**.

  ![CognitoAttributesSelection](images/CognitoAttributesSelection.png)

7. On the next page, leave the Password policy settings as default and click **Next step**.

8. On the verifications page, leave the defaults and click **Next step**.

  > We will not require MFA for this application, or SMS. However, during our application's sign up process, we are requiring verification via email address. This is denoted with the email checkbox selected for "Do you want to require verification of emails or phone numbers?". With this setting, when users sign up for the application, a confirmation code will be sent to their email which they'll be required to input into the application for confirmation before their account creation is completed.

9. On the next page, type `Signal Corps Survivor Confirmation` for the **Email subject**. We won't modify the message body but you could add your own custom message in there. We'll let Cognito send the confirmation code emails from the service email address, but in production you could configure Cognito to send these verifications from an SES verified address along with a custom message. Leave the rest of the default settings and click **Next step**.

10. On the Tags page, leave the defaults and click **Next step**. 

11. Next, on the Devices page, leave the default option of **No** selected and click **Next step**. 

12. On the Apps page, click **Add an app client**. In the **App client name** textbox, type `Zombie Survivor Chat App` and make sure to **deselect** all of the checkboxes. Click **Set attribute read and write permissions** to expand it. 

13. For both the **Readable Attributes** and **Writeable Attributes** settings, verify that **all of the checkboxes are selected**. Then click **Create app client**, and then click **Next step**.

14. On the custom triggers page, you will configure a `Pre authentication` trigger and a `Post confirmation` trigger. In the dropdowns for the **Pre authentication** and **Post confirmation** triggers, select the Lambda function named `YOUR_CLOUDFORMATION_STACK_NAME-CognitoLambdaTrigger-YOUR_REGION`. Click **Next step**.

  ![CognitoUserPoolTriggers](images/CognitoUserPoolTriggers.png)

15. Review the settings for your User Pool and click **Create pool**. If your pool created successfully you should be returned to the Pool Details page and it will display a green box that says **Your user pool was created successfully**.

  ![CognitoUserPoolReviewSettings](images/CognitoUserPoolReviewSettings.png)

16. Open a text editor on your computer and copy your `Pool Id` from the User Pool into the text editor. Then click into the **App clients** tab found on the left side navigation pane of the Cognito console. You should also see an **App client id** displayed in the User Pool details page. Copy the `App client id` into your text editor as well.

You have now created a User Pool for your application users and you should have the `Pool Id` and `App client id` in your text editor. Proceed to the next step of this lab to update your application code to work with this User Pool.

</p></details>

### 2. Update the static website constants.js config file

The zombie chat application uses a [constants.js](../app/assets/js/constants.js) file to bootstrap the application with variables in order to work properly. This file was partially updated by CloudFormation as a part of the deployment process. In this step, you will download that file from your S3 bucket, update the file, and re-upload it to your S3 bucket with the rest of the configuration variables needed to make the application work.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console, in the AWS Services search bar, type `S3` and then select **S3** from the drop down. Navigate to the S3 bucket that was created for you by when you launched the CloudFormation stack. If you don't know the name of your bucket, you can find it in the **Output** tab in the CloudFormation console listed as `Bucket`.

2. Click your bucket and navigate to the **constants.js** file found in the following folder path, `YOUR_BUCKET_NAME/S3/assetsjs/constants.js`. Download the file to your local machine and open it.

3. With the constants.js file open, Set the **USER_POOL_ID** variable to your `Pool Id` from your text editor. Set the **CLIENT_ID** to your `App client id` from your text editor and save the constants.js file.

</p></details>

#### 2a. Clone the GitHub Repository

1.  If you choose, follow the GitHub instructions to clone the repository to a directory on your workstation: [Cloning a Repository](https://help.github.com/articles/cloning-a-repository/)

#### 2b. Download the GitHub Repository

1.  If you are unfamiliar with git, you can also download the repository as a zip file.  The screenshot below illustrates where to click to download the zip file.

   ![GitHub Download](images/github-download.png)

1. Once downloaded to your workstation, you will need expand the `aws-serverless-workshops-master.zip` file into a directory called `aws-serverless-workshops-master` that you will use to edit and package the application code.

### 2. Package the Unicorn API for Deployment

On your workstation:

1. Change directory to `aws-serverless-workshops-master/DevOps/1_ServerlessApplicationModel/unicorn-api`.

1. Use the AWS CLI to execute the [CloudFormation package](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/package.html) command to upload the local code from the `unicorn-api` directory to S3.  Use the following command to do so.  Make sure you replace `YOUR_BUCKET_NAME` with the name you used in the previous section.

```
aws cloudformation package --template-file app-sam.yaml --s3-bucket YOUR_BUCKET_NAME --output-template-file app-sam-output.yaml
```

The **CloudFormation package** command archives the local source code, uploads it to the S3 location specified, and returns an new CloudFormation template to the `app-sam-output.yaml` file with the local CodeUri reference substituted with the location to the S3 object.  For example:

Before:

```yaml
  ReadFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      Handler: read.lambda_handler
      Runtime: nodejs6.10
      CodeUri: app
```

After:

```yaml
  ReadFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      Handler: read.lambda_handler
      Runtime: nodejs6.10
      CodeUri: s3://YOUR_BUCKET_NAME/540839c2fc11f0214f88f6c5dfacd389
```

### 3. Deploy the Unicorn API

1. Change directory to `aws-serverless-workshops-master/DevOps/1_ServerlessApplicationModel/unicorn-api`, if necessary.

2. Use the AWS CLI to execute the [CloudFormation deploy](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/deploy/index.html) command to deploy the `app-sam-output.yaml` CloudFormation template returned by the package command, specifying the CloudFormation stack name `wildrydes-unicorn-api` and the `CAPABILITY_IAM` [CloudFormation capability](http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_CreateStack.ht) as the stack will be creating IAM trust and execution policies for the Lambda functions.  You can use the following command to do so.

```
aws cloudformation deploy --stack-name wildrydes-unicorn-api --template-file app-sam-output.yaml --capabilities CAPABILITY_IAM
```

## Implementation Validation

After the CloudFormation deploy command completes, you will use the browser to test your API.

1. In the AWS Management Console, click **Services** then select **API Gateway** under Application Services.

1. In the left nav, click on `wildrydes-unicorn-api`.

1. In the left nav, under the `wildrydes-unicorn-api` API click on **Stages**

1. In the list of **Stages**, expand the **Prod** stage section

1. Click on the **GET** link under the `/unicorns` resource

1. Open the **Invoke URL** in another browser window and confirm that the Unicorn API responds successfully with an empty JSON list:

   ```json
   []
   ```

## API Enhancement

Now that you've reviewed and deployed the Unicorn API, let's enhance the API with the ability to create or update a Unicorn in the Wild Rydes stables.  The code to do so is already present in the project, so you need to add an **AWS::Serverless::Function** resource in the SAM `app-sam.yaml` template.

### 1. Add Update Function to app-sam.yaml

Using a text editor, open the `app-sam.yaml` file and append a new **AWS::Serverless::Function** Resource labeled `UpdateFunction` that has the following definition.

> Note: whitespace is important in YAML files.  Please verify that the configuration below is added with the same space indentation as the CloudFormation Resources in the app-sam.yaml file.

1. **Runtime** is ``nodejs6.10``

1. **CodeUri** is ``app``

1. **Handler** is ``update.lambda_handler``

1. **Event** type is ``Api`` associated to the ``/unicorns/{name}`` **Path** and ``put`` **Method**

1. **Environment** variable named `TABLE_NAME` that references the `DynamodbTable` Resources for its value.

1. **Policies** should mirror other Functions, however the **Action** to allow is ``dynamodb:PutItem``

If you are unsure of the syntax to add to ``app-sam.yaml`` please refer to the code snippet below.

<details>
<summary><strong>app-sam.yaml additions to support Update function (expand for details)</strong></summary><p>

```yaml
  UpdateFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      Runtime: nodejs6.10
      CodeUri: app
      Handler: update.lambda_handler
      Description: Create or Update Unicorn
      Events:
        UpdateApi:
          Type: Api
          Properties:
            Path: /unicorns/{name}
            Method: put
      Environment:
        Variables:
          TABLE_NAME: !Ref DynamodbTable
      Policies:
        - Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Resource: !Sub 'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/${DynamodbTable}'
              Action:
                - 'dynamodb:PutItem'
```

</p></details>

### 2. Package the Unicorn API for Deployment

Use the AWS CLI to execute the [CloudFormation package](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/package.html) command to upload the local code from the `unicorn-api` directory to S3.  You can use the following command to do so.  Make sure you replace `YOUR_BUCKET_NAME` with the name you used for the previous package command.

```
aws cloudformation package --template-file app-sam.yaml --s3-bucket YOUR_BUCKET_NAME --output-template-file app-sam-output.yaml
```

### 3. Deploy the Unicorn API

Use the AWS CLI to execute the [CloudFormation deploy](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/deploy/index.html) command to deploy the `app-sam-output.yaml` CloudFormation template returned by the package command, specifying the CloudFormation stack name `wildrydes-unicorn-api` and the `CAPABILITY_IAM` [CloudFormation capability](http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_CreateStack.ht) as the stack will be creating IAM trust and execution policies for the Lambda functions.  You can use the following command to do so.

```
aws cloudformation deploy --stack-name wildrydes-unicorn-api --template-file app-sam-output.yaml --capabilities CAPABILITY_IAM
```

CloudFormation will generate a ChangeSet for the `wildrydes-unicorn-api` CloudFormation Stack and only update the resources that have changed since the previous deployment.  In this case, a new Lambda Function and API Gateway resource will be created for the `UpdateFunction` resource that you added to the SAM template.

## Enhancement Validation

After the CloudFormation deploy command completes, you will use the AWS API Gateway to test your API.

1. In the AWS Management Console, click **Services** then select **API Gateway** under Application Services.

1. In the left nav, click on `wildrydes-unicorn-api`.

1. From the list of API resources, click on the `PUT` link under the `/{name}` resource.

1. On the resource details panel, click the `TEST` link in the client box on the left side of the panel.

1. On the test page, enter `Shadowfox` in the **Path** field.

1. Scroll down the test page and enter the following as the **Request Body**:

    ```json
    {
      "breed": "Brown Jersey",
      "description": "Shadowfox joined Wild Rydes after completing a distinguished career in the military, where he toured the world in many critical missions. Shadowfox enjoys impressing his ryders with magic tricks that he learned from his previous owner."
    }
    ```

1. Click on the **Test** button.

1. Scroll to the top of the test page, and verify that on the right side of the panel that the **Status** code of the HTTP response is 200.

1. In the left nav, under the `wildrydes-unicorn-api` API click on **Stages**, expand the **Prod** stage, and choose the `GET` method below the `/unicorns` resource.

1. At the top of the **Prod Stage Editor** panel, choose the **Invoke URL** to display a list of Unicorns in the browser.  `Shadowfox` should be listed with the breed and description entered above.

## Completion

Congratulations!  You have successfully deployed a RESTful serverless API using the Serverless Application Model, and demonstrated that the same tools can be used to make modifications to the API.  In the next [Continuous Delivery Pipeline Module](../2_ContinuousDeliveryPipeline), you will learn how to automate this deployment process using AWS CodePipeline and AWS CodeBuild.
