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
    const fetchBids = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-product-bid?product_id=${product_id}`);
        const data = await response.json();
  
        if (data.bids && Array.isArray(data.bids)) {
          // Map backend data to the frontend format
          const formattedBids = data.bids.map(bid => ({
            username: bid.buyername, // Map 'buyername' to 'username'
            date: new Date(bid.biddeadline).toLocaleString(), // Format the deadline
            bidAmount: bid.bidamount, // Use 'bidamount' directly
            bidDeadline: bid.biddeadline,
            bidaccepted: bid.bid_accepted,
            firstname: bid.fisrstname,
            lastname: bid.lastname,
            rating: bid.rating, // Use userInfo if available
          }));
          // console.log(formattedBids); 
          setBids(formattedBids); // Update the bids state
        } else {
          setBids([]); // If no bids, clear the state
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };
  
    fetchBids();
  }, [product_id]); // Explicitly include all dependencies  

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
        const fullName = `${userInfo.firstname} ${userInfo.lastname} (${userInfo.username})`;  // Create the formatted name
        const bidderRating = userInfo.rating;  // Get bidder's rating

        const newBid = {
            product_id: product_id,
            bidamount: bidInput,
            biddeadline: new Date().toISOString(),
            bidderName: fullName,  // Include formatted full name in the bid object
            bidderRating: bidderRating,  // Include bidder's rating in the bid object
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
                        username: userInfo.username,
                        date: newFormattedDate,
                        bidAmount: parseInt(bidInput),
                        rating: userInfo.rating,
                        firstname: userInfo.firstname,
                        lastname: userInfo.lastname
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

  // Function to render the star rating based on the bid rating
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
    <section className="bg-white dark:bg-gray-900 relative border border-gray-500 h-[555px] flex flex-col">
      <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white p-4 border-b border-gray-500 sticky top-0 bg-white dark:bg-gray-900 z-10">
        Current Bids
      </h2>
      <div className="overflow-y-auto flex-grow p-0">
        {sortedBids.map((bid, index) => (
          <div
            key={index}
            className="border-b border-gray-300 p-2 mb-0 flex justify-between items-center"
          >
            {/* Left side: Name and Rating */}
            <div className="flex flex-col items-start">
              <div className="font-semibold">{bid.firstname} {bid.lastname} ({bid.username})</div>
              <div className="flex items-center">
                {renderStars(bid.rating)} {/* Display star rating */}
              </div>
            </div>

            {/* Right side: Price and Date */}
            <div className="flex flex-col items-end">
              <div className="font-bold">${bid.bidAmount}</div>
              <div className="text-sm text-gray-500">
                {new Date(bid.date).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-500">
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
