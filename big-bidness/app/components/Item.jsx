import React from 'react'

export const Item = ({data}) => {
  return (
    <div className='w-11/12 block border-black border-2'>
      <div className='justify-items-center pt-2'>
        <img className='w-full px-2 h-full'
          src={data.image}
          alt="Image" />
      </div>
      <div>
        <h1>
          {data.name}
        </h1>
        <p>
          {data.price}
        </p>
      </div>
      <div>
        <button>
          Buy Now
        </button>
      </div>
    </div>
  )
}
