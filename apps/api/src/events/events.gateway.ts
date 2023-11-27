import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PostsService, objectData } from 'src/express/post.service';
// import * as gm from 'gm'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(private postsService: PostsService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('newPost')
  async handleMessage(@ConnectedSocket() req, @MessageBody() data: objectData) {
    console.log("SubscribeMessage",data)
    //@ts-ignore
    if (data.post.filedest.key.length !== 0) {
      const extention = data.post.filedest.key.split('.').pop().toLowerCase();
      // const validFormats = ['jpeg', 'jpg', 'png', 'gif', 'txt'];
      // if (!validFormats.includes(extention)) {
      //   console.log('Invalid file format. Supported formats: JPG, PNG, GIF, TXT')
      //   this.server.emit('onPostError', {
      //     statusCode: 400,
      //     message: 'Invalid file format. Supported formats: JPG, PNG, GIF, TXT',
      //   });
      //   return;
      // }
      // if (extention !== 'txt') {
      //   const resizedBuffer = await new Promise<Buffer>((resolve, reject) => {
      //     const gm7 = gm.subClass({ imageMagick: '<7' });
      //       gm7(data.uploadfile.file, data.uploadfile.fileName)
      //         .resize(320, 240)
      //         .toBuffer((err, buffer) => {
      //           if (err) {
      //             reject(err);
      //           } else {
      //             resolve(buffer);
      //           }
      //         });
      //     });
      //   data.uploadfile.file = resizedBuffer;
      // }
      if (extention === 'txt' && data.uploadfile.fileSize > 102400) {
        this.server.emit('onPostError', {
          statusCode: 400,
          message: 'Invalid file size. Supported size is less 100Kb',
        });
        return;
      }
    }
    const result = await this.postsService.createPost(data);

    this.server.emit('onPost', result);
  }
}
