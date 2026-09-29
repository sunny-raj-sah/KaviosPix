 
 import { loginWithGoogle } from "../services/auth.service";

function Login() {
  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="container">
      <div className="row min-vh-100 align-items-center justify-content-center">
        <div className="col-11 col-sm-8 col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5 text-center">
              <h1 className="h3 fw-bold mb-2">
                Welcome to KaviosPix
              </h1>

              <p className="text-secondary mb-4">
                Sign in to manage your photos and albums.
              </p>

              <button
                type="button"
                className="btn btn-dark w-100 py-2"
                onClick={handleGoogleLogin}
              >
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;