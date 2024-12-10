'use client'
import React, { useState, useEffect} from 'react';
import { Item } from './Item';

export const Listings = ({ searchInput }) => {

  const [data, setData] = useState([]);

  useEffect(() => {
      {
        fetch("http://localhost:5000/query?product_title=" + searchInput, {method: "GET"})
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
      }
  }, [searchInput]);

  // Filter items based on the search input
  if (data && data.length > 0) {
    console.log("Items in Listings:", data);
    data.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, item);
      console.log(`product_name: ${item.product_name}`);
      console.log(`product_id: ${item.product_id}`);
      console.log(`imageurl: ${item.imageurl}`);
      console.log(`is_available: ${item.is_available}`);
    });

    const filteredData = data.filter((item) => 
      item.product_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    const items = filteredData.map((item) => (
      <Item
        key={item.product_id}
        data={{
          product_name: item.product_name,
          product_id: item.product_id,
          imageurl: item.imageurl,
          price: item.price,
        }}
      />
    ));

    return (
      <div className="bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center p-8">
        {items.length > 0 ? items : <p>No items found</p>}
      </div>
  )}
};
