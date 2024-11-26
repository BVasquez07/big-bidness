import React from "react";
import Comments from "@/app/components/Comments";
import BiddingSection from "@/app/components/BiddingSection";

// Dummy data for illustration
const data = [
  {
    id: 1,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
    name: "Item 1",
    price: 100,
  },
  {
    id: 2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
    name: "Item 2",
    price: 200,
  },
  {
    id: 3,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
    name: "Item 3",
    price: 200,
  },
  {
    id: 4,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
    name: "Item 4",
    price: 200,
  },
  {
    id: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s",
    name: "Item 5",
    price: 200,
  },
];

const getItemById = (id) => {
  return data.find((item) => item.id === parseInt(id));
};

const ItemPage = ({ params }) => {
  const { id } = params;

  if (!id) return <div>Loading...</div>;

  // Fetch the item based on the ID (on the server side)
  const item = getItemById(id);

  if (!item) return <div>Item not found</div>;

  return (
    <div className="flex justify-center p-6 px-8">
      {/* Aligns the grid and comments within a centered container */}
      <div className="w-full max-w-7xl">
        {/* Item Name - Positioned above the grid */}
        <h1 className="text-2xl font-bold mb-4">{item.name}</h1>

        {/* Grid for Image and Bidding Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side: Item Image */}
          <div className="flex justify-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          {/* Right side: Bidding Section */}
          <div className="flex flex-col justify-start">
            <div className="p-4 border rounded-lg mb-6">
              <BiddingSection />
            </div>
          </div>
        </div>

        {/* Comment Section (full-width, below the grid) */}
        <div className="mt-6">
          <Comments />
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
