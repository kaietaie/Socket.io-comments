import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { MessageProducer } from './producer.service';
import { config } from 'src/config';
import { S3Module } from 'nestjs-s3';


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
    S3Module.forRoot({
      config: {
        endpoint: config.HOST + ':' + config.PORT,
        forcePathStyle: true,
      },
    }),
  ],
  controllers: [],
  providers: [MessageProducer],
  exports: [MessageProducer],
})
export class AWSModule {
}
