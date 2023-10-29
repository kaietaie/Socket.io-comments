import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor( private readonly configService: ConfigService) {}

  get region(): string {
    return this.configService.get<string>('REGION');
  }

  get accessKeyId(): string {
    return this.configService.get<string>('REGION');
  }

  get secretAccessKey(): string {
    return this.configService.get<string>('REGION');
  }

  getVar(): object {
    return {
      region: this.region, 
      accessKeyId: this.accessKeyId, 
      secretAccessKey: this.secretAccessKey, 
    };
  }

}
