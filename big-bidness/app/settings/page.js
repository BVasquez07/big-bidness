'use client'
import React from 'react'
import { useState } from 'react';
import { Star } from 'lucide-react'

const UserInfo = {
        name: 'John Doe',
        rating: 5,
        role: 'User',
    }

export default function settings() {
  return (
    <>
        <div className='px-4 text-4xl pb-8 font-bold pt-4'>
            <h1>
                Settings
            </h1>
        </div>
        <div className='px-8'>  
            <div className='border shadow rounded-md px-9 py-6'>
                <h1 className='pb-2 font-semibold text-xl'>Profile Information</h1>
                <h2><bold className="font-semibold">Name:</bold> {UserInfo.name}</h2>
                <div>
                    <bold className="font-semibold pr-2">Rating:</bold>
                    {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={12}
                        fill={(UserInfo.rating) >= star ? "gold" : "none"}
                        stroke={(UserInfo.rating) >= star ? "gold" : "currentColor"}
                        className='inline-block'
                    />
                    ))}
                </div>
                <h1><bold className="font-semibold">Role:</bold> {UserInfo.role}</h1>
            </div> 
            <div>
                Financial
            </div>
            <div>
                Leave System
            </div>   
        </div>
    </>
  )
}
