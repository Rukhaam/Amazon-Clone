import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/auth.context"; 
import { logo } from "../src/assets/index";

const Registration = () => {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const navigate = useNavigate();
  // Grab master handler from Context
  const { handleRegister, authLoading, authError, setAuthError } = useAuth();

  useEffect(() => {
    setAuthError("");
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    // Pass everything + navigate to context
    handleRegister(email, password, cPassword, clientName, navigate);
  };

  return (
    <div className="w-full font-bodyFont">
      <div className="w-full bg-gray-100 pb-10 min-h-screen flex flex-col items-center">
         <Link to="/">
          <img className="w-32 py-10 mix-blend-multiply cursor-pointer" src={logo} alt="logo" />
        </Link>
        <div className="w-[350px] border border-zinc-200 p-6 rounded-md bg-white shadow-sm">
            <h2 className="font-titleFont text-3xl font-medium mb-4">Create Account</h2>
            
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                 <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Your name</p>
                    <input onChange={(e) => setClientName(e.target.value)} value={clientName} className="w-full py-1 border border-zinc-400 px-2" type="text" />
                 </div>
                 <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className="w-full py-1 border border-zinc-400 px-2" type="email" />
                 </div>
                 <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className="w-full py-1 border border-zinc-400 px-2" type="password" />
                 </div>
                 <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">Re-enter Password</p>
                    <input onChange={(e) => setCPassword(e.target.value)} value={cPassword} className="w-full py-1 border border-zinc-400 px-2" type="password" />
                 </div>

                 {authError && <p className="text-red-600 text-xs font-semibold">{authError}</p>}
                 
                 <button disabled={authLoading} className="w-full py-1.5 text-sm font-normal rounded-sm bg-gradient-to-t from-[#f7dfa5] to-[#f0c14b] border border-zinc-400 cursor-pointer">
                    {authLoading ? "Creating..." : "Continue"}
                 </button>
            </form>

             <p className="text-xs text-black leading-4 mt-4">
              Already have an account? <Link to="/signin"><span className="text-blue-600 hover:underline">Sign in</span></Link>
            </p>
        </div>
      </div>
    </div>
  )
};

export default Registration;