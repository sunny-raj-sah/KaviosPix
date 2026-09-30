// import { useState } from "react";

// function AlbumShareForm({
//   sharedUsers = [],
//   onShare,
//   sharing,
// }) {
//   const [emailInput, setEmailInput] =
//     useState("");

//   const [validationError, setValidationError] =
//     useState("");

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setValidationError("");

//     const emails = emailInput
//       .split(",")
//       .map((email) => email.trim().toLowerCase())
//       .filter(Boolean);

//     if (emails.length === 0) {
//       setValidationError(
//         "Please enter at least one email address."
//       );
//       return;
//     }

//     const invalidEmails = emails.filter(
//       (email) =>
//         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
//           email
//         )
//     );

//     if (invalidEmails.length > 0) {
//       setValidationError(
//         `Invalid email address: ${invalidEmails[0]}`
//       );
//       return;
//     }

//     const uniqueEmails = [
//       ...new Set(emails),
//     ];

//     const alreadyShared = uniqueEmails.filter(
//       (email) =>
//         sharedUsers
//           .map((user) =>
//             String(user).toLowerCase()
//           )
//           .includes(email)
//     );

//     if (alreadyShared.length > 0) {
//       setValidationError(
//         `Already shared with: ${alreadyShared.join(
//           ", "
//         )}`
//       );
//       return;
//     }

//     const success = await onShare(
//       uniqueEmails
//     );

//     if (success) {
//       setEmailInput("");
//     }
//   };

//   return (
//     <div className="card border-0 shadow-sm mb-4">
//       <div className="card-body p-4">
//         <h2 className="h5 fw-bold mb-1">
//           Share Album
//         </h2>

//         <p className="text-secondary small mb-4">
//           Share this album with other KaviosPix
//           users by email.
//         </p>

//         {validationError && (
//           <div
//             className="alert alert-danger"
//             role="alert"
//           >
//             {validationError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label
//               htmlFor="shareEmails"
//               className="form-label fw-semibold"
//             >
//               Email addresses
//             </label>

//             <input
//               id="shareEmails"
//               type="text"
//               className="form-control"
//               placeholder="user1@gmail.com, user2@gmail.com"
//               value={emailInput}
//               onChange={(event) => {
//                 setEmailInput(
//                   event.target.value
//                 );
//                 setValidationError("");
//               }}
//               disabled={sharing}
//             />

//             <div className="form-text">
//               Separate multiple email addresses
//               with commas.
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={
//               sharing ||
//               !emailInput.trim()
//             }
//           >
//             {sharing ? (
//               <>
//                 <span
//                   className="spinner-border spinner-border-sm me-2"
//                   role="status"
//                   aria-hidden="true"
//                 />
//                 Sharing...
//               </>
//             ) : (
//               "Share Album"
//             )}
//           </button>
//         </form>

//         <div className="mt-4">
//           <div className="fw-semibold small mb-2">
//             Shared with
//           </div>

//           {sharedUsers.length === 0 ? (
//             <div className="text-secondary small">
//               This album has not been shared yet.
//             </div>
//           ) : (
//             <div className="d-flex flex-wrap gap-2">
//               {sharedUsers.map((email) => (
//                 <span
//                   key={email}
//                   className="badge text-bg-light border text-dark"
//                 >
//                   {email}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AlbumShareForm;
// -----------------------------------------------------------------------------------------------

// import { useState } from "react";

// function AlbumShareForm({
//   sharedUsers = [],
//   onShare,
//   sharing,
// }) {
//   const [emailInput, setEmailInput] = useState("");
//   const [validationError, setValidationError] =
//     useState("");
//   const [showSuggestions, setShowSuggestions] =
//     useState(false);

//   const normalizedSharedUsers = sharedUsers
//     .map((user) => String(user).toLowerCase())
//     .filter(Boolean);

//   const currentInput = emailInput
//     .split(",")
//     .pop()
//     .trim()
//     .toLowerCase();

//   const suggestions = normalizedSharedUsers
//     .filter((email) => {
//       if (!currentInput) {
//         return false;
//       }

//       return (
//         email.includes(currentInput) &&
//         !emailInput
//           .toLowerCase()
//           .split(",")
//           .map((item) => item.trim())
//           .includes(email)
//       );
//     })
//     .slice(0, 5);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setValidationError("");
//     setShowSuggestions(false);

//     const emails = emailInput
//       .split(",")
//       .map((email) => email.trim().toLowerCase())
//       .filter(Boolean);

//     if (emails.length === 0) {
//       setValidationError(
//         "Please enter at least one email address."
//       );
//       return;
//     }

//     const invalidEmails = emails.filter(
//       (email) =>
//         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
//     );

//     if (invalidEmails.length > 0) {
//       setValidationError(
//         `Invalid email address: ${invalidEmails[0]}`
//       );
//       return;
//     }

//     const uniqueEmails = [...new Set(emails)];

//     const alreadyShared = uniqueEmails.filter(
//       (email) =>
//         normalizedSharedUsers.includes(email)
//     );

//     if (alreadyShared.length > 0) {
//       setValidationError(
//         `Already shared with: ${alreadyShared.join(
//           ", "
//         )}`
//       );
//       return;
//     }

//     const success = await onShare(uniqueEmails);

//     if (success) {
//       setEmailInput("");
//     }
//   };

//   const handleSuggestionClick = (email) => {
//     const parts = emailInput.split(",");

//     parts[parts.length - 1] = ` ${email}`;

//     setEmailInput(parts.join(",").trimStart());
//     setValidationError("");
//     setShowSuggestions(false);
//   };

//   return (
//     <div className="card border-0 shadow-sm mb-4">
//       <div className="card-body p-4">
//         <h2 className="h5 fw-bold mb-1">
//           Share Album
//         </h2>

//         <p className="text-secondary small mb-4">
//           Share this album with other KaviosPix
//           users by email.
//         </p>

//         {validationError && (
//           <div
//             className="alert alert-danger"
//             role="alert"
//           >
//             {validationError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3 position-relative">
//             <label
//               htmlFor="shareEmails"
//               className="form-label fw-semibold"
//             >
//               Email addresses
//             </label>

//             <input
//               id="shareEmails"
//               type="text"
//               className="form-control"
//               placeholder="user1@gmail.com, user2@gmail.com"
//               value={emailInput}
//               onChange={(event) => {
//                 setEmailInput(event.target.value);
//                 setValidationError("");
//                 setShowSuggestions(true);
//               }}
//               onFocus={() => {
//                 setShowSuggestions(true);
//               }}
//               onBlur={() => {
//                 setTimeout(() => {
//                   setShowSuggestions(false);
//                 }, 150);
//               }}
//               disabled={sharing}
//               autoComplete="off"
//             />

//             {showSuggestions &&
//               suggestions.length > 0 && (
//                 <div
//                   className="position-absolute start-0 end-0 bg-white border rounded shadow-sm mt-1"
//                   style={{
//                     zIndex: 1050,
//                   }}
//                 >
//                   {suggestions.map((email) => (
//                     <button
//                       key={email}
//                       type="button"
//                       className="btn btn-light w-100 text-start border-0 rounded-0"
//                       onMouseDown={(event) => {
//                         event.preventDefault();
//                         handleSuggestionClick(email);
//                       }}
//                     >
//                       <div className="d-flex align-items-center gap-2">
//                         <span>✉️</span>

//                         <span className="text-truncate">
//                           {email}
//                         </span>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}

//             <div className="form-text">
//               Separate multiple email addresses
//               with commas.
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={
//               sharing ||
//               !emailInput.trim()
//             }
//           >
//             {sharing ? (
//               <>
//                 <span
//                   className="spinner-border spinner-border-sm me-2"
//                   role="status"
//                   aria-hidden="true"
//                 />
//                 Sharing...
//               </>
//             ) : (
//               "Share Album"
//             )}
//           </button>
//         </form>

//         <div className="mt-4">
//           <div className="fw-semibold small mb-2">
//             Shared with
//           </div>

//           {sharedUsers.length === 0 ? (
//             <div className="text-secondary small">
//               This album has not been shared yet.
//             </div>
//           ) : (
//             <div className="d-flex flex-wrap gap-2">
//               {sharedUsers.map((email) => (
//                 <span
//                   key={email}
//                   className="badge text-bg-light border text-dark"
//                 >
//                   {email}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AlbumShareForm;

// -----------------------------------------------------------------
// // 3
// import { useEffect, useState } from "react";
// import { searchUsersByEmail } from "../../services/user.service";

// function AlbumShareForm({
//   sharedUsers = [],
//   onShare,
//   sharing,
//   onRevoke,
//   revokingUser,
// }) {
//   const [emailInput, setEmailInput] = useState("");
//   const [validationError, setValidationError] =
//     useState("");

//   const [suggestions, setSuggestions] = useState([]);
//   const [loadingSuggestions, setLoadingSuggestions] =
//     useState(false);

//   const [showSuggestions, setShowSuggestions] =
//     useState(false);

//   useEffect(() => {
//     const currentEmail = emailInput
//       .split(",")
//       .pop()
//       .trim()
//       .toLowerCase();

//     if (!currentEmail) {
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setSuggestions([]);
//       return;
//     }

//     const timer = setTimeout(async () => {
//       try {
//         setLoadingSuggestions(true);

//         const response =
//           await searchUsersByEmail(currentEmail);

//         setSuggestions(response.data || []);
//       } catch (error) {
//         console.error(
//           "Failed to search users:",
//           error
//         );

//         setSuggestions([]);
//       } finally {
//         setLoadingSuggestions(false);
//       }
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [emailInput]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setValidationError("");
//     setShowSuggestions(false);

//     const emails = emailInput
//       .split(",")
//       .map((email) => email.trim().toLowerCase())
//       .filter(Boolean);

//     if (emails.length === 0) {
//       setValidationError(
//         "Please enter at least one email address."
//       );
//       return;
//     }

//     const invalidEmails = emails.filter(
//       (email) =>
//         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
//     );

//     if (invalidEmails.length > 0) {
//       setValidationError(
//         `Invalid email address: ${invalidEmails[0]}`
//       );
//       return;
//     }

//     const uniqueEmails = [...new Set(emails)];

//     const alreadyShared = uniqueEmails.filter(
//       (email) =>
//         sharedUsers
//           .map((user) =>
//             String(user).toLowerCase()
//           )
//           .includes(email)
//     );

//     if (alreadyShared.length > 0) {
//       setValidationError(
//         `Already shared with: ${alreadyShared.join(
//           ", "
//         )}`
//       );
//       return;
//     }

//     const success = await onShare(uniqueEmails);

//     if (success) {
//       setEmailInput("");
//       setSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (email) => {
//     const parts = emailInput.split(",");

//     parts[parts.length - 1] = ` ${email}`;

//     setEmailInput(parts.join(",").trimStart());

//     setValidationError("");
//     setSuggestions([]);
//     setShowSuggestions(false);
//   };

//   return (
//     <div className="card border-0 shadow-sm mb-4">
//       <div className="card-body p-4">
//         <h2 className="h5 fw-bold mb-1">
//           Share Album
//         </h2>

//         <p className="text-secondary small mb-4">
//           Share this album with other KaviosPix
//           users by email.
//         </p>

//         {validationError && (
//           <div
//             className="alert alert-danger"
//             role="alert"
//           >
//             {validationError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3 position-relative">
//             <label
//               htmlFor="shareEmails"
//               className="form-label fw-semibold"
//             >
//               Email addresses
//             </label>

//             <input
//               id="shareEmails"
//               type="text"
//               className="form-control"
//               placeholder="user1@gmail.com, user2@gmail.com"
//               value={emailInput}
//               onChange={(event) => {
//                 setEmailInput(event.target.value);
//                 setValidationError("");
//                 setShowSuggestions(true);
//               }}
//               onFocus={() => {
//                 if (suggestions.length > 0) {
//                   setShowSuggestions(true);
//                 }
//               }}
//               onBlur={() => {
//                 setTimeout(() => {
//                   setShowSuggestions(false);
//                 }, 150);
//               }}
//               disabled={sharing}
//               autoComplete="off"
//             />

//             {/* Suggestions */}
//             {showSuggestions &&
//               emailInput.trim() &&
//               (loadingSuggestions ||
//                 suggestions.length > 0) && (
//                 <div
//                   className="position-absolute start-0 end-0 bg-white border rounded shadow-sm mt-1 overflow-hidden"
//                   style={{
//                     zIndex: 1050,
//                   }}
//                 >
//                   {loadingSuggestions ? (
//                     <div className="p-3 text-secondary small">
//                       Searching users...
//                     </div>
//                   ) : (
//                     suggestions.map((user) => (
//                       <button
//                         key={user.userId}
//                         type="button"
//                         className="btn btn-light w-100 text-start border-0 rounded-0"
//                         onMouseDown={(event) => {
//                           event.preventDefault();

//                           handleSuggestionClick(
//                             user.email
//                           );
//                         }}
//                       >
//                         <div className="d-flex align-items-center gap-2">
//                           <span>✉️</span>

//                           <span className="text-truncate">
//                             {user.email}
//                           </span>
//                         </div>
//                       </button>
//                     ))
//                   )}
//                 </div>
//               )}

//             <div className="form-text">
//               Start typing an email to find an existing
//               KaviosPix user.
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={
//               sharing ||
//               !emailInput.trim()
//             }
//           >
//             {sharing ? (
//               <>
//                 <span
//                   className="spinner-border spinner-border-sm me-2"
//                   role="status"
//                   aria-hidden="true"
//                 />
//                 Sharing...
//               </>
//             ) : (
//               "Share Album"
//             )}
//           </button>
//         </form>

//         {/* <div className="mt-4">
//           <div className="fw-semibold small mb-2">
//             Shared with
//           </div>

//           {sharedUsers.length === 0 ? (
//             <div className="text-secondary small">
//               This album has not been shared yet.
//             </div>
//           ) : (
//             <div className="d-flex flex-wrap gap-2">
//               {sharedUsers.map((email) => (
//                 <span
//                   key={email}
//                   className="badge text-bg-light border text-dark"
//                 >
//                   {email}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div> */}
//         <div className="mt-4">
//   <div className="fw-semibold small mb-2">
//     Shared with
//   </div>

//   {sharedUsers.length === 0 ? (
//     <div className="text-secondary small">
//       This album has not been shared yet.
//     </div>
//   ) : (
//     <div className="d-flex flex-column gap-2">
//       {sharedUsers.map((email) => (
//         <div
//           key={email}
//           className="border rounded p-2"
//         >
//           <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
//             <div className="d-flex align-items-center gap-2 text-break">
//               <span>✉️</span>

//               <span className="small">
//                 {email}
//               </span>
//             </div>

//             <button
//               type="button"
//               className="btn btn-sm btn-outline-danger flex-shrink-0"
//               onClick={() => onRevoke(email)}
//               disabled={revokingUser === email}
//             >
//               {revokingUser === email ? (
//                 <>
//                   <span
//                     className="spinner-border spinner-border-sm me-1"
//                     role="status"
//                     aria-hidden="true"
//                   />
//                   Revoking...
//                 </>
//               ) : (
//                 "Revoke"
//               )}
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   )}
// </div>
//       </div>
//     </div>
//   );
// }

// export default AlbumShareForm;


// -----------------------------------------------------------------------------
// 4
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

  useEffect(() => {
    const searchTerm = emailInput.trim();

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

  const handleSuggestionClick = (email) => {
    const normalizedEmail = email.trim().toLowerCase();

    const currentEmails = emailInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!currentEmails.includes(normalizedEmail)) {
      const updatedEmails = [
        ...currentEmails,
        normalizedEmail,
      ];

      setEmailInput(`${updatedEmails.join(", ")}, `);
    }

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
    <div className="card shadow-sm">
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
                placeholder="Enter user email"
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