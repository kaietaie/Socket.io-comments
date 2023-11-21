import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { PostMongo } from "../interfaces";
import CommentsThread from "./renderComments";
import { WebSocketContext } from "../context/WebSocketContext";
import useAuth from "../hooks/useAuth";
import { url } from "../urlToBE";

const PostList = () => {
  const [posts, setPosts] = useState<PostMongo[]>([]);
  const [loading, setLoading] = useState(false);
  
  const socket = useContext(WebSocketContext);
  //@ts-ignore
  const { auth } = useAuth();

  const fetchPosts = () => {
    axios
      .get<PostMongo[]>(
        `${url}/api/posts`,
        {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + auth.accessToken,
          },
        }
      )
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  };
 
  const handleNewPost = (res: object) => {
    console.log("Received new post via WebSocket");
    //@ts-ignore
    const { newPost } = res;
    
    //@ts-ignore
    setPosts(posts => [... posts, newPost]);
  }; 

  const handlePostError = (res: object) => {
    console.log(res)

  };

  useEffect(() => {

    // Subscribe to the "newPost" event from the WebSocket
    socket.on("onPost", (res) => {
      handleNewPost(res);
    });
    socket.on("onPostError", (res) => {
      console.log("onPostError");
      handlePostError(res);
    });

    // Fetch existing posts from the API
    fetchPosts();
    return () => {
      // Clean up the WebSocket subscription when the component unmounts
      socket.off("onPost", handleNewPost);
    };
  }, [socket, auth.accessToken]);

  if (loading) {
    return <div>Завантаження...Почекайте будь ласка</div>;
  }

  if (Array.isArray(posts) && posts.length > 0) {
    return (
      <div className="post-parent-wrapper">
        <h1>Коментарі</h1>
        <CommentsThread comments={posts} />
      </div>
    );
  }
  return (
    <div>
      <h2>Увійдіть щоб побачити коментарі</h2>
    </div>
  );
};

export default PostList;
