import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";

interface EnvironmentType {
  ENVIRONMENT: string;
  CLS_NAMESPACE: string;
}

interface ApiConfigType {
  ENVIRONMENTS: { [key: string]: EnvironmentType };
  PROJECT_NAME: string;
}

interface SQSStackProps extends cdk.StackProps {
  sqsName: string;
  apiConfig: ApiConfigType;
}

export class SQSStack extends cdk.Stack {
    public readonly logQueueArn: string;

  constructor(scope: Construct, id: string, props?: SQSStackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(
      this,
      `${props?.apiConfig.PROJECT_NAME}-SQS-${props?.sqsName}`,
      {
        queueName: props?.sqsName,
        visibilityTimeout: cdk.Duration.seconds(300),
        receiveMessageWaitTime: cdk.Duration.seconds(0),
      }
    );

    this.logQueueArn = queue.queueArn;

  }
}
