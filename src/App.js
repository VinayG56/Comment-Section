import { useState } from 'react';
import Comment from './components/Comment';
import useNode from './hooks/useNode';
import './App.css';


const comments = {
  id: 1,
  items: []
};

function App() {
  const [commentsData, setCommentsData] = useState(comments);

  const {insertNode, editNode, deleteNode} = useNode();

  const handleInsertNode = (folderId, item)=>{
    const finalStructure = insertNode(commentsData, folderId, item);
    setCommentsData(finalStructure);
  };

  const handleEditNode = (folderId, value)=>{
    const finalStructure = editNode(commentsData, folderId, value);
    setCommentsData(finalStructure);
  };

  const handleDeleteNode = (folderId, item)=>{
    const finalStructure = deleteNode(commentsData, folderId);
    const temp = {...finalStructure};
    setCommentsData(temp);
  };
  return (
    <div className="App">
      {/* <h1 className='heading'>Comment Section</h1> */}

      <Comment
        handleInsertNode = {handleInsertNode}
        handleEditNode = {handleEditNode}
        handleDeleteNode = {handleDeleteNode}
      comment={commentsData}/>
      

    </div>
  );
}

export default App;
