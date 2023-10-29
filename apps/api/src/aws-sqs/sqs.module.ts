import { Module } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { SqsModule } from '@ssut/nestjs-sqs';
import { MessageProducer } from './producer.service';
import { config } from 'src/config';


AWS.config.update({
    region: config.REGION, 
    accessKeyId: config.ACCESSKEYID,
    secretAccessKey: config.SECRETACCESSKEY, 
});

@Module({
  imports: [
    SqsModule.register({
      producers: [
        {
          name: 'MySQS',
          queueUrl: 'https://sqs.eu-central-1.amazonaws.com/056197879789/MySQS',
          region: 'eu-central-1',
        },
      ],
    }),
  ],
  controllers: [],
  providers: [MessageProducer],
  exports: [MessageProducer],
})
export class SQSModule {}
