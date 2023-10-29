import * as AWS from 'aws-sdk';
import 'dotenv/config';



AWS.config.update({
  region: process.env.region,
  accessKeyId:  process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
});
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

export async function sendMessageToQueue(messageBody: string): Promise<object> {
  const queueUrl = 'https://sqs.eu-central-1.amazonaws.com/056197879789/MySQS';
  const params = {
    QueueUrl: queueUrl,
    MessageBody: messageBody,
  };
  try {
    const res = await sqs.sendMessage(params).promise();
    return res;
  } catch (error) {
    return error; 
  }
}


