import React from 'react'
import { Rate } from './rate';

export const Item = ({data}) => {
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
                { data.completed && !data.rated ? <Rate/> : '' }
                { data.expiry && !data.completed ? <p className="text-lg text-gray-500"> Expires: {data.expiry}</p> : '' }
            </div>
        </div>
    </>
  )
}
