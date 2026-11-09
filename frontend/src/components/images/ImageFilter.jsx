  
import { useState } from "react";

function ImageFilter({
  activeTags,
  onApply,
  onClear,
  filtering,
}) {
  const [value, setValue] = useState(
    activeTags.join(", ")
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    const tags = value
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    onApply(tags);
  };

  const handleClear = () => {
    setValue("");
    onClear();
  };

  return (
    // <div className="card border-0 shadow-sm mb-4">
    <div className="card border shadow-sm mb-4">
      <div className="card-body p-3 p-md-4">
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="tagFilter"
            className="form-label fw-semibold mb-2"
          >
            Filter by tags
          </label>

          <div className="d-flex gap-2 align-items-center">
            {/* Input */}
            <div className="flex-grow-1">
              <input
                id="tagFilter"
                type="text"
                className="form-control"
                placeholder="e.g. travel, nature"
                value={value}
                onChange={(event) =>
                  setValue(event.target.value)
                }
                disabled={filtering}
              />
            </div>

            {/* Apply */}
            <button
              type="submit"
              className="btn btn-primary flex-shrink-0"
              disabled={filtering}
            >
              {filtering ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="d-none d-sm-inline ms-2">
                    Filtering...
                  </span>
                </>
              ) : (
                <>
                  <span className="d-sm-none">Apply</span>
                  <span className="d-none d-sm-inline">
                    Apply Filter
                  </span>
                </>
              )}
            </button>

            {/* Clear */}
            <button
              type="button"
              className="btn btn-outline-secondary flex-shrink-0"
              onClick={handleClear}
              disabled={
                filtering ||
                activeTags.length === 0
              }
            >
              Clear
            </button>
          </div>

          <div className="form-text">
            Enter multiple tags separated by commas.
          </div>
        </form>

        {/* Active Filters */}
        {activeTags.length > 0 && (
          <div className="mt-3 pt-3 border-top">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="small text-secondary fw-semibold">
                Active filters:
              </span>

              {activeTags.map((tag) => (
                <span
                  key={tag}
                  className="badge text-bg-light border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageFilter;