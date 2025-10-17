'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';;

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.name,
        email: formData.email,
        password: formData.password
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Something went wrong');
      return;
    }

    // Success
    alert('Account created successfully!');
     router.push('/dashboard');
    
  } catch (err) {
    console.error('Signup error:', err);
    alert('Server error');
  }
};


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side (Brand/Illustration) */}
      <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-indigo-500 to-blue-600 text-white items-center justify-center p-12">
        <div className="max-w-md text-center">
          <h2 className="text-4xl font-bold mb-4">Join Us Today 🎉</h2>
          <p className="text-blue-100 text-lg">
            Create your account and start building your catalogs with ease.
          </p>
          {/* <img
            src="https://undraw.co/api/illustrations/1df32a1a-63f3-4957-9a29-84a9aa185da2"
            alt="Signup illustration"
            className="mt-10 w-full max-w-xs mx-auto"
          /> */}
        </div>
      </div>

      {/* Right Side (Signup Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Create Account</h1>
            <p className="text-gray-600">Join us and get started right away</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                placeholder="Enter username"
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                
              />
            </div>

         
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                placeholder="Enter email"
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                
              />
            </div>

           
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                placeholder="Enter password"
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                maxLength={8}
                
              />
            </div>

            {/* Confirm Password */}
            {/* <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                minLength={6}
                required
              />
            </div> */}

           
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              Create Account
            </button>
          </form>

         
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/" className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
