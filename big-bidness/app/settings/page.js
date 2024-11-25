'use client'
import React from 'react'
import { useState } from 'react';
import { Star } from 'lucide-react'
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"


const UserInfo = {
        name: 'John Doe',
        rating: 5,
        role: 'User',
        balance: 1000
    }

export default function settings() {
    const [balance, setBalance] = useState(UserInfo.balance)
    const [change, setChange] = useState(0)

    const submitWithdraw = () => {
        if (balance - change < 0) {
            alert('Insufficient funds')
            return
        }
        setBalance(balance - change)
    }

    const submitDeposit = () => {
        setBalance(balance + change)
    }

  return (
    <>
        <div className='px-4 text-4xl pb-8 font-bold pt-4'>
            <h1>
                Settings
            </h1>
        </div>
        <div className='px-8'>  
            <div className='border shadow rounded-md px-9 py-6'>
                <h1 className='pb-2 font-semibold text-xl'>Profile Information</h1>
                <h2><div className="font-semibold">Name:</div> {UserInfo.name}</h2>
                <div>
                    <div className="font-semibold pr-2">Rating:</div>
                    {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={12}
                        fill={(UserInfo.rating) >= star ? "gold" : "none"}
                        stroke={(UserInfo.rating) >= star ? "gold" : "currentColor"}
                        className='inline-block'
                    />
                    ))}
                </div>
                <h1><div className="font-semibold">Role:</div> {UserInfo.role}</h1>
            </div> 
            <div>
                <div>Financial</div>
                <div>Balance: ${balance}</div>
                <div className='flex'>
                    <div className='w-5/6 pr-2'>
                        <Input type="number" onChange={(e) => setChange(e.target.value)} />
                    </div>
                    <div className='flex w-1/6 space-x-2'>
                        <a className='w-full' onClick={() => {submitWithdraw}}>
                            <Button>
                                Withdraw
                            </Button>
                        </a>
                        <a className='w-full' onClick={() => {submitDeposit}}>
                            <Button>
                                Deposit
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
            <div>
                Leave System
            </div>   
        </div>
    </>
  )
}
