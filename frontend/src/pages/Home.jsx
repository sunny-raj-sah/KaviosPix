 import {
  Link,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Home() {
  const { isAuthenticated } =
    useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-bottom">
        <div className="container py-5">
          <div className="row align-items-center g-5 py-md-5">
            <div className="col-12 col-lg-7">
              <span className="badge text-bg-primary-subtle text-primary mb-3 px-3 py-2">
                Your private photo space
              </span>

              <h1 className="display-4 fw-bold lh-sm mb-4">
                Organize your memories.
                <br />
                <span className="text-primary">
                  Your way.
                </span>
              </h1>

              <p className="lead text-secondary mb-4">
                KaviosPix helps you organize,
                protect, search, and share your
                photos through albums built around
                your own memories.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-2">
                <Link
                  to={
                    isAuthenticated
                      ? "/dashboard"
                      : "/login"
                  }
                  className="btn btn-primary btn-lg px-4"
                >
                  {isAuthenticated
                    ? "Open My Albums"
                    : "Get Started"}
                </Link>

                {!isAuthenticated && (
                  <a
                    href="#features"
                    className="btn btn-outline-secondary btn-lg px-4"
                  >
                    Explore Features
                  </a>
                )}
              </div>

              <div className="d-flex flex-wrap gap-4 mt-4 text-secondary small">
                <span>
                  ✓ Protected access
                </span>

                <span>
                  ✓ Album sharing
                </span>

                <span>
                  ✓ Favorites & tags
                </span>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="position-relative">
                <div
                  className="card border-0 shadow-lg overflow-hidden"
                  style={{
                    borderRadius: "24px",
                  }}
                >
                  <div className="row g-0">
                    <div className="col-7">
                      <div
                        className="bg-primary-subtle d-flex align-items-center justify-content-center"
                        style={{
                          minHeight: "300px",
                        }}
                      >
                        <div className="text-center p-4">
                          <div
                            className="display-1 mb-3"
                            aria-hidden="true"
                          >
                            🖼️
                          </div>

                          <h2 className="h5 fw-bold">
                            Your memories
                          </h2>

                          <p className="small text-secondary mb-0">
                            Organized in one
                            place.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-5">
                      <div className="h-100 d-flex flex-column">
                        <div
                          className="bg-dark text-white d-flex align-items-center justify-content-center"
                          style={{
                            minHeight: "150px",
                          }}
                        >
                          <span className="display-5">
                            ★
                          </span>
                        </div>

                        <div className="bg-light flex-grow-1 d-flex align-items-center justify-content-center">
                          <div className="text-center p-3">
                            <div className="fw-bold">
                              Albums
                            </div>

                            <div className="small text-secondary">
                              Share
                              memories
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="position-absolute bg-white shadow-sm rounded-3 px-3 py-2"
                  style={{
                    right: "-10px",
                    bottom: "24px",
                  }}
                >
                  <div className="small fw-semibold">
                    🔒 Protected
                  </div>

                  <div className="small text-secondary">
                    Private by design
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-5"
      >
        <div className="container py-md-4">
          <div className="text-center mb-5">
            <span className="small text-primary fw-semibold text-uppercase">
              Built for your memories
            </span>

            <h2 className="display-6 fw-bold mt-2">
              Everything you need
            </h2>

            <p className="text-secondary mx-auto mb-0" style={{ maxWidth: "650px" }}>
              Keep your photos organized,
              discoverable, and accessible while
              keeping control over who can access
              your albums.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="fs-2 mb-3">
                    📁
                  </div>

                  <h3 className="h5 fw-bold">
                    Organized Albums
                  </h3>

                  <p className="text-secondary mb-0">
                    Create albums for trips,
                    projects, family moments, or
                    anything else you want to keep
                    together.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="fs-2 mb-3">
                    🔐
                  </div>

                  <h3 className="h5 fw-bold">
                    Protected Photos
                  </h3>

                  <p className="text-secondary mb-0">
                    Images are served through
                    authenticated backend endpoints
                    instead of exposing public file
                    URLs.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="fs-2 mb-3">
                    ⭐
                  </div>

                  <h3 className="h5 fw-bold">
                    Favorites
                  </h3>

                  <p className="text-secondary mb-0">
                    Mark important photos as
                    favorites and access them from
                    one dedicated view.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="fs-2 mb-3">
                    🏷️
                  </div>

                  <h3 className="h5 fw-bold">
                    Tags & Filtering
                  </h3>

                  <p className="text-secondary mb-0">
                    Add tags to photos and quickly
                    filter an album using one or
                    multiple tags.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="fs-2 mb-3">
                    💬
                  </div>

                  <h3 className="h5 fw-bold">
                    Photo Comments
                  </h3>

                  <p className="text-secondary mb-0">
                    Keep contextual notes and
                    comments attached directly to
                    the photos they belong to.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="fs-2 mb-3">
                    👥
                  </div>

                  <h3 className="h5 fw-bold">
                    Album Sharing
                  </h3>

                  <p className="text-secondary mb-0">
                    Share albums with specific
                    users by email while keeping
                    owner-only operations protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture section */}
      <section className="bg-white border-top border-bottom py-5">
        <div className="container py-md-4">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <span className="small text-primary fw-semibold text-uppercase">
                Built with a secure API architecture
              </span>

              <h2 className="display-6 fw-bold mt-2 mb-3">
                Your photos stay behind
                authenticated APIs.
              </h2>

              <p className="text-secondary mb-4">
                KaviosPix uses authentication and
                album-level access checks before
                serving protected image files.
              </p>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-3">
                  <div className="text-primary fw-bold">
                    01
                  </div>

                  <div>
                    <div className="fw-semibold">
                      Authenticate
                    </div>

                    <div className="small text-secondary">
                      Verify the user's identity.
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div className="text-primary fw-bold">
                    02
                  </div>

                  <div>
                    <div className="fw-semibold">
                      Check album access
                    </div>

                    <div className="small text-secondary">
                      Owner or authorized shared
                      user.
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div className="text-primary fw-bold">
                    03
                  </div>

                  <div>
                    <div className="fw-semibold">
                      Serve the image
                    </div>

                    <div className="small text-secondary">
                      Only after authorization
                      succeeds.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm bg-light">
                <div className="card-body p-4">
                  <div className="small text-secondary mb-3">
                    REQUEST FLOW
                  </div>

                  <div className="font-monospace small">
                    <div>
                      Client
                    </div>

                    <div className="text-secondary py-2">
                      ↓
                    </div>

                    <div>
                      JWT Authentication
                    </div>

                    <div className="text-secondary py-2">
                      ↓
                    </div>

                    <div>
                      Album Access Check
                    </div>

                    <div className="text-secondary py-2">
                      ↓
                    </div>

                    <div>
                      Image Access Check
                    </div>

                    <div className="text-secondary py-2">
                      ↓
                    </div>

                    <div className="text-success fw-semibold">
                      Protected Image
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container py-md-4">
          <div className="card border-0 bg-primary text-white shadow-sm">
            <div className="card-body p-4 p-md-5 text-center">
              <h2 className="display-6 fw-bold mb-3">
                Ready to organize your memories?
              </h2>

              <p className="mb-4 opacity-75">
                Create your first album and start
                building your personal photo space.
              </p>

              <Link
                to={
                  isAuthenticated
                    ? "/dashboard"
                    : "/login"
                }
                className="btn btn-light btn-lg px-4"
              >
                {isAuthenticated
                  ? "Open My Albums"
                  : "Get Started"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;