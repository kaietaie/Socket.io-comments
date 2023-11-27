import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts, PostsDocument } from './schemas/post.schema';
import { format } from 'date-fns';
import { MessageProducer } from 'src/aws-sqs-s3/producer.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CachedUserDTO } from './dto/cached-user.dto';
// import { InjectS3 } from 'nestjs-s3';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { parseUrl } from '@smithy/url-parser';
import { formatUrl } from '@aws-sdk/util-format-url';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { Hash } from '@smithy/hash-node';
import { HttpRequest } from '@smithy/protocol-http';
import { config } from 'src/config';

export interface objectData {
  post: Posts;
  uploadfile: {
    fileSize: number;
    file: Buffer;
  };
  authorization: string;
}

@Injectable()
export class PostsService {
  private readonly s3 = new S3Client({
    region: config.REGION,
  })

  constructor(
    @InjectModel(Posts.name) private postModel: Model<PostsDocument>,
    private readonly messageProducer: MessageProducer,
    private usersServise: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private authService: AuthService,
    // @InjectS3() private readonly s3: S3Client,
  ) {}

  async getAllPosts(): Promise<Posts[]> {
    return this.postModel.find().exec();
  }

  async createPost(data: objectData): Promise<object> {
    const createPost = data.post;
    const createdAt = format(new Date(), "dd.MM.yy 'в' k:mm");

    let user: CachedUserDTO = await this.cachedUser(data.authorization);

    const newPost = new this.postModel({
      ...createPost,
      createdAt,
      user: user.username,
    });
    console.log("data.uploadfile", data.uploadfile)

    await this.saveFile(newPost, data.uploadfile)
    
    const messageToQueue = { newPost };
    await this.messageProducer.sendMessageToQueue(
      JSON.stringify(messageToQueue),
    ).catch((error) => {
      console.log("SQS error: ", error.message)
    });
    await this.usersServise.addPostToUser(user.sub, newPost._id);

    return {
      statusCode: 201,
      newPost,
    };
  }

  async cachedUser(auth) {
    let user: CachedUserDTO = await this.cacheManager.get('cachedUser');
    if (!user) {
      //@ts-ignore
      const token = auth.slice(7);
      const userFromToken = await this.authService.getUserFromToken(token);
      await this.cacheManager.set('cachedUser', userFromToken);
    }
    user = await this.cacheManager.get('cachedUser');
    return user;
  }

  async saveFile(newPost, uploadfile) {
    if (uploadfile.fileSize > 0) {
      const extension = newPost.filedest.key.split(".")[1]
      let conType = `image/${extension}`;
      if(extension === 'txt') {
        conType = 'text/plain';
      }
      console.log("content type: ", conType)
      // const buffer = Buffer.from(uploadfile.file);
      const command = new PutObjectCommand({
          Bucket: newPost.filedest.bucket,
          Key: newPost._id + '/' +newPost.filedest.key,
          Body: uploadfile.file,
          ContentType: conType,
        })
        await this.s3.send(command)
        .catch( (error) => {
          console.log("Cannot put object to S3: ", error.message)
          console.log("Error Response S3: ", error.$response)
        })
    }
  }

  async getFile(file: {
    dir: string;
    filedest: {
      bucket: string;
      key: string;
    };
  }) {
    const region = 'eu-central-1';
    const url = parseUrl(
      `https://${file.filedest.bucket}.s3.${region}.amazonaws.com/${file.dir}/${file.filedest.key}`,
    );
    const presigner = new S3RequestPresigner({
      credentials: {
        accessKeyId: config.ACCESSKEYID,
        secretAccessKey: config.SECRETACCESSKEY
      },
      region,
      sha256: Hash.bind(null, 'sha256'),
    });

    
    const signedUrlObject = await presigner.presign(new HttpRequest(url));
    return formatUrl(signedUrlObject);
  }
}
