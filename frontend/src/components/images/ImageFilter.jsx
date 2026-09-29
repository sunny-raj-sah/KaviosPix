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
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-8">
              <label
                htmlFor="tagFilter"
                className="form-label fw-semibold"
              >
                Filter by tags
              </label>

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

              <div className="form-text">
                Enter multiple tags separated by commas.
              </div>
            </div>

            <div className="col-12 col-md-auto">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={filtering}
              >
                {filtering ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Filtering...
                  </>
                ) : (
                  "Apply Filter"
                )}
              </button>
            </div>

            <div className="col-12 col-md-auto">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClear}
                disabled={
                  filtering ||
                  activeTags.length === 0
                }
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        {activeTags.length > 0 && (
          <div className="mt-3">
            <span className="small text-secondary me-2">
              Active filters:
            </span>

            {activeTags.map((tag) => (
              <span
                key={tag}
                className="badge text-bg-light border me-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageFilter;