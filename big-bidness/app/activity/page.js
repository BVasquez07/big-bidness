'use client';
import React, { useEffect, useState } from 'react';
import { Item } from './item';

export default function Activity() {
    const [activeBids, setActiveBids] = useState([]);
    const [completedBids, setCompletedBids] = useState([]);
    const [token, setToken] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log({ token });
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
                        setCompletedBids(validBids.filter(bid => bid.bid_accepted));
                    } else {
                        console.log('No bids found in the response');
                    }
                })
                .catch(error => console.error('Error fetching bids:', error));
        }
        if (token) {
            console.log(token)
            fetchBids();
        }
    }, [token]);

    const mapFunction = (data) => {
        return data.map((item) => <Item data={item} key={item.bidid} />);
    };

    return (
        <div>
            <h1 className='pl-4 text-4xl pb-8 font-bold pt-4'>Activity</h1>
            <div className='px-8'>
                <div>
                    <div className='text-2xl font-semibold'>Active Bids</div>
                    <div className='px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-6 p-4'>
                        {mapFunction(activeBids)}
                    </div>
                </div>
                <div className='text-2xl font-semibold'>Completed Bids</div>
                    <div className='px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-6 p-4'>
                        {mapFunction(completedBids)}
                    </div>
                </div>
        </div>
    );
}
