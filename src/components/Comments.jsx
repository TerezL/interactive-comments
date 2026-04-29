import { useState } from "react";
import data from "/data.json";
import CommentItem from "./CommentItem";
import { useEffect } from "react";


 function Comments() { 

  const [comments, setComments] = useState(() => {
  const saved = localStorage.getItem("comments");

  if (saved) {
    return JSON.parse(saved);
  }

  return data.comments; // 👈 fallback na data.json
});
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);


  const addComment = () => {
    if (!newComment.trim()) return;

    const newObj = {
      id: Date.now(),
      content: newComment,
      createdAt: "now",
      score: 0,
      user: data.currentUser,
      replies: [],
    };

    setComments([...comments, newObj]);
    setNewComment("");
  };

  return (
    <>
    <button
  onClick={() => {
    localStorage.removeItem("comments");
    window.location.reload();
  }}
>
  Reset data
</button>
    <div className="max-w-2xl mx-auto p-4 ">
    
      {comments.map((c) => (
        <CommentItem
            key={c.id}
            item={c}
            currentUser={data.currentUser}
            setComments={setComments}
        />
      ))}
      

      <div className="flex gap-3 mt-6 bg-white p-4 rounded-lg shadow ">
       <span><img src={`${import.meta.env.BASE_URL}${data.currentUser.image.png}`} alt="avatar" className="w-8 h-8 rounded-full" /></span>
        <textarea
          className="flex-1 border border-gray-400 focus:outline-none rounded-lg p-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          onClick={addComment}
          className="bg-blue-600 text-white px-4 rounded-lg h-10 cursor-pointer hover:opacity-60"
        >
          SEND
        </button>
        
      </div>
    </div>

</>
  );
}

export default Comments