import React from 'react'
import { Item } from './item';

const bids = [{
    name: 'Item 1',
    price: 100,
    image: 'https://via.placeholder.com/150',
    expiry: '10/10/2021',
    rated: true,
    completed: true
}, {
    name: 'Item 2',
    price: 200,
    image: 'https://via.placeholder.com/150',
    expiry: '10/10/2021',
    rated: false,
    completed: false
}, {
    name: 'Item 3',
    price: 300,
    image: 'https://via.placeholder.com/150',
    expiry: '10/10/2021',
    rated: false,
    completed: true
}];

const listings = [{
    name: 'Item 1',
    price: 100,
    image: 'https://via.placeholder.com/150',
    rated: true,
    completed: true
}, {
    name: 'Item 2',
    price: 200,
    image: 'https://via.placeholder.com/150',
    rated: false,
    completed: false
}, {
    name: 'Item 3',
    price: 300,
    image: 'https://via.placeholder.com/150',
    rated: false,
    completed: true
}];

export default function activity() {


    const mapFunction = (data) => {
        return data.map((item) => <Item data={item} key={item.name} />);
    }
    const activeBids = mapFunction(bids.filter(bid => !bid.completed));
    const completedBids = mapFunction(bids.filter(bid => bid.completed));
    const activeListings = mapFunction(listings.filter(listing => !listing.completed));
    const completedListings = mapFunction(listings.filter(listing => listing.completed));

  return (
    <div>
        <h1 className='pl-4 text-4xl pb-2 font-bold'>Activity</h1>
        <div>
            <div className='pl-4 text-2xl font-semibold'>Active Bids</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-6 p-4'>
                {activeBids}
            </div>
        </div>
        <div>
            <div className='pl-4 text-2xl font-semibold'>Active Listings</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-6 p-4'>
                {activeListings}
            </div>
        </div>
        <div>
            <div className='pl-4 text-2xl font-semibold'>Completed Bids</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-6 p-4'>
                {completedBids}
            </div>
        </div>
        <div>
            <div className='pl-4 text-2xl font-semibold'>Completed Listings</div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-6 p-4'>
                {completedListings}
            </div>
        </div>
    </div>
  )
}
