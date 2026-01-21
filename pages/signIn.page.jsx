import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/auth.context"; 
import { logo } from "../src/assets/index";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const { handleLogin, authLoading, authError, setAuthError } = useAuth();
  useEffect(() => {
    setAuthError("");
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    // Pass navigate so Context can redirect us
    handleLogin(email, password, navigate);
  };

  return (
    <div className="w-full font-bodyFont">
      <div className="w-full bg-gray-100 pb-10 min-h-screen flex flex-col items-center">
        <Link to="/">
          <img className="w-32 py-10 mix-blend-multiply cursor-pointer" src={logo} alt="logo" />
        </Link>

        <div className="w-[350px] border border-zinc-200 p-6 rounded-md bg-white shadow-sm">
            <h2 className="font-titleFont text-3xl font-medium mb-4">Sign in</h2>
            
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Email or mobile phone number</p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full lowercase py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-amazonInput duration-100"
                  type="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Password</p>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full py-1 border border-zinc-400 px-2 text-base rounded-sm outline-none focus-within:border-[#e77600] focus-within:shadow-amazonInput duration-100"
                  type="password"
                />
              </div>
              
              {/* Context Error State */}
              {authError && (
                 <p className="text-red-600 text-xs font-semibold border border-red-500 bg-red-50 p-2 rounded-sm">
                   ! {authError}
                 </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className={`w-full py-1.5 text-sm font-normal rounded-sm bg-gradient-to-t from-[#f7dfa5] to-[#f0c14b] hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-amazonInput cursor-pointer ${authLoading ? 'opacity-50' : ''}`}
              >
                {authLoading ? "Signing In..." : "Continue"}
              </button>
            </form>

            <p className="text-xs text-black leading-4 mt-4">
              By Continuing, you agree to Amazon's <span className="text-blue-600 hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Notice.</span>
            </p>
        </div>
        
        {/* Registration Link ... */}
        <div className="w-[350px] text-xs text-gray-600 mt-4 flex items-center">
             <span className="w-1/3 h-[1px] bg-zinc-400 inline-flex"></span>
             <span className="w-1/3 text-center">New to Amazon?</span>
             <span className="w-1/3 h-[1px] bg-zinc-400 inline-flex"></span>
        </div>
        <Link className="w-[350px]" to="/registration">
            <button className="w-full py-1.5 mt-4 text-sm font-normal rounded-sm bg-gradient-to-t from-slate-200 to-slate-100 hover:bg-gradient-to-b border border-zinc-400 active:border-yellow-800 active:shadow-amazonInput">
              Create your Amazon account
            </button>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;