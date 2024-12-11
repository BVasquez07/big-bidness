'use client'
import React, { use } from 'react'
import { useState, useEffect } from 'react';
import { Cone, Star } from 'lucide-react'
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Verify } from './verify'


export default function settings() {
    const [UserInfo, setUserInfo] = useState({})
    const [change, setChange] = useState(0)
    const [balance, setBalance] = useState(0)
    const [token, setToken] = useState('')

    useEffect(() => {
        setToken(localStorage.getItem('token'));
    }, []);

    useEffect(() => {
        const getUserInfo = async () => {
            const userinfo = await fetch('http://localhost:5000/personalinfo', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            })
            const data = await userinfo.json()
            setUserInfo(data['user'])
            setBalance(data['user']['accountbalance'])
            console.log(data['user'])
        }
        if (token) {
            console.log({'token': token})
            getUserInfo()
        }
    }, [token]);

    const submitWithdraw = () => {
        if (balance - change < 0) {
            alert('Insufficient funds')
            return
        }
        setBalance(parseInt(balance) - parseInt(change))
        fetch('http://localhost:8080/updatebalance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({'newPrice': parseInt(balance) - parseInt(change)})
        }).then(res => res.json())
        .then(data => {
            console.log(data)
        }).catch(err => {
            console.log(err)
        })
    }

    const submitDeposit = () => {
        setBalance(parseInt(balance) + parseInt(change))
        fetch('http://localhost:8080/updatebalance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({'newPrice': parseInt(balance) + parseInt(change)})
        }).then(res => res.json())
        .then(data => {
            console.log(data)
        }).catch(err => {
            console.log(err)
        });
    }

  return (
    <>
        <div className='px-4 text-4xl pb-8 font-bold pt-4'>
            <h1>
                Settings
            </h1>
        </div>
        <div className='px-8 space-y-6'>  
            <div className='border shadow rounded-md px-9 py-6'>
                <h1 className='pb-2 font-semibold text-xl'>Profile Information</h1>
                <h2><div className="font-semibold inline-block">Name:</div> {UserInfo.firstname + ' ' + UserInfo.lastname}</h2>
                <div>
                    <div className="font-semibold pr-2 inline-block">Rating:</div>
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
                <h1><div className="inline-block font-semibold">Role:</div> {UserInfo.role}</h1>
            </div> 
            <div className='border shadow rounded-md px-9 py-6'>
                <h1 className='pb-2 font-semibold text-xl'>Financial</h1>
                <h2><div className="inline-block text-md font-semibold pb-3">Balance: </div> {balance}</h2>
                <div className='flex'>
                    <div className='w-5/6 pr-2'>
                        <Input type="number" onChange={(e) => setChange(e.target.value)} />
                    </div>
                    <div className='flex w-1/6 space-x-2'>
                        <a className='w-full' onClick={() => {submitWithdraw()}}>
                            <Button>
                                Withdraw
                            </Button>
                        </a>
                        <a className='w-full' onClick={() => {submitDeposit()}}>
                            <Button>
                                Deposit
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
            <div className='border shadow rounded-md px-9 py-6'>
                <h1 className='pb-6 font-semibold text-xl'>Quit System</h1>
                <Verify />
            </div> 
        </div>
    </>
  )
}
