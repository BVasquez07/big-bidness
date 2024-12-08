'use client'
import React, { useState, useEffect} from 'react';
import { Item } from './Item';

export const Listings = ({ searchInput }) => {

  const [data, setData] = useState([]);

  useEffect(() => {
      {
        fetch("http://localhost:8080/query?product_title=" + searchInput, {method: "GET"})
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

    const filteredData = data.filter((item) => 
      item.product_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    const items = filteredData.map((item, index) => <Item data={item} key={index} />);

    return (
      <div className="bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center p-8">
        {items.length > 0 ? items : <p>No items found</p>}
      </div>
  )}
};
