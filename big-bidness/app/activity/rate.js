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
  import { Button } from "../../components/ui/button"
  
  import React from 'react'
  
export const Rate = ({setRating}) => {

    const submitRating = () => {
      setRating()
    }

    return (
        <Dialog>
        <DialogTrigger className="border bg-black text-white py-1 px-3 rounded-md">Rate</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <button onClick={submitRating} className="">Submit</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}
  