'use client'
import { Star } from 'lucide-react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter,
} from "../../components/ui/dialog"

import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
  
import React from 'react'
import { useState } from 'react'
  
export const Rate = ({setRating}) => {

    const [stars, setStars] = useState(0)
    const [complain, setComplain] = useState(false)

    const submitRating = () => {
      setRating()
    }

    return (
        <Dialog>
        <DialogTrigger className="border bg-black text-white py-1 px-3 rounded-md">Rate</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate</DialogTitle>
            <div className='flex justify-between'>
              <DialogDescription>
                How would you rate your experience?
              </DialogDescription>
              <div className="flex items-center space-x-2">
                <Switch onClick={() => setComplain(!complain)} id="complain" />
                <Label htmlFor="complain">Complain</Label>
              </div>
            </div>
          </DialogHeader>
          <div className="flex justify-center space-x-1 my-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                onClick={() => setStars(star)}
                fill={(stars) >= star ? "gold" : "none"}
                stroke={(stars) >= star ? "gold" : "currentColor"}
                className="cursor-pointer"
              />
            ))}
          </div>
          {complain && (
            <div className="mt-4">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="What went wrong?"
              />
            </div>
          )}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <button onClick={submitRating} className="">Submit</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}
  