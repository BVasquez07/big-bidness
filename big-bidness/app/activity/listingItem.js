import React from 'react';

export function ListingItem({ data }) {
    if (!data) {
        return <div className="text-red-500">Invalid listing data</div>;
    }

    const { imageurl = 'placeholder.png', product_name = 'Unknown Product', price = 'N/A' } = data;

    return (
        <div className="border rounded-lg shadow-sm p-4 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                <img 
                    src={imageurl || 'placeholder.png'} 
                    alt={product_name} 
                    className="rounded-full object-cover w-full h-full"
                />
            </div>
            <div className="text-lg font-medium">{product_name}</div>
            <div className="text-xl font-semibold mt-2">Price: ${price}</div>
        </div>
    );
}
