import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getVar(): object {
    const region = this.appService.region;
    const accessKeyId = this.appService.accessKeyId;
    const secretAccessKey = this.appService.secretAccessKey;
    return {
      region,
      accessKeyId, 
      secretAccessKey, 
    };
  }
}
