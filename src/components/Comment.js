import { useState, useRef, useEffect } from 'react';
import { ReactComponent as DownArrow } from '../assets/down-arrow.svg';
import { ReactComponent as UpArrow } from '../assets/up-arrow.svg';
import Action from './Action';
import Mark from './mark';

const Comment = ({ comment, 
    handleInsertNode,
     handleEditNode, 
     handleDeleteNode}) =>{
    const [input, setInput] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [expand, setExpand] = useState(false);
    const inputRef = useRef(null);
    const [sortByLatest, setSortByLatest] = useState(false);

    useEffect(()=>{
        inputRef?.current?.focus();
    },[editMode]);

    const handleNewComment = () => {
        setExpand(!expand);
        setShowInput(true);
    };

    const onAddComment = ()=>{
        if(editMode){
            handleEditNode(comment.id, inputRef?.current?.innerText);
        }else{
            setExpand(true);
            handleInsertNode(comment.id, input);
            setShowInput(false);
            setInput("")
        }
        if(editMode) setEditMode(false);
    };

    const handleDelete=()=>{
        handleDeleteNode(comment.id);
    }

    const sortCommentsByReplies = (comments) => {
        // Sort the comments by the number of replies
        // comments.sort((a, b) => {
        //     const numRepliesA = countReplies(a);
        //     const numRepliesB = countReplies(b);
        //     return numRepliesB - numRepliesA;
        // });
    
        // Recursively count the number of replies for a comment and its children
        function countReplies(comment) {
            let count = comment.replies.length;
            if (comment.items) {
                comment.items.forEach(childComment => {
                    count += countReplies(childComment);
                });
            }
            return count;
        }
    };

    const countReplies = (comment) => {
        let count = comment.replies.length;
        if (comment.items) {
            comment.items.forEach(childComment => {
                count += countReplies(childComment);
            });
        }
        return count;
    };

    const toggleSortOrder = () => {
        setSortByLatest(!sortByLatest);
    };

    // Sort function based on the time of latest reply
    const sortCommentsByLatestReply = (a, b) => {
        const latestReplyTimeA = getLatestReplyTime(a);
        const latestReplyTimeB = getLatestReplyTime(b);
        return sortByLatest ? latestReplyTimeB - latestReplyTimeA : latestReplyTimeA - latestReplyTimeB;
    };

    // Function to get the time of the latest reply
    const getLatestReplyTime = (comment) => {
        if (!comment.replies || comment.replies.length === 0) {
            return comment.timestamp; // If there are no replies, return the comment's timestamp
        } else {
            // Otherwise, find the latest reply's timestamp
            const latestReply = comment.replies.reduce((prev, current) => (prev.timestamp > current.timestamp) ? prev : current);
            return latestReply.timestamp;
        }
    };

    return (
        
    <div>  
        <div className={comment.id === 1 ? "inputContainer" : "commentContainer"}>
            
            {comment.id === 1 ? (
                <>
                    <input type='text' className='inputContainer__input first_input'
                    autoFocus
                    value={input}
                    onChange={(e)=> setInput(e.target.value)}
                    placeholder='Enter your Comment...'/>
                    <Action 
                        className='reply comment' 
                        type='COMMENT' 
                        handleClick={onAddComment}
                    />
                    <button className='btn' onClick={sortCommentsByReplies}>Sort by Replies</button>
                    <div>
                <button className='btn' onClick={toggleSortOrder}>Sort by Latest Reply</button>
            </div>
                </>
            ):(
                <>
                    <span 
                        contentEditable={editMode}
                        suppressContentEditableWarning = {editMode} 
                        style={{wordWrap: "break-word"}}
                        ref={inputRef}>{comment.name}</span>
                    <div style={{ display: "flex", marginTop: "5px"}}>
                        {editMode ? (
                            <>
                                <Action className='reply' type='SAVE' handleClick={onAddComment}/>
                                <Action 
                                    className='reply' 
                                    type='CANCEL'
                                    handleClick={()=>{
                                        if(inputRef.current)
                                            inputRef.current.innerText = comment.name;
                                        setEditMode(false);
                                        
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <Action 
                                    className='reply' 
                                    type={
                                    <>
                                        {expand ? (
                                        <UpArrow width="10px" height="10px" />
                                        ) : (
                                        <DownArrow width="10px" height="10px" />
                                        )}{" "}
                                        REPLY
                                    </>
                                    }
                                    handleClick={handleNewComment}
                                />
                                <Action 
                                    className='reply' 
                                    type='EDIT'
                                    handleClick={()=>{
                                        setEditMode(true);
                                    }}
                                />
                                <Action className='reply' handleClick={handleDelete} type='DELETE'/>
                                {/* <button onClick={() => handleLike(comment.id)}>Like</button> */}
                                <Mark/>
                            </>
                        )}
                    </div>
                </>
            )} 
        </div>
        <div style={{ display:expand ? "block":"none",paddingLeft: 25}}>
            {showInput &&(
                <div className='inputContainer'>
                    <input
                        type='text'
                        className='inputContainer__input'
                        autoFocus
                        onChange={(e)=> setInput(e.target.value)}
                    />
                    <Action className='reply' handleClick={onAddComment} type='REPLY'/>
                    <Action className='reply' type='CANCEL'
                        handleClick={()=>{
                            setShowInput(false);
                            if(!comment?.items?.length) setExpand(false);
                        }}
                    />
                </div>
            )}
            

            {comment.items?.slice().sort(sortCommentsByLatestReply).map((cmnt) => {
                    return <Comment key={cmnt.id}
                        handleInsertNode={handleInsertNode}
                        handleEditNode={handleEditNode}
                        handleDeleteNode={handleDeleteNode}
                        comment={cmnt} />
                }).sort((a, b) => countReplies(b) - countReplies(a))}

        </div>   
        
    </div>
            
    )
}

export default Comment;