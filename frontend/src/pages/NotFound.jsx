import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container">
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1 className="display-1 fw-bold">
            404
          </h1>

          <p className="text-secondary mb-4">
            The page you are looking for does not exist.
          </p>

          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;