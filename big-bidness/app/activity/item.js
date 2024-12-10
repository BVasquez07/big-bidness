import React from 'react';

export function Item({ data }) {
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
            {isCompleted && (
                <div className="mt-2">
                    <button className="px-4 py-1 bg-yellow-500 text-white text-sm rounded-lg shadow">
                        {bid_accepted ? 'Rated' : 'Rate'}
                    </button>
                </div>
            )}
        </div>
    );
}
