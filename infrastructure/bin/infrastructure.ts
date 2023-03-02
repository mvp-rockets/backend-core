#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { readFileSync } from 'fs';
import { SQSStack } from '../lib/SQS/sqs-stack';
import { RdsStack } from '../lib/RDS/rds-stack';


interface EnvironmentType {
  ENVIRONMENT: string;
  CLS_NAMESPACE: string;
  DB_DATABASE_NAME: string;
  DB_USERNAME: string;
}



interface ApiConfigType {
  ENVIRONMENTS: { [key: string]: EnvironmentType };
  PROJECT_NAME: string
  SQS: [];
}

const app = new cdk.App();

const apiConfig: ApiConfigType = JSON.parse(readFileSync('./cdk.config.json', 'utf-8'))

const { PROJECT_NAME, ENVIRONMENTS , SQS} = apiConfig;

const env = {
  region: process.env.REGION,
  appname: PROJECT_NAME
}


const sqs = SQS;

const environmentKeys = Object.keys(ENVIRONMENTS)


sqs.forEach(sqsDetails => {
  environmentKeys.forEach(envir=> {
      const nameForSqs = `${sqsDetails}-${envir}`;
      var sqs = new SQSStack(app, `${PROJECT_NAME}-${nameForSqs}`,{env: env, sqsName:nameForSqs, apiConfig: apiConfig});

      console.log(`ARN FOR ${nameForSqs} : ${sqs.logQueueArn}`);
      
  }
)});


environmentKeys.forEach(envir=> {
    const nameForRds = `${ENVIRONMENTS[envir].DB_DATABASE_NAME}${envir}`;
    new RdsStack(app, `${PROJECT_NAME}-${nameForRds}`,{env: {
      account: process.env.CDK_DEFAULT_ACCOUNT, 
      region: process.env.CDK_DEFAULT_REGION 
    }, dbName: nameForRds, rdsUsername:ENVIRONMENTS[envir].DB_USERNAME,  })
}
)
