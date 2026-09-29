import { useState } from "react";

function ImageComments({
  comments = [],
  onAddComment,
  addingComment,
   isAlbumOwner,
}) {
  const [comment, setComment] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      return;
    }

    if (trimmedComment.length > 500) {
      return;
    }

    const success = await onAddComment(
      trimmedComment
    );

    if (success) {
      setComment("");
    }
  };

  return (
    <div className="mt-3 pt-3 border-top">
      <div className="fw-semibold small mb-2">
        Comments
      </div>

      {comments.length > 0 ? (
        <div className="mb-3">
          {comments.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="bg-light rounded p-2 mb-2 small"
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-secondary small mb-3">
          No comments yet.
        </div>
      )}
               {isAlbumOwner && (
      <form onSubmit={handleSubmit}>
        <div className="input-group input-group-sm">
          <input
            type="text"
            className="form-control"
            placeholder="Add a comment..."
            value={comment}
            maxLength={500}
            onChange={(event) =>
              setComment(event.target.value)
            }
            disabled={addingComment}
          />

          <button
            type="submit"
            className="btn btn-outline-primary"
            disabled={
              addingComment ||
              !comment.trim()
            }
          >
            {addingComment ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Add"
            )}
          </button>
        </div>
      </form>
          )}
      <div className="text-secondary mt-1 text-end">
        <small>
          {comment.length}/500
        </small>
      </div>
    </div>
  );
}

export default ImageComments;