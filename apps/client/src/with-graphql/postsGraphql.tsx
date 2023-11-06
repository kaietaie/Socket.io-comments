import { useQuery } from "@apollo/client"
import { ALL_POSTS } from "./posts"
import CommentsThread from "./readComments";
import AddPost from "./addPost";


const Graph = () => {
    const { loading, error, data } = useQuery(ALL_POSTS);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }
    const posts = data.posts
    if (posts.length === 0) {
        return <div>No posts found.</div>;
    }

    return (
        <div>
            <AddPost/>
            <h1>Posts</h1>
            <CommentsThread comments={posts} />
        </div>
    );
}

export default Graph