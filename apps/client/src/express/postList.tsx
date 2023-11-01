import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { PostMongo } from "../interfaces";
import CommentsThread from "./readComments";
import { WebSocketContext } from "../context/WebSocketContext";
import useAuth from "../hooks/useAuth";
axios.defaults.baseURL = 'http://localhost:3000'; 

const PostList = () => {
  const [posts, setPosts] = useState<PostMongo[]>([]);
  const [loading, setLoading] = useState(false);
  const socket = useContext(WebSocketContext);
  const { auth } = useAuth()

  const fetchPosts = () => {
    axios
      .get<PostMongo[]>("/api/posts", {
        headers: { 
          "content-type": "application/json", 
          Authorization: "Bearer " + auth.accessToken },
      })
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  };
  useEffect(() => {
    // Function to handle new posts received from WebSocket

    const handleNewPost = () => {
      console.log("on handleNewPost function");
      fetchPosts();
    };

    // Subscribe to the "newPost" event from the WebSocket

    socket.on("onPost", handleNewPost);

    // Fetch existing posts from the API
    fetchPosts();
    return () => {
      // Clean up the WebSocket subscription when the component unmounts
      socket.off("onPost", handleNewPost);
    };
  }, [socket]);

  if (loading) {
    return <div>Loading...Please wait</div>;
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
