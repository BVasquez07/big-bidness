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
import { Button } from "../../components/ui/button"
  
import React from 'react'
import { useState } from 'react'
  
export const Rate = ({setRated}) => {

    const [stars, setStars] = useState(0)
    const [complain, setComplain] = useState(false)
    const [complainText, setComplainText] = useState('')

    const submitRating = () => {
      setRated(true)
      console.log(stars)
      console.log(complainText)
    }

    return (
        <Dialog>
        <DialogTrigger className='pl-2'>Rate</DialogTrigger>
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
                onChange={(e) => setComplainText(e.target.value)}
              />
            </div>
          )}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button onClick={submitRating}>Submit</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}
  