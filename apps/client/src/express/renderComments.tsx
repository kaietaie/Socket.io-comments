import React, { useEffect, useState } from "react";
import { PostMongo } from "../interfaces";
import AddPost from "./addPost";
import useAuth from "../hooks/useAuth";
import ImageComponent from "./imageComonent";
import { AvatarGenerator } from "random-avatar-generator";
import axios from "axios";
import { url } from "../urlToBE";

interface CommentProps {
  comment: PostMongo;
  comments: PostMongo[];
}

const RenderComment: React.FC<CommentProps> = ({ comment, comments }) => {
  const [showAddPost, setShowAddPost] = useState(false);
  const [avatar, setAvatart] = useState("");
  //@ts-ignore
  const { auth } = useAuth();
  const generator = new AvatarGenerator();
  const [imageData, setImageData] = useState<string>("");
  const [extension, setExtension] = useState<string>("");

  const fileExist = comment.filedest.key.length > 0;
  const fetchData = async (comment: PostMongo) => {
    setExtension(comment.filedest.key.split(".")[1]);
    let conType = "application/json";

    await axios
      .get(
        `${url}/api/posts/file/${JSON.stringify({
          dir: comment._id,
          filedest: comment.filedest,
        })}`,
        {
          headers: {
            "Content-Type": conType,
            Authorization: "Bearer " + auth.accessToken,
          },
        }
      )
      .then((res) => {
        if (extension === "txt") {
          const blob = new Blob([res.data], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          setImageData(url);
        } else {
          setImageData(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching image: ", error);
      });
  };

  useEffect(() => {
    const avatarLink = generator.generateRandomAvatar(comment.user);
    setAvatart(avatarLink)
     },[])
  
  useEffect(() => {
    if(fileExist){
      fetchData(comment)
    }
  },[fileExist])


  const handleReplyClick = () => {
    setShowAddPost(!showAddPost);
  };

  return (
    <div className="post-wrapper">
      <div className="post" key={comment._id}>
        <div className="post-header">
          <span className="user-name">
              <img src={avatar} alt="avatar" className="user-image"/>
            {comment.user}
          </span>
          <span className="date">{comment.createdAt}</span>
          <button className="comment-button" onClick={() => handleReplyClick()}>
            коментувати
          </button>
        </div>
        <div className="post-text">{comment.text}</div>
        {imageData && <ImageComponent imageData={imageData}  extension={extension} />}
        {showAddPost && <AddPost id={comment._id} />}
        <div>
          {comments
            .filter((c) => c.parentPost === comment._id)
            .map((reply) => (
              <div className="comment" key={reply._id}>
                <RenderComment
                  key={reply._id}
                  comment={reply}
                  comments={comments}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

interface CommentsThreadProps {
  comments: PostMongo[];
}

const CommentsThread: React.FC<CommentsThreadProps> = ({ comments }) => {
  const topLevelComments = comments.filter(
    (comment) => comment.parentPost === ""
  );

  return (
    <div>
      {topLevelComments.map((comment) => (
        <RenderComment
          key={comment._id}
          comment={comment}
          comments={comments}
        />
      ))}
    </div>
  );
};

export default CommentsThread;
