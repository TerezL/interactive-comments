import { useState, useEffect } from "react";
import replyIcon from "/public/assets/icon-reply.svg";
import deleteIcon from "/public/assets/icon-delete.svg";
import editIcon from "/public/assets/icon-edit.svg";
function CommentItem({ item, currentUser, setComments }) {
  const [count, setCount] = useState(0);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.content);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") setShowModal(false);
  };

  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
}, []);

  // 🧠 REPLY
  const handleReply = () => {
    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now(),
      content: replyText,
      createdAt: "now",
      score: 0,
      replyingTo: item.user.username,
      user: currentUser,
      replies: [],
    };

    const addReplyRecursive = (comments, parentId) => {
      return comments.map((c) => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply],
          };
        }

        if (c.replies?.length > 0) {
          return {
            ...c,
            replies: addReplyRecursive(c.replies, parentId),
          };
        }

        return c;
      });
    };

    setComments((prev) => addReplyRecursive(prev, item.id));
    setReplyText("");
    setIsReplying(false);
  };

  // 🗑️ DELETE
  const deleteRecursive = (comments, id) => {
    return comments
      .filter((c) => c.id !== id)
      .map((c) => ({
        ...c,
        replies: c.replies
          ? deleteRecursive(c.replies, id)
          : [],
      }));
  };

  const handleDelete = () => {
    setComments((prev) => deleteRecursive(prev, item.id));
  };

  // ✏️ EDIT
  const editRecursive = (comments, id, newText) => {
    return comments.map((c) => {
      if (c.id === id) {
        return { ...c, content: newText };
      }

      if (c.replies?.length > 0) {
        return {
          ...c,
          replies: editRecursive(c.replies, id, newText),
        };
      }

      return c;
    });
  };

  const handleSave = () => {
    setComments((prev) =>
      editRecursive(prev, item.id, editText)
    );
    setIsEditing(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl p-4 shadow mb-4">
        <div className="flex gap-4">
          
          {/* SCORE */}
          <div className="flex flex-col items-center bg-gray-100 px-2 py-1 rounded">
            <button onClick={() => setCount(c => c + 1)} className="cursor-pointer">+</button>
            <span className="font-bold">{item.score + count}</span>
            <button onClick={() => setCount(c => c - 1)} className="cursor-pointer">-</button>
          </div>

          {/* CONTENT */}
          <div className="flex-1">
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <img
                  src={`${import.meta.env.BASE_URL}${item.user.image.png}`}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-bold">{item.user.username}</span>

                {item.user.username === currentUser.username && (
                  <span className="bg-blue-500 text-white text-xs py-1 px-2 rounded">
                    you
                  </span>
                )}

                <span className="text-gray-400 text-sm">
                  {item.createdAt}
                </span>
              </div>

              {/* ACTIONS */}
              {item.user.username === currentUser.username ? (
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-red-500 flex items-center gap-1 cursor-pointer hover:opacity-60"
                  >
                  <img src={deleteIcon} alt="delete" className="w-4 h-4" />
                    Delete
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-700 flex items-center gap-1 cursor-pointer hover:opacity-60"
                  >
                  <img src={editIcon} alt="editIcon" className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsReplying(true)}
                  className="flex items-center gap-1 text-blue-700 text-sm cursor-pointer hover:opacity-60"
                >
                  <img src={replyIcon} className="w-4 h-4" />
                  Reply
                </button>
              )}
            </div>

            {/* TEXT */}
            {isEditing ? (
              <>
                <textarea
                  className="w-full border rounded p-2 mt-2"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-1 rounded mt-2 cursor-pointer hover:opacity-60"
                >
                  UPDATE
                </button>
              </>
            ) : (
              <p className="mt-2 text-gray-700">
                {item.replyingTo && (
                  <span className="text-blue-500 mr-1">
                    @{item.replyingTo}
                  </span>
                )}
                {item.content}
              </p>
            )}

            {/* REPLY INPUT */}
            {isReplying && (
              <div className="mt-3 flex gap-2">
                <input
                  className="flex-1 border rounded p-2"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button
                  onClick={handleReply}
                  className="bg-blue-600 text-white px-3 rounded cursor-pointer hover:opacity-60"
                >
                  REPLY
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECURSIVE RENDER */}
      {item.replies?.map((r) => (
        <div key={r.id} className="ml-6 border-l pl-4">
          <CommentItem
            item={r}
            currentUser={currentUser}
            setComments={setComments}
          />
        </div>
      ))}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center"
         onClick={() => setShowModal(false)}>
          <div className="bg-white p-6 rounded-xl max-w-md w-[90%]"
           onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-3">
          Delete comment
        </h2>

        <p className="text-gray-500 mb-4">
          Are you sure you want to delete this comment?
          This will remove the comment and can't be undone.
        </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
              >
                NO, CANCEL
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowModal(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
              >
               YES, DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommentItem;