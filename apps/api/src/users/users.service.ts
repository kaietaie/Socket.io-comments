import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from 'src/express/dto/create-user.dto';
import { Users, UsersDocument } from 'src/express/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
  ) {}

  async findOne(safetyEmail: string) {
    const email = safetyEmail;
    const user = await this.userModel.find({ email });
    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.find({ id });

    return user;
  }

  async createUser(createUser: CreateUserDTO): Promise<object> {
    const { email } = createUser;
    const exist = await this.userModel.find({ email });
    if (exist.length === 0) {
      const newUser = new this.userModel(createUser);
      newUser.save();
      return {
        statusCode: 201,
        message: 'Ok',
        newUser,
      };
    } else
      return {
        statusCode: 409,
        message: 'User already exist',
      };
  }

  async addPostToUser(userId: string, postId: string) {
    const newPost = { $push: { posts: postId } };
    await this.userModel.updateOne(
      { _id: userId },
      newPost,
      { new: false }, // Return the updated user document
    );
  }

  
}
