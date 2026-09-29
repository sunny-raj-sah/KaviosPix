 import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const email = user?.email || "";

  const userName =
    user?.name ||
    (email
      ? email.split("@")[0]
      : "Account");

  const initial =
    email?.charAt(0)?.toUpperCase() ||
    userName.charAt(0).toUpperCase() ||
    "U";

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container py-1">

        {/* Brand */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center gap-2"
        >
          <span className="kaviospix-logo">
            K
          </span>

          <span className="fw-bold text-dark">
            KaviosPix
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
        >
          <div className="ms-auto d-flex flex-column flex-lg-row align-items-lg-center gap-2">

            {isAuthenticated ? (
              <>
                {/* Navigation */}
                <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-1">

                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `kavios-nav-link ${
                        isActive
                          ? "kavios-nav-active"
                          : ""
                      }`
                    }
                  >
                    Albums
                  </NavLink>

                  <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                      `kavios-nav-link ${
                        isActive
                          ? "kavios-nav-active"
                          : ""
                      }`
                    }
                  >
                    <span className="me-1">
                      ★
                    </span>
                    Favorites
                  </NavLink>
                </div>

                {/* Desktop divider */}
                <div className="d-none d-lg-block kavios-divider" />

                {/* Account */}
                <div className="dropdown">
                  <button
                    type="button"
                    className="kavios-account-btn"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {/* Avatar */}
                    <span className="kavios-avatar">
                      {initial}
                    </span>

                    {/* Account information */}
                    <span className="kavios-account-info">
                      <span className="kavios-account-name">
                        {userName}
                      </span>

                      <span className="kavios-account-email">
                        {email ||
                          "Email unavailable"}
                      </span>
                    </span>

                    <span className="kavios-arrow">
                      ▾
                    </span>
                  </button>

                  {/* Account dropdown */}
                  <div className="dropdown-menu dropdown-menu-end kavios-account-menu">

                    <div className="kavios-account-header">
                      <div className="d-flex align-items-center gap-3">

                        <span className="kavios-avatar kavios-avatar-large">
                          {initial}
                        </span>

                        <div className="overflow-hidden">
                          <div className="fw-semibold text-dark text-truncate">
                            {userName}
                          </div>

                          <div
                            className="small text-secondary text-break"
                            title={email}
                          >
                            {email ||
                              "Email unavailable"}
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <div className="kavios-email-box">
                      <div className="small text-secondary mb-1">
                        Signed in with
                      </div>

                      <div className="small fw-semibold text-dark text-break">
                        {email ||
                          "Email unavailable"}
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      className="dropdown-item kavios-logout"
                      onClick={handleLogout}
                    >
                      <span className="me-2">
                        ↪
                      </span>
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary px-4"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;