'use client'
import React from 'react'
import { Rate } from './rate';
import { useState } from 'react';
import { Star } from 'lucide-react'


export const CompletedListing = ({data}) => {
    const [rated, setRated] = useState(data.rated);
  return (
    <>
        <div className='flex border rounded-lg shadow p-4 w-full'>
            <div className='flex justify-center items-center mr-4'>
                <img className='rounded-full size-24'
                src={data.image}
                alt="Image" />
            </div>
            <div>
                <h1 className='font-semibold text-xl mb-1'>
                {data.name}
                </h1>
                <p className='text-lg mb-1'>
                ${data.price}
                </p>
                { data.completed && !rated ? 
                    <div className='flex justify-center items-center border bg-black text-white py-1 px-3 rounded-md'>
                        <Star size={16}  />
                        <Rate setRated={setRated} />
                    </div> : '' }
                { data.completed && rated ? 
                    <div className='flex justify-center items-center border bg-gray-500 text-white py-1 px-3 rounded-md'>
                        <Star size={16} fill="gold" stroke="gold" />
                        <p className='pl-2'>Rated</p>
                    </div> : '' }
                { data.expiry && !data.completed ? <p className="text-lg text-gray-500"> Expires: {data.expiry}</p> : '' }
            </div>
        </div>
    </>
  )
}