import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axios from 'axios';

const BiddingSection = ({ product_id, userInfo, is_available }) => {
  const [bids, setBids] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bidInput, setBidInput] = useState("");
  const [token, setToken] = useState('');
  const [selectedBid, setSelectedBid] = useState(null);
  const [dialogType, setDialogType] = useState(null); // null, 'placeBid', or 'acceptBid'

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-product-bid?product_id=${product_id}`);
        const data = await response.json();
        console.log(data.bids)
        if (data.bids && Array.isArray(data.bids)) {
          const formattedBids = data.bids.map(bid => ({
            username: bid.buyername,
            date: new Date(bid.biddeadline).toLocaleString(),
            bidAmount: bid.bidamount,
            bidDeadline: bid.biddeadline,
            bidaccepted: bid.bid_accepted,
            firstname: bid.fisrstname,
            lastname: bid.lastname,
            rating: bid.rating || 0,
          }));
          setBids(formattedBids);
        } else {
          setBids([]);
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    fetchBids();
  }, [product_id]);

  const openDialog = (bid, type) => {
    setSelectedBid(bid);
    setDialogType(type); // 'placeBid' or 'acceptBid'
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedBid(null);
    setDialogType(null);
    setIsDialogOpen(false);
  };

  const handleAcceptBid = async () => {
    if (!selectedBid) return;
    console.log(selectedBid)

    try {
      const response = await fetch('http://localhost:5000/acceptbid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ product_id, bid_id: selectedBid.bidId }),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert(`You have accepted the bid of $${selectedBid.bidAmount}`);
        setBids(bids.filter(bid => bid.bidId !== selectedBid.bidId)); // Remove accepted bid
      }
      closeDialog(); // Close dialog after accepting the bid
    } catch (err) {
      console.error('Error accepting bid:', err);
      alert('There was an error accepting the bid');
    }
  };

  const handleBidChange = (e) => {
    setBidInput(e.target.value);
  };

  const handleSubmitBid = async () => {
    if (!is_available) {
      alert("This item is no longer available for bidding.");
      return;
    }

    const highestBid = bids.length > 0 ? Math.max(...bids.map(bid => bid.bidAmount)) : 0;
    if (bidInput <= highestBid) {
      alert(`Your bid must be higher than the current highest bid of $${highestBid}.`);
    } else if (bidInput > 0) {
      const fullName = `${userInfo.firstname} ${userInfo.lastname} (${userInfo.username})`;
      const bidderRating = userInfo.rating;

      const newBid = {
        product_id: product_id,
        bidamount: bidInput,
        biddeadline: new Date().toISOString(),
        bidderName: fullName,
        bidderRating: bidderRating,
      };

      const formattedBidDeadline = new Date().toISOString().replace('T', ' ').slice(0, 19);
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

        if (data.message === 'Bid posted successfully') {
          alert(`Bid of $${bidInput} posted successfully!`);

          const newFormattedDate = new Date().toLocaleString();
          setBids([{
            username: userInfo.username,
            date: newFormattedDate,
            bidAmount: parseInt(bidInput),
            rating: userInfo.rating,
            firstname: userInfo.firstname,
            lastname: userInfo.lastname
          }, ...bids]);

          closeDialog();
        } else {
          console.error('Error placing bid:', data.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    } else {
      alert("Please enter a valid bid amount.");
    }
  };

  const sortedBids = bids ? bids.sort((a, b) => b.bidAmount - a.bidAmount) : [];
  console.log(sortedBids)

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
          <button
            key={index}
            className="w-full p-2 mb-0 text-left border-b border-gray-300 flex justify-between items-center hover:bg-gray-200"
            onClick={() => openDialog(bid, 'acceptBid')} // Opening accept bid dialog
          >
            <div className="flex flex-col items-start">
              <div className="font-semibold">{bid.firstname} {bid.lastname} ({bid.username})</div>
              <div className="flex items-center">
                {renderStars(bid.rating)}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="font-bold">${bid.bidAmount}</div>
              <div className="text-sm text-gray-500">{new Date(bid.date).toLocaleString()}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="sticky bottom-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-500">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              onClick={() => openDialog(null, 'placeBid')} // Opening place bid dialog
              className="w-full py-3 px-5 text-md font-medium text-center text-white bg-black rounded-lg focus:ring-4 focus:ring-black-200 dark:focus:ring-black-900 hover:bg-black-800"
            >
              Place Your Bid
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogType === 'placeBid' ? 'Confirm Your Bid' : 'Accept Bid'}</DialogTitle>
              <DialogDescription>
                {dialogType === 'placeBid' ? 'Please enter the amount you want to bid.' : `Are you sure you want to accept the bid of $${selectedBid?.bidAmount}?`}
              </DialogDescription>
            </DialogHeader>
            {dialogType === 'placeBid' ? (
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
            ) : (
              <div className="mt-4">
                <div className="text-lg">Bid Amount: ${selectedBid?.bidAmount}</div>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button onClick={closeDialog} className="py-2 px-4 text-white bg-gray-500 rounded-md mr-2">
                Cancel
              </button>
              <button
                onClick={dialogType === 'placeBid' ? handleSubmitBid : handleAcceptBid}
                className="py-2 px-4 text-white bg-black rounded-md"
              >
                {dialogType === 'placeBid' ? 'Confirm' : 'Accept'}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default BiddingSection;
