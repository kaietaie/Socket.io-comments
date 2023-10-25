import { useState, useEffect } from 'react';
import axios from 'axios';
import { Post } from '../interfaces';
import CommentsThread from './readComments';

const PostList = () => {
  interface PostMongo extends Post {
    _id: string;
  }
  const [posts, setPosts] = useState<PostMongo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<PostMongo[]>('/api/posts')
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (posts.length === 0) {
    return <div>No posts found.</div>;
  }
  
  return (
    <div>
      <h1>Posts</h1>
        <CommentsThread comments={posts} />
    </div>
  );
};

export default PostList;
