'use client'
import React, { useState, useEffect} from 'react';
import { Item } from './Item';

export const Listings = ({ searchInput }) => {
  
  const [data, setData] = useState([]);
  let emptyInput;
  
  useEffect(() => {
    setTimeout(() => 
    {
    if (searchInput.trim() !== '')
      {
        fetch("http://localhost:8080/query?product_title=" + searchInput)
        .then(info => info.json())
        .then((res) => {setData(res);})
        .catch((error) => console.log(error));
      } 
      else {
        setData([]);
      }
    }, 500);
  }, [searchInput]);

  const test = [
    {
      id: 1,
      image: "https://www.pexels.com/photo/black-fujifilm-dslr-camera-90946/",
      name: "Item 1",
      price: 100
    },
    {
      id: 2,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
      name: "Item 2",
      price: 200
    },
    {
      id: 3,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
      name: "Item 3",
      price: 200
    },
    {
      id: 4,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
      name: "Item 4",
      price: 200
    },
    {
      id: 5,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
      name: "Item 5",
      price: 200
    }
  ];

  // Filter items based on the search input
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const items = filteredData.map((item) => <Item data={item} key={item.name} />);

  return (
    <div className="bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center p-6">
      {items.length > 0 ? items : <p>No items found</p>}
    </div>
  );
};
