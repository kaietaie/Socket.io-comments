import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/express/dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('signup')
  signUp(@Body() createUser: CreateUserDTO) {
    return this.authService.signUp(createUser);
  }

}
