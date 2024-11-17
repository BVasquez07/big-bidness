import React from 'react';
import { Item } from './Item';

export const Listings = () => {
  const data = [
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
      name: "Item 1",
      price: 100
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
      name: "Item 2",
      price: 200
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
      name: "Item 3",
      price: 200
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
      name: "Item 4",
      price: 200
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
      name: "Item 5",
      price: 200
    }
  ];

  const items = data.map((item) => <Item data={item} key={item.name} />);

  return (
    <div className="bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center p-6">
      {items}
    </div>
  );
};
