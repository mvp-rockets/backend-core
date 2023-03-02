
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

import * as rds from 'aws-cdk-lib/aws-rds'
import { CfnOutput } from "aws-cdk-lib";

 
  interface RdsStackProps extends cdk.StackProps {
    rdsUsername : string,
    dbName: string
  }
  
  export class RdsStack extends cdk.Stack {
      public readonly logQueueArn: string;
  
    constructor(scope: Construct, id: string, props?: RdsStackProps) {
      super(scope, id, props);

      const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true });



      const rdsInstance = new rds.DatabaseInstance(this, `${props?.dbName}`, {
        vpc: vpc,
        databaseName: props?.dbName,
        engine: rds.DatabaseInstanceEngine.postgres({
          version: rds.PostgresEngineVersion.VER_14_5,
        }),
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.BURSTABLE3,
          ec2.InstanceSize.MICRO
        ),
  
        credentials: rds.Credentials.fromGeneratedSecret(props?.rdsUsername!),
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },

  
        storageEncrypted: false
      })

      rdsInstance.secret?.secretArn

      new CfnOutput(this, `Rds-EndPoint`, {
        value: rdsInstance.instanceEndpoint.hostname,
        description: `Hostname for ${props?.dbName} Created`


      })

      new CfnOutput(this, `Secret-ARN`, {
        value: rdsInstance.secret?.secretArn!,
        description: `Secret ARN`


      })
    }
}