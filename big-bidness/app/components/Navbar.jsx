'use client';
import { useState } from 'react';
import Link from 'next/link';

export const Navbar = () => {
  const [isToggle, setIsToggle] = useState(false);

  function toggleNav() {
    setIsToggle(!isToggle);
  }

  return (
    <div className="bg-white">
      <div className="w-full h-16 flex mx-auto px-3 py-4 justify-between items-center shadow-black shadow-lg lg:px-8 border-b border-gray-300">
        <Link href="/" className="text-xl font-bold">
          Big Bidness
        </Link>
        <div className="hidden md:inline-block">
          <div className="space-x-4">
            <Link href="/create-listing" className="text-black bg-gray-100 hover:bg-black hover:text-white rounded-md px-1 py-1">
              Create Listing
            </Link>
            <Link href="/activity" className="text-black hover:bg-black hover:text-white rounded-md px-1 py-1">
              Activity
            </Link>
            <Link href="/settings" className="text-black hover:bg-black hover:text-white rounded-md px-1 py-1">
              Settings
            </Link>
            <Link href="/sign-in" className="text-black bg-neutral-300 border border-slate-500 hover:bg-zinc-800 hover:text-white rounded-md px-3 py-1">
              Sign In
            </Link>
            <Link href="/register" className="text-white bg-zinc-800 border border-slate-500 hover:bg-neutral-300 hover:text-black rounded-md px-2 py-1">
              Register
            </Link>
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
            <Link href="/" className="text-black block bg-zinc-100 hover:bg-black hover:text-white rounded-lg p-2">
              Home
            </Link>
            <Link href="/about-me" className="text-black block hover:bg-black hover:text-white rounded-lg p-2">
              About Me
            </Link>
            <Link href="/experience" className="text-black block bg-zinc-100 hover:bg-black hover:text-white rounded-lg p-2">
              Experience
            </Link>
            <Link href="/contact" className="text-black block bg-zinc-100 hover:bg-black hover:text-white rounded-lg p-2">
              Contact
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
