# Lab 1: Authentication with Cognito User Pools

In this lab, you will integrate user authentication and API authorization into your serverless survivor chat application with [Amazon Cognito](https://aws.amazon.com/cognito/). 

## Architecture Overview

The Zombie survivor chat requires a survivor to sign up for a user account in order to communicate with other survivors. Once a survivor signs up for an account, they will be able to authenticate into the communications system in order to chat with other apocalypse survivors. [Amazon Cognito](https://aws.amazon.com/cognito/) provides the ability to create user directories for this purpose with [Cognito User Pools](http://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html). You will now setup the Cognito User Pool as a user directory for your survivors. 

Once a survivor has successfully logged into the communications system, their session will include temporary credentials from Cognito User Pools in the form of a JSON Web Tokens (JWT) that will be used by the application when making authenticated requests to the REST API.

  ![Authentication with Cognito User Pools](images/CognitoArchitectureOverview.png)

## Lab Instructions

> Note: Before starting this lab, please make sure you have already [launched the CloudFormation template](../README.md##Get-Started) and the status of the stack is CREATE_COMPLETE.

### Region Selection

This workshop can be deployed in any AWS region that supports the following services:

- Amazon API Gateway
- Amazon S3
- Amazon DynamoDB
- AWS CodeBuild
- AWS CodePipeline
- AWS Lambda
- AWS X-Ray

You can refer to the [region table](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/) in the AWS documentation to see which regions have the supported services. Among the supported regions you can choose are N. Virginia, Ohio, Oregon, Ireland, Frankfurt, and Sydney.

Once you've chosen a region, you should deploy all of the resources for this workshop there. Make sure you select your region from the dropdown in the upper right corner of the AWS Console before getting started.

![Region selection screenshot](images/region-selection.png)

### 1. Create an S3 Bucket

Use the console or AWS CLI to create an Amazon S3 bucket with versioning enabled. Keep in mind that your bucket's name must be globally unique. We recommend using a name like `wildrydes-devops-yourname`.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console choose **Services** then select **S3** under Storage.

1. Choose **+Create Bucket**

1. Provide a globally unique name for your bucket such as `wildrydes-devops-yourname`.

1. Select the Region you've chosen to use for this workshop from the dropdown.

   ![Create bucket](images/create-bucket-1.png)

1. Choose **Next** in the lower right of the dialog.

1. Choose the **Versioning** properties box.

   ![Bucket Versioning](images/create-bucket-2.png)

1. Choose **Enable versioning** and click **Save** in the dialog box.

   ![Bucket Enable Versioning](images/create-bucket-3.png)

1. Choose **Next** in the lower right of the dialog.

   ![Bucket Enable Versioning](images/create-bucket-4.png)

1. Choose **Next** in the lower right of the dialog.

1. Choose **Create Bucket** in the lower right of the dialog.

</p></details>

### 2. Clone or Download GitHub Repository

This workshop requires you to modify text files on your workstation and to package the application project for deployment.  To obtain a local copy, you will need to clone or download this GitHub Repository.

1.  In your web browser, open the following link to the [Wild Rydes Serverless Workshop](https://github.com/awslabs/aws-serverless-workshops).

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
