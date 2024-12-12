import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const BiddingSection = ({ product_id, setBids, userInfo, bids, isVip }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bidInput, setBidInput] = useState("");
  const [token, setToken] = useState('');
  const [bidDeadline, setBidDeadline] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken || '');
  }, []);

  const handleBidDeadlineChange = (e) => {
    setBidDeadline(e.target.value);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setBidInput("");
    setBidDeadline("");
  };

  const handleBidChange = (e) => {
    setBidInput(e.target.value);
  };

  const convertToDesiredFormat = (input) => {
    const date = new Date(input);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmitBid = async () => {
    if (!bidInput || !bidDeadline) {
      alert("Please enter both bid amount and deadline.");
      return;
    }

    let formattedDeadline;
    try {
      formattedDeadline = convertToDesiredFormat(bidDeadline);
    } catch (error) {
      alert("Invalid date format. Please enter a valid date and time.");
      return;
    }

    let bidPriceVal = parseFloat(bidInput)
    if (isVip) {
      bidPriceVal = bidPriceVal * 0.9
    }

    const newBid = {
      product_id: product_id,
      bidamount: bidPriceVal,
      biddeadline: formattedDeadline,
    };

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
      console.log(data);

      if (data.message === 'Bid posted successfully') {
        alert(`Bid of $${bidPriceVal} posted successfully!`);
        setBids([
          {
            bidamount: bidPriceVal,
            biddeadline: formattedDeadline,
            buyer_rating: userInfo.rating,
            buyername: userInfo.username,
          },
          ...bids
        ]);

        setTimeout(() => {
          setSuccess(true);
          window.location.href = "/";
        }, 2000);

        closeDialog();
      } else {
        console.error('Error placing bid:', data.error || 'Unknown error');
        alert(data.error || 'Error placing bid.');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert('An error occurred while placing your bid. Please try again.');
    }
  };

  return (
      <div className="relative bottom-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-500">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              onClick={openDialog}
              className="w-full py-3 px-5 text-md font-medium text-center text-white bg-black rounded-lg focus:ring-4 focus:ring-black-200 dark:focus:ring-black-900 hover:bg-black-800 transition-colors"
            >
              Place Your Bid
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Place Bid</DialogTitle>
              <DialogDescription>
                Please enter the amount you want to bid and the bid deadline.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <form>
                {/* Bid Amount Input */}
                <div className="mb-4">
                  <label
                    htmlFor="bidInput"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Enter Bid Amount ($)
                  </label>
                  <input
                    type="number"
                    id="bidInput"
                    value={bidInput}
                    onChange={handleBidChange}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 100"
                    required
                  />
                </div>

                {/* Bid Deadline Input */}
                <div className="mb-4">
                  <label
                    htmlFor="bidDeadline"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Enter Bid Deadline
                  </label>
                  <input
                    type="datetime-local"
                    id="bidDeadline"
                    value={bidDeadline}
                    onChange={handleBidDeadlineChange}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </form>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeDialog}
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitBid}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit Bid
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default BiddingSection;
