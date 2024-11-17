'use client'
import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs"
import { useState, React } from 'react';

export function Form() {
    const [listType, setListType] = useState('sell');
    const [price, setPrice] = useState(0);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [minimum, setMinimum] = useState(0);
    const [maximum, setMaximum] = useState(0);

    const submitListing = () => {
        let data = {};
        if (listType === 'sell') {
            data = {
                type : 'sell',
                title: title,
                image: image,
                price: price
            }
        } else {
            data = {
                type : 'want',
                title: title,
                image: image,
                minimum: minimum,
                maximum: maximum,
                price: price
            }
        }
        console.log(data);
    }
  return (
    <Tabs onValueChange={(e) => setListType(e)} defaultValue="sell" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sell">Sell</TabsTrigger>
        <TabsTrigger value="want">Want</TabsTrigger>
      </TabsList>
      <TabsContent value="sell">
        <Card>
          <CardHeader>
            <CardTitle>Create Sell Listing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="title">Product Title</Label>
              <Input id="title" onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="image">Image Link</Label>
              <Input id="image" onChange={(e) => setImage(e.target.value)}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" onChange={(e) => setPrice(e.target.value)}/>
            </div>
          </CardContent>
          <CardFooter>
            <a className='w-full' onClick={submitListing}>
                <Button>Create Listing</Button>
            </a>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="want">
        <Card>
          <CardHeader>
            <CardTitle>Create Want Listing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="image">Image Link</Label>
              <Input id="image" value={image} onChange={(e) => setImage(e.target.value)}/>
            </div>
            <div className="flex space-x-4">
                <div className="flex-1">
                    <Label htmlFor="minimum">Minimum Price</Label>
                    <Input id="minimum" type="number" onChange={(e) => setMinimum(e.target.value)}/>
                </div>
                <div className="flex-1">
                    <Label htmlFor="maximum">Maximum Price</Label>
                    <Input id="maximum" type="number" onChange={(e) => setMaximum(e.target.value)}/>
                </div>
            </div>
            <div className="space-y-1">
                <div>
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" onChange={(e) => setPrice(e.target.value)}/>
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <a className='w-full' onClick={submitListing}>
                <Button>Create Listing</Button>
            </a>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
