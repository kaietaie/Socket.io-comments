import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PostMongo } from '../interfaces';
import CommentsThread from './readComments';
import { WebSocketContext } from '../context/WebSocketContext';


const PostList = () => {
  const [posts, setPosts] = useState<PostMongo[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useContext(WebSocketContext);

  useEffect(() => {
     // Function to handle new posts received from WebSocket

     const handleNewPost = (newPost: PostMongo) => {
      console.log("on handleNewPost function")
      console.log(newPost)
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    // Subscribe to the "newPost" event from the WebSocket

    socket.on('onPost', handleNewPost);

    // Fetch existing posts from the API
    axios.get<PostMongo[]>('/api/posts')
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
      return () => {
        // Clean up the WebSocket subscription when the component unmounts
        socket.off('onPost', handleNewPost);
      };
    }, [socket]);

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
