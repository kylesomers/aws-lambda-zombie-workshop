# AWS Zombie Microservices Workshop

The [AWS Zombie Microservices Workshop](http://aws.amazon.com/events/zombie-microservices-roadshow/) introduces the basics of building serverless applications using [AWS Lambda](https://aws.amazon.com/lambda/), [Amazon API Gateway](https://aws.amazon.com/api-gateway/), [Amazon DynamoDB](https://aws.amazon.com/dynamodb/), [Amazon Cognito](https://aws.amazon.com/cognito/), [Amazon SNS](https://aws.amazon.com/sns/), and other AWS services. In this workshop, as a new member of the AWS Lambda Signal Corps, you are tasked with completing the development of a serverless survivor communications system during the Zombie Apocalypse.

This workshop provides a [CloudFormation](https://aws.amazon.com/cloudformation/) template that deploys the survivor chat. You will then complete lab exercises/modules that extend the functionality of the communications system. You're also encouraged to get creative and add your own custom functionality!

The below diagram represents a high level overview of the completed workshop

![Zombie Microservices Workshop Architecture](images/ZombieCompleteArchitecture.png)

Prior to beginning the labs, you will need to finalize the setup of User authentication for the application with [Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html). This is a necessary step to finalize the readiness of the application.

## Prerequisites

### AWS Account

In order to complete this workshop you'll need an AWS Account with access to create AWS IAM, S3, DynamoDB, Lambda, API Gateway, Cognito, SNS, and Elasticsearch Service resources. 

It is recommended to do this workshop individually with your own separate AWS Account. This maximizes the learning experience and allows you to keep your resources for further development and customization. If you choose to work as a team, please keep the following in mind:

* The workshop has been designed with unique resource naming to allow for multiple CloudFormation stacks to be launched into a single AWS Account. This allows multiple users in one AWS Account to individually launch their own workshop CloudFormation template. However, there are manual resources that you will create in the labs, so make sure that you and your teammates are using unique names when manually creating new Lambda functions and other resources.

* Alternatively, one teammate can launch the CloudFormation template and provide a CloudFormation input representing the number of teammates you are working with. CloudFormation will then automatically create additional IAM Users in your AWS Account which you can share with your teammates if you would like to all work on the same instane of the workshop. In this scenario, it is common for the team to distribute the labs and each teammate will work on a different lab/module.


All of the resources you will launch as part of this workshop are eligible for the AWS free tier if your account is less than 12 months old. See the [AWS Free Tier page](https://aws.amazon.com/free/) for more details.

## Modules

A workshop consists of multiple modules. Each module should cover a single, cohesive topic and take between 30 and 60 minutes for all students to complete. Consider the least experienced students who are likely to take this workshop when scoping your modules.

You should strongly consider providing CloudFormation templates that students can use to launch any required resources from previous modules to enable students to jump ahead to later modules without having to complete the preceeding modules manually.

Provide a numbered list with links to each module

1. [Example Module 1](1_ExampleTemplate)
2. [Example Module 2](2_Example2)
