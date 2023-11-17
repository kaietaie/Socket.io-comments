import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { PostMongo } from "../interfaces";
import CommentsThread from "./renderComments";
import { WebSocketContext } from "../context/WebSocketContext";
import useAuth from "../hooks/useAuth";

const PostList = () => {
  const [posts, setPosts] = useState<PostMongo[]>([]);
  const [loading, setLoading] = useState(false);
  const socket = useContext(WebSocketContext);
  //@ts-ignore
  const { auth } = useAuth();

  const fetchPosts = () => {
    axios
      .get<PostMongo[]>(
        `${import.meta.env.VITE_HOST}:${
          import.meta.env.VITE_PORT
        }/api/posts`,
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
    console.log(posts)
    console.log(newPost)
    //@ts-ignore
    setPosts(posts => [... posts, newPost]);
    console.log(posts)
  }; 

  useEffect(() => {

    // Subscribe to the "newPost" event from the WebSocket
    socket.on("onPost", (res) => {
      handleNewPost(res);
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
      <div>
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
