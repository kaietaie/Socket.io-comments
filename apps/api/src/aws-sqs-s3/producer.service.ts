import { Injectable } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { randomUUID } from 'crypto';

@Injectable()
export class MessageProducer {
  constructor(private readonly sqsService: SqsService) {}
  
  public async sendMessageToQueue(messageBody) {
    try {
        const message = {
            id: randomUUID(),
            body: messageBody
        }
      const sqsRes = await this.sqsService.send('MySQS', message);
      console.log(sqsRes)
    } catch (error) {
      console.log( `Error in pushing to SQS! ${error}`);
    }
  }
}
