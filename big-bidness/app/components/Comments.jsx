'use client'; 
import React, { useState, useEffect } from 'react';

const Comment = ({ username, formattedDate, text }) => (
  <article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900 border border-gray-300 mb-0">
    <footer className="flex justify-between items-center mb-2">
      <div className="flex items-center">
        <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
          {username}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <time pubdate="true" dateTime={formattedDate} title={formattedDate}>
            {formattedDate}
          </time>
        </p>
      </div>
    </footer>
    <p className="text-gray-500 dark:text-gray-400">{text}</p>
  </article>
);

const Comments = ({ product_id, userInfo }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-proudct-comment?product_id=${product_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);

        // Check if data.comment is an array and contains data
        if (Array.isArray(data.comment) && data.comment.length > 0) {
          const formattedComments = data.comment.map(comment => {
            const readableDate = new Date(comment.created_at).toLocaleString();
            return {
              ...comment,
              formattedDate: readableDate,
            };
          });
          setComments(formattedComments);
        } else {
          setComments([]); // If no comments, set an empty array
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    if (product_id) {
      fetchComments();
    }
  }, [product_id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    let isUser = false;
    let headers = {
      'Content-Type': 'application/json',
    }
    if (token) {
      isUser = true;
      headers['Authorization'] = token
    }
    const newComment = {
      text: commentText,
      product_id: product_id,
      isUser: isUser,
    };

    try {
      const response = await fetch('http://localhost:5000/postcomment', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(newComment),
      });
      const data = await response.json();

      if (data.message === 'comment posted successfully') {
        const newFormattedDate = new Date().toLocaleString();
        console.log(userInfo.username)
        console.log(isUser)
        let username = 'anonymous';
        if (isUser) {
          username = userInfo.username
        }
        setComments([{
          username: username,
          formattedDate: newFormattedDate,
          text: commentText,
        }, ...comments]);
        setCommentText('');
      } else {
        console.error('Error posting comment:', data.error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-4 lg:py-0 antialiased">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comments</h2>
        </div>

        <div className="mb-6">
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            // Reverse the comments array here to display newest on top
            [...comments].reverse().map((comment, index) => (
              <Comment
                key={index}
                username={comment.username}
                formattedDate={comment.formattedDate}
                text={comment.text}
              />
            ))
          )}
        </div>

        <form className="mb-6" onSubmit={handlePostComment}>
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
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
