'use client';
import React, { useEffect, useState } from 'react';
import { BidItem } from './biditem';
import { ListingItem } from './listingItem';

export default function Activity() {
    const [activeBids, setActiveBids] = useState([]);
    const [completedBids, setCompletedBids] = useState([]);
    const [activeListings, setActiveListings] = useState([]);
    const [token, setToken] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
        }
    });


    useEffect(() => {
        function fetchBids() {
            fetch('http://localhost:8080/getuserbidproduct', {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.bids) {
                        const validBids = data.bids.filter(bid => {
                            const isExpired = new Date(bid.biddeadline) < new Date();
                            const isAvailable = bid.product_details.is_available;
                            return !isExpired && (bid.bid_accepted || isAvailable);
                        });
                        setActiveBids(validBids.filter(bid => !bid.bid_accepted));
                    } else {
                        console.log('No bids found in the response');
                    }
                })
                .catch(error => console.error('Error fetching bids:', error));
        }
        function fetchListings() {
            fetch('http://localhost:8080/user-current-products', {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.products) {
                        setActiveListings(data.products);
                    } else {
                        console.log('No bids found in the response');
                    }
                })
                .catch(error => console.error('Error fetching bids:', error));
        }
        if (token) {
            fetchBids();
            fetchListings();
        }
    }, [token]);

    const mapBids = (data) => {
        return data.map((item) => <BidItem data={item} key={item.bidid} />);
    };
    const mapListings = (data) => {
        return data.map((item) => <ListingItem data={item} key={item.product_id} />);
    };

    return (
        <div>
            <h1 className='pl-4 text-4xl pb-8 font-bold pt-4'>Activity</h1>
            <div className='px-8'>
                <div>
                    <div className='text-2xl font-semibold'>Active Bids</div>
                    <div className='px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-6 p-4'>
                        {mapBids(activeBids)}
                    </div>
                </div>
                <div>
                    <div className='text-2xl font-semibold'>Active Listings</div>
                    <div className='px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-6 p-4'>
                        {mapListings(activeListings)}
                    </div>
                </div>
            </div>
        </div>
    );
}
