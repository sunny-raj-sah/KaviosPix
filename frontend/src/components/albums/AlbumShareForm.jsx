 
import { useEffect, useState } from "react";
import { searchUsersByEmail } from "../../services/user.service";

function AlbumShareForm({
  sharedUsers = [],
  onShare,
  onRevoke,
  revokingUser,
  sharing,
}) {
  const [emailInput, setEmailInput] = useState("");
  const [validationError, setValidationError] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const [showAllSharedUsers, setShowAllSharedUsers] = useState(false);

  // useEffect(() => {
  //   const searchTerm = emailInput.trim();

  //   if (!searchTerm) {
  //     // eslint-disable-next-line react-hooks/set-state-in-effect
  //     setSuggestions([]);
  //     setSearchingUsers(false);
  //     return;
  //   }

  //   const timer = setTimeout(async () => {
  //     try {
  //       setSearchingUsers(true);

  //       const response = await searchUsersByEmail(searchTerm);

  //       setSuggestions(response.data || []);
  //     } catch (error) {
  //       console.error("Failed to search users:", error);
  //       setSuggestions([]);
  //     } finally {
  //       setSearchingUsers(false);
  //     }
  //   }, 300);

  //   return () => clearTimeout(timer);
  // }, [emailInput]);
useEffect(() => {
  // Get only the text after the last comma.
  // Example:
  // "new@3.com, su" -> "su"
  const searchTerm = emailInput
    .split(",")
    .pop()
    ?.trim();

  if (!searchTerm) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuggestions([]);
    setSearchingUsers(false);
    return;
  }

  const timer = setTimeout(async () => {
    try {
      setSearchingUsers(true);

      const response = await searchUsersByEmail(searchTerm);

      setSuggestions(response.data || []);
    } catch (error) {
      console.error("Failed to search users:", error);
      setSuggestions([]);
    } finally {
      setSearchingUsers(false);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [emailInput]);

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
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );

    if (invalidEmails.length > 0) {
      setValidationError(
        `Invalid email address: ${invalidEmails[0]}`
      );
      return;
    }

    const uniqueEmails = [...new Set(emails)];

    const alreadyShared = uniqueEmails.filter((email) =>
      sharedUsers
        .map((user) => String(user).toLowerCase())
        .includes(email)
    );

    if (alreadyShared.length > 0) {
      setValidationError(
        `Already shared with: ${alreadyShared.join(", ")}`
      );
      return;
    }

    const success = await onShare(uniqueEmails);

    if (success) {
      setEmailInput("");
      setSuggestions([]);
    }
  };

  // const handleSuggestionClick = (email) => {
  //   const normalizedEmail = email.trim().toLowerCase();

  //   const currentEmails = emailInput
  //     .split(",")
  //     .map((item) => item.trim())
  //     .filter(Boolean);

  //   if (!currentEmails.includes(normalizedEmail)) {
  //     const updatedEmails = [
  //       ...currentEmails,
  //       normalizedEmail,
  //     ];

  //     setEmailInput(`${updatedEmails.join(", ")}, `);
  //   }

  //   setSuggestions([]);
  // };

  const handleSuggestionClick = (email) => {
  const normalizedEmail = email.trim().toLowerCase();

  const parts = emailInput.split(",");

  // Remove the currently typed/searching keyword
  parts.pop();

  const selectedEmails = parts
    .map((item) => item.trim())
    .filter(Boolean);

  // Avoid adding the same email twice
  if (!selectedEmails.includes(normalizedEmail)) {
    selectedEmails.push(normalizedEmail);
  }

  // Keep comma + space so the user can immediately search
  // for the next user.
  setEmailInput(`${selectedEmails.join(", ")}, `);

  setSuggestions([]);
};
  const visibleSharedUsers = showAllSharedUsers
    ? sharedUsers
    : sharedUsers.slice(0, 3);

  const remainingUsers = Math.max(
    sharedUsers.length - 3,
    0
  );

  return (
    // <div className="card shadow-sm">
    <div className="card border shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">
          Share Album
        </h5>

        <form onSubmit={handleSubmit}>
          <div className="position-relative">
            <div className="input-group">
              
              <input
                type="text"
                className="form-control"
                placeholder="Enter user email(s), separated by commas"
                value={emailInput}
                onChange={(event) => {
                  setEmailInput(event.target.value);
                  setValidationError("");
                }}
                autoComplete="off"
              />

              <button
                type="submit"
                className="btn btn-primary"
                disabled={sharing}
              >
                {sharing ? "Sharing..." : "Share"}
              </button>
            </div>

            {searchingUsers && (
              <div className="small text-secondary mt-1">
                Searching users...
              </div>
            )}

            {suggestions.length > 0 && (
              <div
                className="position-absolute bg-white border rounded shadow-sm w-100 mt-1"
                style={{
                  zIndex: 1000,
                }}
              >
                {suggestions.map((user) => (
                  <button
                    key={user.userId}
                    type="button"
                    className="btn btn-light w-100 text-start border-0 rounded-0"
                    onClick={() =>
                      handleSuggestionClick(user.email)
                    }
                  >
                    {user.email}
                  </button>
                ))}
              </div>
            )}
          </div>

          {validationError && (
            <div className="text-danger small mt-2">
              {validationError}
            </div>
          )}
        </form>

        {/* Shared users */}
        <div className="mt-4">
          <div className="fw-semibold small mb-2">
            Shared with
          </div>

          {sharedUsers.length === 0 ? (
            <div className="text-secondary small">
              This album has not been shared yet.
            </div>
          ) : (
            <>
              <div className="d-flex flex-wrap gap-2">
                {visibleSharedUsers.map((email) => (
                  <div
                    key={email}
                    className="border rounded-pill px-2 py-1 d-inline-flex align-items-center gap-2"
                  >
                    <span
                      className="small text-break"
                      style={{
                        maxWidth: "260px",
                      }}
                    >
                      {email}
                    </span>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger py-0 px-2"
                      onClick={() => onRevoke(email)}
                      disabled={revokingUser === email}
                    >
                      {revokingUser === email ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-1"
                            role="status"
                            aria-hidden="true"
                          />
                          Revoking
                        </>
                      ) : (
                        "Revoke"
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {sharedUsers.length > 3 && (
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      setShowAllSharedUsers(
                        (current) => !current
                      )
                    }
                  >
                    {showAllSharedUsers
                      ? "Show less"
                      : `Show ${remainingUsers} more`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlbumShareForm;