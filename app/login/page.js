'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";


export default function LoginPage() {
   const router = useRouter();
 const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // ✅ use state variables, not DOM nodes
      });
       console.log("🔹 Raw Response:", res);

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed");
      } else {
        // Save token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side */}
      <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-4">Welcome Back 👋</h2>
          <p className="text-lg text-blue-100">
            Sign in to your account and manage your catalogs with ease.
          </p>
          {/* <img
            src="https://undraw.co/api/illustrations/1df32a1a-63f3-4957-9a29-84a9aa185da2" // You can replace this with any valid illustration
            alt="Illustration"
            className="mt-8 w-full max-w-sm"
          /> */}
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
            <p className="text-gray-600">Welcome back! Please login to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
               
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {/* <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link> */}
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                maxLength={8}
                
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
