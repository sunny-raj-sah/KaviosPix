import { useState } from "react";

function AlbumShareForm({
  sharedUsers = [],
  onShare,
  sharing,
}) {
  const [emailInput, setEmailInput] =
    useState("");

  const [validationError, setValidationError] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setValidationError("");

    const emails = emailInput
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (emails.length === 0) {
      setValidationError(
        "Please enter at least one email address."
      );
      return;
    }

    const invalidEmails = emails.filter(
      (email) =>
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email
        )
    );

    if (invalidEmails.length > 0) {
      setValidationError(
        `Invalid email address: ${invalidEmails[0]}`
      );
      return;
    }

    const uniqueEmails = [
      ...new Set(emails),
    ];

    const alreadyShared = uniqueEmails.filter(
      (email) =>
        sharedUsers
          .map((user) =>
            String(user).toLowerCase()
          )
          .includes(email)
    );

    if (alreadyShared.length > 0) {
      setValidationError(
        `Already shared with: ${alreadyShared.join(
          ", "
        )}`
      );
      return;
    }

    const success = await onShare(
      uniqueEmails
    );

    if (success) {
      setEmailInput("");
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">
        <h2 className="h5 fw-bold mb-1">
          Share Album
        </h2>

        <p className="text-secondary small mb-4">
          Share this album with other KaviosPix
          users by email.
        </p>

        {validationError && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="shareEmails"
              className="form-label fw-semibold"
            >
              Email addresses
            </label>

            <input
              id="shareEmails"
              type="text"
              className="form-control"
              placeholder="user1@gmail.com, user2@gmail.com"
              value={emailInput}
              onChange={(event) => {
                setEmailInput(
                  event.target.value
                );
                setValidationError("");
              }}
              disabled={sharing}
            />

            <div className="form-text">
              Separate multiple email addresses
              with commas.
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              sharing ||
              !emailInput.trim()
            }
          >
            {sharing ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Sharing...
              </>
            ) : (
              "Share Album"
            )}
          </button>
        </form>

        <div className="mt-4">
          <div className="fw-semibold small mb-2">
            Shared with
          </div>

          {sharedUsers.length === 0 ? (
            <div className="text-secondary small">
              This album has not been shared yet.
            </div>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {sharedUsers.map((email) => (
                <span
                  key={email}
                  className="badge text-bg-light border text-dark"
                >
                  {email}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlbumShareForm;