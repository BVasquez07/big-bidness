import React from 'react';

export function BidItem({ data }) {
    const { product_details, bidamount, biddeadline, bid_accepted } = data;
    const isCompleted = bid_accepted;

    return (
        <div className="border rounded-lg shadow-sm p-4 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                <img 
                    src={product_details.imageurl || 'placeholder.png'} 
                    alt={product_details.name} 
                    className="rounded-full object-cover w-full h-full"
                />
            </div>
            <div className="text-lg font-medium">{product_details.product_name}</div>
            <div className="text-xl font-semibold mt-2">Bid: ${bidamount}</div>
            {!isCompleted && (
                <div className="text-gray-500 text-sm mt-1">
                    Expires: {new Date(biddeadline).toLocaleDateString()}
                </div>
            )}
        </div>
    );
}
