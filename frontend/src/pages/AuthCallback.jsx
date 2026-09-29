 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AuthCallback() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = () => {
      try {
        console.log(
          "========== AUTH CALLBACK =========="
        );

        console.log(
          "Current URL:",
          window.location.href
        );

        const hash = window.location.hash;

        if (!hash) {
          throw new Error(
            "No authentication token was received."
          );
        }

        const params = new URLSearchParams(
          hash.substring(1)
        );

        const token = params.get("token");

        console.log(
          "Token exists:",
          Boolean(token)
        );

        if (!token) {
          throw new Error(
            "Token was not found in callback URL."
          );
        }

        /*
         * The backend currently sends the user
         * information along with the authentication flow.
         *
         * For now we store the basic user information
         * that we already have.
         */
        const user = {
          userId: null,
          email: null,
        };

        login(token, user);

        console.log(
          "Authentication state updated."
        );

        // Remove JWT from browser URL.
        window.history.replaceState(
          null,
          "",
          window.location.pathname
        );

        navigate("/dashboard", {
          replace: true,
        });
      } catch (error) {
        console.error(
          "AUTH CALLBACK ERROR:",
          error
        );

        setError(error.message);
      }
    };

    handleCallback();
  }, [login, navigate]);

  if (error) {
    return (
      <div className="container">
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
          <div className="alert alert-danger">
            <h1 className="h5">
              Google authentication failed
            </h1>

            <p className="mb-0">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <h1 className="h5">
            Completing Google sign-in...
          </h1>
        </div>
      </div>
    </div>
  );
}

export default AuthCallback;