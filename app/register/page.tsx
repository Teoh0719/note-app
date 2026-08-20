"use client";

import { useState } from "react";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect to dashboard on success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100 p-6">
      
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 relative overflow-hidden">
        
        {/* Subtle background decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Create an Account
          </h2>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-600 ml-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-300"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-600 ml-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="relative group w-full bg-blue-600 text-white font-semibold p-3 rounded-xl transition-colors mt-2"
            >
              Register
              {/* Expanding Outer Ring Animation */}
              <span className="absolute inset-0 rounded-xl ring-0 ring-blue-500 opacity-0 group-hover:ring-4 group-hover:ring-offset-2 group-hover:opacity-50 transition-all duration-300 ease-out pointer-events-none"></span>
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}