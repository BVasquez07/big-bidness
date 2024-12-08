'use client';
import React, { useState } from 'react';

const Comment = ({ username, date, text }) => (
  <article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900 border border-gray-300 mb-4">
    <footer className="flex justify-between items-center mb-2">
      <div className="flex items-center">
        <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
          {username}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <time pubdate="true" dateTime={date} title={date}>
            {new Date(date).toLocaleDateString()}
          </time>
        </p>
      </div>
      <button
        id={`dropdownCommentButton`}
        data-dropdown-toggle={`dropdownComment`}
        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        type="button"
      >
        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
        </svg>
        <span className="sr-only">Comment settings</span>
      </button>
    </footer>
    <p className="text-gray-500 dark:text-gray-400">{text}</p>
    <div className="flex items-center mt-4 space-x-4">
      <button type="button" className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
        <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
          />
        </svg>
        Reply
      </button>
    </div>
  </article>
);

const Comments = () => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { username: 'Michael Gough', date: '2022-02-08', text: 'Very straight-to-point article. Really worth time reading.' },
    { username: 'Jese Leos', date: '2022-02-12', text: 'Much appreciated! Glad you liked it ☺️' },
    { username: 'Bonnie Green', date: '2022-03-12', text: 'Great insights! Keep sharing. Thanks for the article.' },
  ]);

  const handlePostComment = (e) => {
    e.preventDefault();
    const newComment = {
      username: 'Your Name', // Replace with the actual username, if needed
      date: new Date().toISOString(),
      text: commentText,
    };
    setComments([newComment, ...comments]); // Add new comment at the top
    setCommentText(''); // Clear the text area
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-4 lg:py-0 antialiased">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comments</h2>
        </div>

        {/* Render comments dynamically */}
        <div className="mb-6">
          {comments.map((comment, index) => (
            <Comment key={index} username={comment.username} date={comment.date} text={comment.text} />
          ))}
        </div>

        <form className="mb-6" onSubmit={handlePostComment}>
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment"
              rows="6"
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-black rounded-lg focus:ring-4 focus:ring-black-200 dark:focus:ring-black-900 hover:bg-black-800"
          >
            Post comment
          </button>
        </form>
      </div>
    </section>
  );
};

export default Comments;
