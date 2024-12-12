'use client';

import React, { useState, useEffect } from "react";
import Comments from "@/app/components/Comments";
import BiddingSection from "@/app/components/BiddingSection";

const ItemPage = ({ params }) => { 
  const [data, setData] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [token, setToken] = useState('');
  const { id: product_id } = React.use(params);

  const [isVip, setIsVip] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
        const userinfo = await fetch('http://localhost:5000/personalinfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            }
        })
        const data = await userinfo.json()
        setUserInfo(data['user'])
    }
    if (token) {
        getUserInfo()
    }
  }, [token]);

  useEffect(() => {
    fetch("http://localhost:5000/query?product_title=", { method: "GET" })
      .then(info => info.json())
      .then((res) => {
        if (res.error === "Failed to find product") {
          setData([]);
        } else {
          setData(res['products']);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Get the item based on the ID (assuming you are fetching the correct item)
  const item = data.find((product) => String(product.product_id) === String(product_id));
  // console.log(item)

  if (!item) return <div>Item not found</div>;

  return (
    <div className="flex justify-center p-6 px-8">
      {/* Aligns the grid and comments within a centered container */}
      <div className="w-full max-w-7xl">
        {/* Item Name - Positioned above the grid */}
        <h1 className="text-2xl font-bold mb-4">{item.product_name}</h1>
        <p className="text-xl text-gray-700 mb-4">Price: ${item.price}</p>

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
              <BiddingSection product_id={item.product_id} userInfo={userInfo} is_available={item.is_available}/>
            </div>
          </div>
        </div>

        {/* Comment Section (full-width, below the grid) */}
        <div className="mt-6">
          <Comments product_id={item.product_id} userInfo={userInfo}/>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
