'use client';

import React, { useState, useEffect } from "react";
import Comments from "@/app/components/Comments";
import BiddingSection from "@/app/components/BiddingSection";

const ItemPage = () => { // Destructure searchInput from props
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/query?product_title=", { method: "GET" })
      .then(info => info.json())
      .then((res) => {
        if (res.error === "Failed to find product") {
          setData([]);
        } else {
          console.log(res);
          setData(res['products']);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  console.log("Items in Listings:", data);
    data.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, item);
      console.log(`product_name: ${item.product_name}`);
      console.log(`product_id: ${item.product_id}`);
      console.log(`imageurl: ${item.imageurl}`);
      console.log(`is_available: ${item.is_available}`);});

  // Get the item based on the ID (assuming you are fetching the correct item)
  const item = data.length > 0 ? data[0] : null;

  if (!item) return <div>Item not found</div>;

  return (
    <div className="flex justify-center p-6 px-8">
      {/* Aligns the grid and comments within a centered container */}
      <div className="w-full max-w-7xl">
        {/* Item Name - Positioned above the grid */}
        <h1 className="text-2xl font-bold mb-4">{item.product_name}</h1>

        {/* Grid for Image and Bidding Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side: Item Image */}
          <div className="flex justify-center h-[555px]">
            <img
              src={item.imageurl} // Ensure the correct image is displayed
              alt={item.product_name}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          {/* Right side: Bidding Section */}
          <div className="flex flex-col justify-start">
            <div className="p-0 border rounded-lg mb-0 h-[555px]">
              <BiddingSection product_id={item.product_id}/>
            </div>
          </div>
        </div>

        {/* Comment Section (full-width, below the grid) */}
        <div className="mt-6">
          <Comments product_id={item.product_id}/>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
