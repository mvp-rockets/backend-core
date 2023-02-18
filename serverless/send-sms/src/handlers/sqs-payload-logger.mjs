/**
 * A Lambda function that logs the payload received from SQS.
 */
import axios from 'axios';
import { helloWorld }from '/opt/nodejs/index.js';
export const sqsPayloadLoggerHandler = async (event, context) => {
    // All log statements are written to CloudWatch by default. For more information, see
    // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-logging.html
    console.log("I am in send sms")
    console.log("axios", axios)
    console.log("Is hello world", helloWorld());
    console.info(JSON.stringify(event));
}
