import React, { useState } from 'react';
import { Post } from './interfaces';
import AddPost from './addPost';

interface ShowPost extends Post {
    _id: string;
}
interface CommentProps {
    comment: ShowPost;
    comments: ShowPost[];
}

const Comment: React.FC<CommentProps> = ({ comment, comments }) => {
   
    const [showAddPost, setShowAddPost] = useState(false);


    const handleReplyClick = () => {
        setShowAddPost(true)
    }

    return (
        <div className='post-wrapper'>
            <div className='post' key={comment._id}>
                <div className='post-header'>
                    <span className='user-name'>{comment.user}</span>
                    <span className='date'>{comment.createdAt}</span>
                    <button className='comment-button' onClick={handleReplyClick}>коментувати</button>
                </div>
                <div className='post-text'>{comment.text}</div>
                {showAddPost && <AddPost id={comment._id} />}
                <div>
                    {comments
                        .filter((c) => c.parentPost === comment._id)
                        .map((reply) => (
                            <div className='comment' key={reply._id}>
                                <Comment key={reply._id} comment={reply} comments={comments} />
                            </div>
                        )
                        )}
                </div>
            </div>
        </div>
    );
};

interface CommentsThreadProps {
    comments: ShowPost[];
}

const CommentsThread: React.FC<CommentsThreadProps> = ({ comments }) => {
    const topLevelComments = comments.filter((comment) => comment.parentPost === "");

    return (
        <div>
            {topLevelComments.map((comment) => (
                <Comment key={comment._id} comment={comment} comments={comments} />
            ))}
        </div>
    )
}

export default CommentsThread;
