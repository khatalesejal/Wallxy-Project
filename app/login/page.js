'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { useLoginUserMutation } from '../services/api';

export default function LoginPage() {
  const router = useRouter();
  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isError && error) {
      const errorMessage = error.data?.error || "Invalid email or password";
      setErrors(prev => ({ ...prev, backend: errorMessage }));
    }
  }, [isError, error]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length !== 8) {
      newErrors.password = "Password must be exactly 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await loginUser(formData).unwrap();
      if (result?.token) {
        localStorage.setItem("token", result.token);
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
        }
        router.push("/dashboard");
      }
    } catch (err) {
      console.error('Login error:', err);
      // Error is handled by the useEffect
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Left side */}
      <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-4">Welcome Back 👋</h2>
          <p className="text-lg text-blue-100">
            Sign in to your account and manage your catalogs with ease.
          </p>
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
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition outline-none ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 transition outline-none ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                maxLength={8}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              {errors.backend && <p className="text-red-500 text-sm mt-2">{errors.backend}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
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