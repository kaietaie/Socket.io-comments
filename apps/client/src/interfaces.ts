export interface Post {
  text: string;
  parentPost: string;
  // file: Express.Multer.File | null;
}

export interface PostMongo extends Post {
  _id: string;
  user: string;
  createdAt: string;
}

export interface PostGraph extends Post {
  user: string;
  homePage: string;
  email: string;
  createdAt: string;
}
