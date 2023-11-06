import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/express/dto/create-user.dto';
import emailValidation from 'src/safety/emailValidation';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const safetyEmail = emailValidation(email);

    if (typeof safetyEmail !== 'string') {
      return { error: 'Credentials incorrect' };
    }

    const userResp = await this.usersService.findOne(email);
    if(userResp.length === 0 ) {
      return { error: 'User not found' };
    }
    const user = userResp[0]['_doc'];

    if (user && user.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user._id,
      username: user.username,
      email: user.email,
    };
  
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(createUser: CreateUserDTO): Promise<object> {
    console.log(createUser)
    return this.usersService.createUser(createUser);
  }

  async getUserFromToken(token: string) {
    const decoded = this.jwtService.decode(token);
    return decoded;
  }
}
