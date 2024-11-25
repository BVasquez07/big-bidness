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
  
export const Verify = () => {

    const submitYes = () => {
        // send User ID to Backend
    }

    return (
        <Dialog>
        <DialogTrigger className='px-8 py-2 rounded-md bg-red-500 text-white'>Quit</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                Once you verify your choice, you cannot undo it. We will send your application
                to leave to a Super User for approval.
              </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
                <div className='space-x-3 '>
                    <button className='bg-black text-white rounded-md px-10 py-1' onClick={submitYes()}>Yes</button>
                    <button className='bg-gray-500 text-white rounded-md px-10 py-1'>No</button>
                </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}
  