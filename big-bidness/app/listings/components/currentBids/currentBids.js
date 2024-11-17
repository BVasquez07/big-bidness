import { useState, useEffect } from "react";

export default function CurrentBids(){
    const [bid, setBids] = useState(false);
    const [bidList, setBidList] = useState([]);

    const updateBid = () => {
        setBids(!bid);
    };
    const updateBidList = (event) => {
        bid ? setBidList([...bidList, event.target.value]) : null;
    };

    return(
        <>
            <div>
                <h1>Current Bids: </h1>
                {bidList.map((out) => ` ${out} `)}
            </div>
            <form className="flex items-center max-w-lg mx-auto">   
                <div className="relative w-full">
                    <input  onChange={updateBidList} type="number" id="bid-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the amount you would like to bid..." required />
                </div>
                <button onClick={updateBid} type="submit" className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Bid
                </button>
            </form>
        </>
    );
};

