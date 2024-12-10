'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Adjust import if needed

const BiddingSection = ({ product_id, userInfo, is_available }) => {
  const [bids, setBids] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bidInput, setBidInput] = useState("");
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    // Fetch existing bids when component mounts
    const fetchBids = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getallbids?product_id=${product_id}`);
        const data = await response.json();
        console.log(data.products);
  
        // Check if the fetched data contains bids and is an array
        if (Array.isArray(data.products) && data.products.length > 0) {
          // Format the bids as needed (e.g., format dates or process data)
          const formattedBids = data.products.map(bid => {
            // Use biddeadline for the formatted date
            const readableDate = new Date(bid.biddeadline).toLocaleString();  // Format the date
            return {
              ...bid,
              formattedDate: readableDate,  // Add formatted date
            };
          });
          console.log(formattedBids);
          setBids(formattedBids); // Update state with formatted bids
        } else {
          setBids([]); // If no bids, set an empty array
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };
  
    fetchBids();
  }, [product_id]);
  
  

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleBidChange = (e) => {
    setBidInput(e.target.value);
  };

  const handleSubmitBid = async () => {
    if (!is_available) {
      alert("This item is no longer available for bidding.");
      return; // Stop execution if the item is unavailable
    }
    
    const highestBid = bids.length > 0 ? Math.max(...bids.map(bid => bid.bidAmount)) : 0;
    if (bidInput <= highestBid) {
      alert(`Your bid must be higher than the current highest bid of $${highestBid}.`);
    } else if (bidInput > 0) {
      const newBid = {
        product_id: product_id,
        bidamount: bidInput,
        biddeadline: new Date().toISOString(),
      };
      
      // Format the biddeadline as "%Y-%m-%d %H:%M:%S"
      const formattedBidDeadline = new Date().toISOString().replace('T', ' ').slice(0, 19);
  
      // Update newBid with the formatted date
      newBid.biddeadline = formattedBidDeadline;
  
      try {
        const response = await fetch('http://localhost:5000/postbid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify(newBid),
        });
  
        const data = await response.json();
        console.log('Response Data:', data); // Log the entire response data
  
        if (data.message === 'Bid posted successfully') {
          alert(`Bid of $${bidInput} posted successfully!`);
  
          // Directly update the bids state with the new bid
          const newFormattedDate = new Date().toLocaleString();
          setBids([
            {
              username: `${userInfo.username}`,
              date: newFormattedDate,
              bidAmount: parseInt(bidInput),
              rating: userInfo.rating,
            },
            ...bids,
          ]);
  
          closeDialog();
        } else {
          console.error('Error placing bid:', data.error || 'Unknown error'); // Log a more detailed error message
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    } else {
      alert("Please enter a valid bid amount.");
    }
  };  

  // Sort bids by bidAmount in descending order, but only if there are bids
  const sortedBids = bids ? bids.sort((a, b) => b.bidAmount - a.bidAmount) : [];
  console.log(sortedBids)

  return (
    <section className="bg-white dark:bg-gray-900 relative border border-gray-300 rounded-md shadow-md h-[555px] flex flex-col">
      <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white p-4 border-b border-gray-300 sticky top-0 bg-white dark:bg-gray-900 z-10">
        Current Bids
      </h2>
      <div className="overflow-y-auto flex-grow p-0">
        {sortedBids.map((bid, index) => (
          <div key={index}>
            {/* Display bid details here */}
            <div>{bid.username} - ${bid.bidamount}</div>
            <div>{new Date(bid.formattedDate).toLocaleString()}</div>
          </div>
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
