'use client'
import React, { useState } from 'react';

const CreditCardForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [csv, setCsv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const validateForm = () => {
    const cardNumberRegex = /^\d{16}$/; 
    const cvsRegex = /^\d{3}$/; 
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if (!emailRegex.test(email)) {
      setAlertMessage('Please enter a valid email address.');
      setAlertType('error');
      return false;
    }

    if (!cardNumberRegex.test(cardNumber)) {
      setAlertMessage('Card number must be 16 digits.');
      setAlertType('error');
      return false;
    }

    if (!cvsRegex.test(csv)) {
      setAlertMessage('CSV must be 3 digits.');
      setAlertType('error');
      return false;
    }

    if (!expiryRegex.test(expiryDate)) {
      setAlertMessage('Expiry date must be in MM/YY format.');
      setAlertType('error');
      return false;
    }

    if (password.length < 8) {
      setAlertMessage('Password must be at least 8 characters long.');
      setAlertType('error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage(''); 
    setAlertType('');

    if (!validateForm()) return;

    try {

      const data = { "card": cardNumber, "date": expiryDate, "cvv": csv, "email": email, "password": password }
      const response = await fetch('http://localhost:8080/update-suspended', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      if (response.ok) {
        setAlertMessage('Payment successful! Your account has been unsuspended.');
        setAlertType('success');
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("role", responseData.role);

        
        setTimeout(() => {
          window.location.href = "/";
        }, 1750);
      } else {
        const errorData = responseData.error
        setAlertMessage(`Error: ${errorData.message || 'Something went wrong.'}`);
        setAlertType('error');
      }
    } catch (error) {
      setAlertMessage(`Error: ${error.message}`);
      setAlertType('error');
    }
  };

  return (
    <div className="mt-32 max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Unsuspend Account</h2>
      {alertMessage && (
        <div
          className={`p-4 mb-4 text-sm rounded ${
            alertType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {alertMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            maxLength="16"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="cvs" className="block text-sm font-medium text-gray-700">
            CSV
          </label>
          <input
            type="text"
            id="cvs"
            maxLength="3"
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
            Expiry Date (MM/YY)
          </label>
          <input
            type="text"
            id="expiryDate"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Pay $50
        </button>
      </form>
    </div>
  );
};

export default CreditCardForm;