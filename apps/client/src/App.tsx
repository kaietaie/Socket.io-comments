import './App.css'
import PostList from './postList';
import AddPost from './addPost';

function App() {

  return (
    <>
      <div className='main-content'>
        <AddPost />
        <PostList />
      </div>
    </>
  )
}

export default App
