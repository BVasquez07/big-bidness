'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export const Navbar = () => {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [isToggle, setIsToggle] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
  }, []);

  function toggleNav() {
    setIsToggle(!isToggle);
  }

  return (
    <div className="bg-white">
      <div className="w-full h-16 flex mx-auto px-3 py-4 justify-between items-center lg:px-8 border-b border-gray-300">
        <Link href="/" className="text-xl font-bold">
          Big Bidness
        </Link>
        <div className="hidden md:inline-block">
          <div className="space-x-4">
            {token ? (
              <>
                <Link href="/create-listing" className="text-black bg-gray-100 hover:bg-black hover:text-white rounded-md px-1 py-1">
                  Create Listing
                </Link>
                <Link href="/activity" className="text-black hover:bg-black hover:text-white rounded-md px-1 py-1">
                  Activity
                </Link>
                {(role === 'Admin') && (<Link href="/admin-portal" className="text-black hover:bg-black hover:text-white rounded-md px-1 py-1">
                  Admin Portal
                </Link>)}
                <Link href="/settings" className="text-black hover:bg-black hover:text-white rounded-md px-1 py-1">
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-black bg-neutral-300 border border-slate-500 hover:bg-zinc-800 hover:text-white rounded-md px-3 py-1">
                  Sign In
                </Link>
                <Link href="/auth/register" className="text-white bg-zinc-800 border border-slate-500 hover:bg-neutral-300 hover:text-black rounded-md px-2 py-1">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="md:hidden flex items-center">
          <button
            className="p-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-inset"
            onClick={toggleNav}
          >
            {isToggle ? 'X' : 'Menu'}
          </button>
        </div>
      </div>
      {isToggle && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3">
            {token ? (
              <>
                <Link href="/create-listing" className="text-black block bg-zinc-100 hover:bg-black hover:text-white rounded-lg p-2">
                  Create Listing
                </Link>
                <Link href="/activity" className="text-black block bg-zinc-100 hover:bg-black hover:text-white rounded-lg p-2">
                  Activity
                </Link>
                {(role === 'Admin') && (<Link href="/admin-portal" className="text-black block bg-zinc-100 hover:bg-black hover:text-white rounded-lg p-2">
                  Admin Portal
                </Link>)}
                <Link href="/settings" className="text-black block bg-zinc-100 hover:bg-black hover:text-white rounded-lg p-2">
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-black block bg-zinc-100 hover:bg-black hover:text-white rounded-lg p-2">
                  Sign In
                </Link>
                <Link href="/auth/register" className="text-black block bg-zinc-100 hover:bg-black hover:text-white rounded-lg p-2">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
