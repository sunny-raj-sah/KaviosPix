// import { useState } from "react";

// function ImageComments({
//   comments = [],
//   onAddComment,
//   addingComment,
//    isAlbumOwner,
// }) {
//   const [comment, setComment] = useState("");

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const trimmedComment = comment.trim();

//     if (!trimmedComment) {
//       return;
//     }

//     if (trimmedComment.length > 500) {
//       return;
//     }

//     const success = await onAddComment(
//       trimmedComment
//     );

//     if (success) {
//       setComment("");
//     }
//   };

//   return (
//     <div className="mt-3 pt-3 border-top">
//       <div className="fw-semibold small mb-2">
//         Comments
//       </div>

//       {comments.length > 0 ? (
//         <div className="mb-3">
//           {comments.map((item, index) => (
//             <div
//               key={`${item}-${index}`}
//               className="bg-light rounded p-2 mb-2 small"
//             >
//               {item}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-secondary small mb-3">
//           No comments yet.
//         </div>
//       )}
//                {isAlbumOwner && (
//       <form onSubmit={handleSubmit}>
//         <div className="input-group input-group-sm">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Add a comment..."
//             value={comment}
//             maxLength={500}
//             onChange={(event) =>
//               setComment(event.target.value)
//             }
//             disabled={addingComment}
//           />

//           <button
//             type="submit"
//             className="btn btn-outline-primary"
//             disabled={
//               addingComment ||
//               !comment.trim()
//             }
//           >
//             {addingComment ? (
//               <span
//                 className="spinner-border spinner-border-sm"
//                 role="status"
//                 aria-hidden="true"
//               />
//             ) : (
//               "Add"
//             )}
//           </button>
//         </div>
//       </form>
//           )}
//       <div className="text-secondary mt-1 text-end">
//         <small>
//           {comment.length}/500
//         </small>
//       </div>
//     </div>
//   );
// }

// export default ImageComments;
// -----------------------------------------------------------------------------------------------
import { useState } from "react";

function ImageComments({
  comments,
  onAddComment,
  addingComment,
  onDeleteComment,
  deletingComment,
  isAlbumOwner,
}) {
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    if (trimmedComment.length > 500) {
      setCommentError(
        "Comment must not exceed 500 characters."
      );
      return;
    }

    try {
      setCommentError("");

      await onAddComment(trimmedComment);

      setComment("");
    } catch (error) {
      setCommentError(
        error.response?.data?.message ||
          "Failed to add comment."
      );
    }
  };

  const handleDelete = async (commentIndex) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await onDeleteComment(commentIndex);
    } catch (error) {
      setCommentError(
        error.response?.data?.message ||
          "Failed to delete comment."
      );
    }
  };

  return (
    <div>
      <h6 className="fw-semibold mb-3">
        Comments
      </h6>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="small text-secondary mb-3">
          No comments yet.
        </p>
      ) : (
        <div className="mb-3">
          {comments.map((comment, index) => (
            <div
              key={`${comment}-${index}`}
              className="d-flex justify-content-between align-items-start gap-2 border-bottom py-2"
            >
              <div className="small text-break flex-grow-1">
                {comment}
              </div>

              {isAlbumOwner && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger flex-shrink-0"
                  onClick={() => handleDelete(index)}
                  disabled={deletingComment === index}
                  title="Delete comment"
                >
                  {deletingComment === index ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    // "Delete"
                     "🗑"
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {commentError && (
        <div
          className="alert alert-danger py-2 small"
          role="alert"
        >
          {commentError}
        </div>
      )}

      {/* Add comment */}
      {isAlbumOwner && (
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <textarea
              className="form-control form-control-sm"
              rows="2"
              placeholder="Write a comment..."
              value={comment}
              onChange={(event) => {
                setComment(event.target.value);
                setCommentError("");
              }}
              maxLength={500}
              disabled={addingComment}
            />

            <div className="d-flex justify-content-between mt-1">
              <small className="text-secondary">
                Maximum 500 characters
              </small>

              <small className="text-secondary">
                {comment.length}/500
              </small>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-sm btn-primary w-100"
            disabled={
              addingComment || !comment.trim()
            }
          >
            {addingComment ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Adding...
              </>
            ) : (
              "Add Comment"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default ImageComments;