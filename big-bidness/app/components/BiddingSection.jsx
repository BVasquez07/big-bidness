'use client';
import React, { useState } from 'react';

const Bid = ({ username, date, avatar, bidAmount, rating }) => {
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {/* Render full stars */}
        {[...Array(fullStars)].map((_, index) => (
          <svg
            key={`full-${index}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-5 h-5 text-yellow-500"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.16 3.24L6.67 12 2 7.76l6.08-.52L10 2l2.92 5.24 6.08.52-4.67 4.24L15.16 18z" />
          </svg>
        ))}
        {/* Render half star if applicable */}
        {halfStar && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-5 h-5 text-yellow-500"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.16 3.24L6.67 12 2 7.76l6.08-.52L10 2l2.92 5.24 6.08.52-4.67 4.24L15.16 18z" />
          </svg>
        )}
        {/* Render empty stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <svg
            key={`empty-${index}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            className="w-5 h-5 text-gray-400"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.16 3.24L6.67 12 2 7.76l6.08-.52L10 2l2.92 5.24 6.08.52-4.67 4.24L15.16 18z" />
          </svg>
        ))}
        {/* Display numerical rating */}
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900 border border-gray-300 mb-0">
      <div className="flex items-center">
        {/* Avatar */}
        <img
          src={avatar}
          alt={`${username}'s avatar`}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div className="flex flex-col flex-grow">
          {/* Name and Bid */}
          <div className="flex justify-between mb-2">
            <p className="text-lg text-gray-900 dark:text-white font-bold">{username}</p>
            <p className="text-lg text-gray-900 dark:text-white font-bold">${bidAmount}</p>
          </div>
          {/* Rating and Date */}
          <div className="flex justify-between items-end">
            <div>{renderStars()}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <time dateTime={date} title={date}>
                {new Date(date).toLocaleDateString()}
              </time>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

const BiddingSection = () => {
  const [bids, setBids] = useState([
    {
      username: 'Michael Gough',
      date: '2022-02-08',
      avatar: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
      bidAmount: 250,
      rating: 4.5,
    },
    {
      username: 'Jese Leos',
      date: '2022-02-12',
      avatar: 'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
      bidAmount: 300,
      rating: 4.0,
    },
    {
      username: 'Bonnie Green',
      date: '2022-03-12',
      avatar: 'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
      bidAmount: 350,
      rating: 4.8,
    },
  ]);

  return (
    <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white mb-6">Current Bids</h2>
        <div className="mb-6">
          {bids.map((bid, index) => (
            <Bid
              key={index}
              username={bid.username}
              date={bid.date}
              avatar={bid.avatar}
              bidAmount={bid.bidAmount}
              rating={bid.rating}
            />
          ))}
        </div>
        <div className="mt-auto">
          <button
            type="submit"
            className="inline-flex items-center justify-center py-3 px-5 text-md font-medium text-center text-white bg-black rounded-lg focus:ring-4 focus:ring-black-200 dark:focus:ring-black-900 hover:bg-black-800 w-full"
          >
            Place Your Bid
          </button>
        </div>
      </div>
    </section>
  );
};

export default BiddingSection;
