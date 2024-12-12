'use client';

import React, { useState, useEffect } from "react";
import Comments from "@/app/components/Comments";
import BiddingSection from "@/app/components/BiddingSection";
import { set } from "zod";

const ItemPage = ({ params }) => { 
  const [item, setItem] = useState([]);
  const [userid, setUserid] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [bids, setBids] = useState([]);
  const [token, setToken] = useState('');
  const { id: product_id } = React.use(params);
  const [isSeller, setIsSeller] = useState(false);

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
        console.log(data)
        setUserid(data['user']['userid'])
        setUserInfo(data['user'])
    }
    if (token) {
        getUserInfo()
    }
  }, [token]);

  useEffect(() => {
    const getProductInfo = () => {
      fetch("http://localhost:5000/get-specific-product?product_id=" + product_id, { method: "GET" })
        .then(info => info.json())
        .then((res) => {
          if (res.error === "Failed to find product") {
            setData([]);
          } else {
            console.log(res)
            setItem(res['product'][0]);
          }
        })
        .catch((error) => console.log(error));
    }
    if (product_id) {
      console.log(product_id)
      getProductInfo();
    }
  }, []);

  useEffect(() => {
    if (userid && item && item.sellerid) {
      if (userid === item.sellerid) {
        console.log('User is the seller');
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    }
  }, [userid, item]);


  useEffect(() => {
    const getBids = () => {
      fetch("http://localhost:5000/get-product-bid?product_id=" + product_id, { method: "GET" })
        .then(info => info.json())
        .then((res) => {
          if (res.error === "Failed to find product") {
            setData([]);
          } else {
            console.log(res)
            setBids(res['bids']);
          }
        })
        .catch((error) => console.log(error));
    }
    if (product_id) {
      console.log(product_id)
      getBids();
    }
  }, []);

  if (!item) return <div>Item not found</div>;


  const handleAcceptBid = async (bid) => {
    try {
      const response = await fetch('http://localhost:5000/acceptbid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          bidid: bid.bidid,
        }),
      });

      const data = await response.json();
      console.log(data);

    } catch (error) {
      console.error('Error during fetch:', error);
      alert('An error occurred while accepting the bid. Please try again.');
    }
  };


  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-300' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      );
    }
    return stars;
  };
  
  return (
    <div className="flex justify-center p-6 px-8">
      <div className="w-full max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">{item.product_name}</h1>
        <p className="text-xl text-gray-700 mb-4">Price: ${item.price}</p>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center h-[555px]">
            <img
              src={item.imageurl}
              alt={item.product_name}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
  
          <div className="flex flex-col justify-start">
            <div className="bg-white dark:bg-gray-900 relative border border-gray-500 h-[555px] flex flex-col">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white p-4 border-b border-gray-500 sticky top-0 bg-white dark:bg-gray-900 z-10">
                Current Bids
              </h2>
              {!isSeller && (
                <div>
                  <div className="overflow-y-auto flex-grow p-0 h-[405px]">
                    {bids && bids.map((bid, index) => (
                      <div
                        key={index} 
                        className="w-full p-2 mb-0 text-left border-b border-gray-300 flex justify-between items-center hover:bg-gray-200"
                      >
                        <div className="flex flex-col items-start">
                          <div className="font-semibold">{bid.buyername}</div>
                          <div className="flex items-center">
                            {renderStars(bid.buyer_rating)}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="font-bold">${bid.bidamount}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(bid.biddeadline).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <BiddingSection
                    product_id={item.product_id}
                    setBids={setBids}
                    bids={bids}
                    userInfo={userInfo}
                  />
                </div>
              )} 
              {isSeller && (
                <div className="overflow-y-auto flex-grow p-0">
                  {bids && bids.map((bid, index) => (
                    <div
                      key={index}
                      className="w-full p-2 mb-0 text-left border-b border-gray-300 flex justify-between items-center hover:bg-gray-200"
                    >

                      <div className="flex flex-col items-start">
                        <div className="font-semibold">{bid.buyername}</div>
                        <div className="flex items-center">
                          {renderStars(bid.buyer_rating)}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="font-bold">${bid.bidamount}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(bid.biddeadline).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAcceptBid(bid)} 
                        className="py-2 px-4 ml-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
  
        <div className="mt-6">
          <Comments product_id={item.product_id} userInfo={userInfo}/>
        </div>
      </div>
    </div>
  );  
};

export default ItemPage;
