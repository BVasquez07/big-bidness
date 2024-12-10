'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Adjust import if needed

const Bid = ({ username, date, bidAmount, rating }) => {
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, index) => (
          <svg
            key={`full-${index}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-5 h-5 text-yellow-500"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.16 3.24L6.67 12 2 7.76l6.08-.52L10 2l2.92 5.24 6.08.52-4.67 4.24L15.16 18z" />
          </svg>
        ))}
        {halfStar && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-5 h-5 text-yellow-500"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.16 3.24L6.67 12 2 7.76l6.08-.52L10 2l2.92 5.24 6.08.52-4.67 4.24L15.16 18z" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <svg
            key={`empty-${index}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            className="w-5 h-5 text-gray-400"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.16 3.24L6.67 12 2 7.76l6.08-.52L10 2l2.92 5.24 6.08.52-4.67 4.24L15.16 18z" />
          </svg>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <article className="p-6 text-base bg-white dark:bg-gray-900 border border-gray-300 mb-0">
      <div className="flex items-center">
        <div className="flex flex-col flex-grow">
          <div className="flex justify-between mb-2">
            <p className="text-lg text-gray-900 dark:text-white font-bold">{username}</p>
            <p className="text-lg text-gray-900 dark:text-white font-bold">${bidAmount}</p>
          </div>
          <div className="flex justify-between items-end">
            <div>{renderStars()}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <time dateTime={date} title={date}>
                {new Date(date).toLocaleDateString()}
              </time>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

const BiddingSection = ({ product_id, userInfo }) => {
  const [bids, setBids] = useState([
    { username: 'Michael Gough', date: '2022-02-08', bidAmount: 250, rating: 4.5 },
    { username: 'Jese Leos', date: '2022-02-12', bidAmount: 300, rating: 4.0 },
    { username: 'Bonnie Green', date: '2022-03-12', bidAmount: 350, rating: 4.8 },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bidInput, setBidInput] = useState("");


  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleBidChange = (e) => {
    setBidInput(e.target.value);
  };

  const handleSubmitBid = () => {
    const highestBid = Math.max(...bids.map(bid => bid.bidAmount)); // Get the highest current bid
    if (bidInput <= highestBid) {
      alert(`Your bid must be higher than the current highest bid of $${highestBid}.`);
    } else if (bidInput > 0) {
      alert(`Bid of $${bidInput} placed successfully!`);
      setBids([...bids, { username: userInfo.firstname + ' ' + userInfo.lastname, date: new Date().toISOString(), bidAmount: parseInt(bidInput), rating: userInfo.rating }]);
      closeDialog();
    } else {
      alert("Please enter a valid bid amount.");
    }
  };

  // Sort bids by bidAmount in descending order
  const sortedBids = bids.sort((a, b) => b.bidAmount - a.bidAmount);

  return (
    <section className="bg-white dark:bg-gray-900 relative border border-gray-300 rounded-md shadow-md h-[555px] flex flex-col">
  <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white p-4 border-b border-gray-300 sticky top-0 bg-white dark:bg-gray-900 z-10">
    Current Bids
  </h2>
  <div className="overflow-y-auto flex-grow p-0">
    {sortedBids.map((bid, index) => (
      <Bid
        key={index}
        username={bid.username}
        date={bid.date}
        bidAmount={bid.bidAmount}
        rating={bid.rating}
      />
    ))}
  </div>
  <div className="sticky bottom-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-300">
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={openDialog}
          className="w-full py-3 px-5 text-md font-medium text-center text-white bg-black rounded-lg focus:ring-4 focus:ring-black-200 dark:focus:ring-black-900 hover:bg-black-800"
        >
          Place Your Bid
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Your Bid</DialogTitle>
          <DialogDescription>Please enter the amount you want to bid.</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <form>
            <label htmlFor="bidInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter Bid Amount
            </label>
            <input
              type="number"
              id="bidInput"
              value={bidInput}
              onChange={handleBidChange}
              min="1"
              className="mt-2 p-2 w-full border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
              placeholder="Enter your bid"
            />
          </form>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={closeDialog} className="py-2 px-4 text-white bg-gray-500 rounded-md mr-2">
            Cancel
          </button>
          <button onClick={handleSubmitBid} className="py-2 px-4 text-white bg-black rounded-md">
            Confirm
          </button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</section>
  );
};

export default BiddingSection;
