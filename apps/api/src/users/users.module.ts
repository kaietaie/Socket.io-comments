import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, Users } from 'src/express/schemas/user.schema';

@Module({
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([
      {name: Users.name, schema: UserSchema}
  ]),
  ],
  exports: [UsersService]
})
export class UsersModule {}
