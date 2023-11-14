import React, { useState } from "react";
import { PostMongo } from "../interfaces";
import AddPost from "./addPost";
import useAuth from "../hooks/useAuth";
// import ImageComponent from "./imageComonent";

interface CommentProps {
  comment: PostMongo;
  comments: PostMongo[];
}

const RenderComment: React.FC<CommentProps> = ({ comment, comments }) => {
  const [showAddPost, setShowAddPost] = useState(false);
  //@ts-ignore
  const { auth } = useAuth();

  const handleReplyClick = () => {
    setShowAddPost(!showAddPost);
  };
 

  return (
    <div className="post-wrapper">
      <div className="post" key={comment._id}>
        <div className="post-header">
          <span className="user-name">{comment.user}</span>
          <span className="date">{comment.createdAt}</span>
          <button className="comment-button" onClick={() => handleReplyClick()}>
            коментувати
          </button>
        </div>
        <div className="post-text">{comment.text}</div>
        {/* {<ImageComponent filedest={ comment.filedest} />} */}
        {showAddPost && <AddPost id={comment._id} />}
        <div>
          {comments
            .filter((c) => c.parentPost === comment._id)
            .map((reply) => (
              <div className="comment" key={reply._id}>
                <RenderComment key={reply._id} comment={reply} comments={comments} />
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
        <RenderComment key={comment._id} comment={comment} comments={comments} />
      ))}
    </div>
  );
};

export default CommentsThread;