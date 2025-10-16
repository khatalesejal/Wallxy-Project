'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => router.push('/');
  const handleGallery = () => router.push('/gallery');
  const handleDashboard = () => router.push('/dashboard');
  const isDashboard = pathname === '/dashboard';
  const isGallery = pathname === '/gallery';

  return (
    <nav className="w-full flex justify-between items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg text-white fixed top-0 left-0 z-50">
      <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-md">
        My Catalogs
      </h1>
      <div className="flex gap-4">
        {!isDashboard && (
          <button
            onClick={handleDashboard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/20 border border-white/30 shadow-md hover:bg-white/30 transition-all font-medium cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Dashboard
          </button>
        )}
        {!isGallery && (
          <button
            onClick={handleGallery}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/20 border border-white/30 shadow-md hover:bg-white/30 transition-all font-medium cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Gallery
          </button>
        )}

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/20 border border-white/30 shadow-md hover:bg-white/30 transition-all font-medium cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
