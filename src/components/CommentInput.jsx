import { useState } from "react";

function CommentInput({ currentUser, setComments }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    const newComment = {
      id: Date.now(),
      content: text,
      createdAt: "now",
      score: 0,
      user: currentUser,
      replies: [],
    };

    setComments((prev) => [...prev, newComment]);
    setText("");
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow flex gap-3 mt-6">
      
      {/* avatar */}
      <img
        src={`${import.meta.env.BASE_URL}${currentUser.image.png}`}
        className="w-8 h-8 rounded-full"
      />

      {/* input */}
      <textarea
        className="flex-1 border rounded p-2"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* button */}
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 rounded"
      >
        SEND
      </button>
    </div>
  );
}

export default CommentInput;