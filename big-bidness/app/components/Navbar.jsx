'use client'
import { useState, React } from 'react';


export const Navbar = () => {
    const [isToggle, setIsToggle] = useState(false);
    function toggleNav() {
        setIsToggle(!isToggle)
    }

    return (
    <div className='bg-white'>
            {/* Make navbar full width by using w-full */}
            <div className='w-full h-16 flex mx-auto px-3 justify-between items-center shadow-black shadow-lg lg:px-8'>
                <a href="/">Big Bidness</a>
                <div className="hidden md:inline-block">
                    <div className="space-x-4">
                        <a href="/" className="text-black bg-gray-100 hover:bg-black hover:text-white rounded-md px-1 py-1">Create Listing</a>
                        <a href="/" className="text-black hover:bg-black hover:text-white rounded-md px-1 py-1">Activity</a>
                        <a href="/" className="text-black hover:bg-black hover:text-white rounded-md px-1 py-1 ">Settings</a>
                        <a href="/" className="text-black bg-neutral-300 border border-slate-500 hover:bg-zinc-800 hover:text-white rounded-md px-3 py-1">Sign In</a>
                        <a href="/" className="text-white bg-zinc-800 border border-slate-500 hover:bg-neutral-300 hover:text-black rounded-md px-2 py-1">Register</a>
                    </div>
                </div>
                <div className='md:hidden flex items-center'>
                    <button className='p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset'
                    onClick={toggleNav}>
                    {isToggle ? <p className="text-black"> X </p> : <p className="text-black">Menu</p>}
                    </button>
                </div>
            </div>
            {isToggle && (
                <div className='md:hidden'>
                    <div className="space-y-1 px-2 pb-3">
                        <a href="/" className="text-black block bg-zinc-100 hover:bg-black hover:text-white rounded-lg p-2">Home</a>
                        <a href="/" className="text-black block hover:bg-black hover:text-white  rounded-lg p-2">About Me</a>
                        <a href="/" className="text-black block bg-zinc-100  hover:bg-black hover:text-white rounded-lg p-2 ">Experience</a>
                        <a href="/" className="text-black block bg-zinc-100 hover:bg-black hover:text-white  rounded-lg p-2">Contact</a>
                    </div>
                </div>
            )}
    </div>
  )
}