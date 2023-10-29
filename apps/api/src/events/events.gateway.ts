import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreatePostDTO } from 'src/express/dto/create-post.dto';
import { format } from 'date-fns';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('newPost')
  handleMessage(@MessageBody() body: CreatePostDTO) {
    this.server.emit('onPost', {
      user: body.user,
      text: body.text,
      createdAt: body.createdAt,
      email: body.email,
      homePage: body.homePage,
      parentPost: body.parentPost,
      file: body.file,
    });
  }
}
