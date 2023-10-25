import * as AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-central-1',
  accessKeyId: 'AKIAQ2FNHS7WTK2MSJFV',
  secretAccessKey: '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',
});
 
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

export async function sendMessageToQueue(messageBody: string): Promise<string> {
  const queueUrl = 'https://sqs.eu-central-1.amazonaws.com/056197879789/MySQS';
    const params = {
    QueueUrl: queueUrl,
    MessageBody: messageBody,
  };
console.dir(params.MessageBody)
  try {
    const res = await sqs.sendMessage(params).promise();
    return `Message was successfully sent, ${res.MD5OfMessageBody}`;
  } catch (error) {
    return `Error sending message: ${error}`;
  }
}


