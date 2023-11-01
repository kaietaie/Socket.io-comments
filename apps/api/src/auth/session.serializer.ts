import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './constants';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    const key = jwtConstants.secret;

    jwt.verify(user.access_token, key, (err, decoded) => {
      if (err) {
        console.log(err)
        done(err, user);
      } else {
        const userId = decoded.sub;

        done(null, userId);
      }
    });
  }

  async deserializeUser(userId: any, done: (err: Error, user: any) => void) {
    console.dir({ userId });
    const user = await this.usersService.findById(userId)
    console.dir(user)
    done(null, user);
  }
}
