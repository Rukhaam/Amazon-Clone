import { useState, useEffect } from "react";
import { useAuth } from "../../src/context/useAuth";
import { Link } from "react-router-dom";

// Standard CSS imports if you have them
// import './forgot-password.styles.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Destructure from your Context
  const { handleResetPassword, authLoading, authError, setAuthError } =
    useAuth();

  // Clear errors when component mounts/unmounts
  useEffect(() => {
    setAuthError("");
  }, [setAuthError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(""); // Clear previous success messages

    // Call the function from Context
    const success = await handleResetPassword(email);

    if (success) {
      setSuccessMsg("Check your email! We sent you a reset link.");
      setEmail(""); // Clear input on success
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Password Assistance
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter the email address associated with your Amazon account.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-bold text-sm text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded shadow-sm transition-colors disabled:opacity-50"
          >
            {authLoading ? "Sending..." : "Continue"}
          </button>
        </form>

        {/* Messages */}
        {successMsg && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded">
            ✅ {successMsg}
          </div>
        )}

        {authError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            ⚠️ {authError}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link
          to="/signin"
          className="text-blue-600 hover:underline hover:text-orange-700 text-sm flex items-center gap-1"
        >
          &larr; Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
