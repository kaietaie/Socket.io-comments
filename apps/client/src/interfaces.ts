export interface Post {
    user: string;
    email: string;
    text: string;
    homePage: string;
    createdAt: string;
    parentPost: string;
    file: Express.Multer.File | null;
  }

export interface PostMongo extends Post {
    _id: string;
  }

