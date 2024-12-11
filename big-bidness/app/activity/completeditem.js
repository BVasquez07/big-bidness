'use client';
import React from 'react';
import { Rate } from './rate';
import { useState } from 'react';
import { Star } from 'lucide-react';

export const CompletedItem = ({ data, raterType }) => {
  const [rated, setRated] = useState(data.rating_posted);
  const product_id = data.product[0].product_id;
  const backendData = {
    ratedID: data.ratedid,
    raterType: raterType,
    buyID: data.buyid,
    productID: product_id,
    userID: data.userid,
  }

  return (
    <>
      <div className="border rounded-lg shadow-sm p-4 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
          <img
            className="rounded-full object-cover w-full h-full"
            src={data.product[0].imageurl || '/placeholder-image.jpg'}
            alt={data.product[0].product_name || 'Product'}
          />
        </div>
        <div>
          <h1 className="text-lg font-medium">
            {data.product[0].product_name}
          </h1>
          <p className="text-xl font-semibold mt-2 mb-4">${data.price}</p>
          {rated ? (
            <div className="flex justify-center items-center border bg-gray-500 text-white py-1 px-3 rounded-md">
              <Star size={16} fill="gold" stroke="gold" />
              <p className="pl-2">Rated</p>
            </div>
          ) : (
            <div className="flex justify-center items-center border bg-black text-white py-1 px-3 rounded-md">
              <Star size={16} />
              <Rate setRated={setRated} sendData={backendData} showSellerName={data.ratedname}/>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
