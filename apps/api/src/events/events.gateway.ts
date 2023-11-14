import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Server } from 'socket.io';
import { PostsService, objectData } from 'src/express/post.service';
import { Posts, PostsDocument } from 'src/express/schemas/post.schema';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(
    @InjectModel(Posts.name) private postModel: Model<PostsDocument>,
    private postsService: PostsService
  ) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('newPost')
 async handleMessage(@ConnectedSocket() req, @MessageBody() data: objectData) {
    const result = await this.postsService.createPost(data)
    console.log('result', result)
//TODO check updates on MongoDB and fetch it

    this.server.emit('onPost', result); 
  }
}
