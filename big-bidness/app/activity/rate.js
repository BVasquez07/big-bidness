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
  
import React from 'react'
import { useState } from 'react'
  
export const Rate = ({setRating}) => {

    const [stars, setStars] = useState(0)

    const submitRating = () => {
      setRating()
    }

    return (
        <Dialog>
        <DialogTrigger className="border bg-black text-white py-1 px-3 rounded-md">Rate</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate</DialogTitle>
            <DialogDescription>
              How would you rate your experience?
            </DialogDescription>
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
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <button onClick={submitRating} className="">Submit</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}
  