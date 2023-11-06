import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, Users } from 'src/express/schemas/user.schema';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
    CacheModule.register({
      tll: 360000,
      isGlobal: true,
    }),
  ],
  exports: [UsersService],
})
export class UsersModule {}
