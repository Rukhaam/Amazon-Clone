import React from "react";
import { Link } from "react-router-dom";
import { AuthProvider as useAuth } from "../../src/context/auth.context"; // Ensure path is correct

const FooterTop = () => {
  const { currentUser } = useAuth();

  // If user is logged in, hide this section
  if (currentUser) {
    return null;
  }

  return (
    <div className="w-full bg-white py-6 border-t border-b border-gray-300">
      <div className="w-full py-8">
        <div className="w-64 mx-auto text-center flex flex-col gap-1">
          <p className="text-sm">See Personalised Recommendations</p>
          
          <Link to="/signin">
            <button className="w-full bg-yellow-400 rounded-md py-1 font-semibold cursor-pointer hover:bg-yellow-500 active:bg-yellow-700">
              Sign In
            </button>
          </Link>

          <p className="text-xs mt-1">
            New Customer?{" "}
            <Link to="/registration">
              <span className="text-blue-600 ml-1 cursor-pointer hover:text-orange-600 hover:underline">
                Start Here.
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterTop;