'use client';
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useState, useEffect } from "react";

export function Form() {
  const [listType, setListType] = useState("sell");
  const [price, setPrice] = useState(0);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null); 
  const [minimum, setMinimum] = useState(0);
  const [maximum, setMaximum] = useState(0);
  const [token, setToken] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const submitListing = async () => {

    const formData = new FormData();
    formData.append("productname", title);
    formData.append("listing_type", listType);
    formData.append("price", price);
    formData.append("min_price", minimum);
    formData.append("max_price", maximum);
    if (imageFile) {
        formData.append("file", imageFile); 
    }

    for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }

    if (title && price && imageFile) {

      try {
          const response = await fetch("http://localhost:5000/post", {
              method: "POST",
              headers: {
                  Authorization: `${token}`, 
              },
              body: formData, 
          });

          const result = await response.json();

          if (response) {
              setPrice(0);
              setTitle("");
              setImageFile(null);
              setMinimum(0);
              setMaximum(0);
              setTimeout(() => {
                  setSuccess(result.message);
              }, 1600);
          } else {
              console.error("Error creating listing:", result.error);
              alert(result.error);
          }
      } catch (error) {
          console.error("Error creating listing:", error);
          alert("An error occurred while creating the listing.");
      }
    }
};


  return (
    <>
      {success && (
        <div className="shadow max-w-md w-full text-center">
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
            role="alert"
          >
            <strong className="font-bold">{success}</strong>
          </div>
        </div>
      )}
      <Tabs
        onValueChange={(e) => setListType(e)}
        defaultValue="sell"
        className="w-[400px]"
      >
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
                <Input
                  id="title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="image">Upload Image</Label>
                <Input
                  id="image"
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <a className="w-full" onClick={submitListing}>
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
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="image">Upload Image</Label>
                <Input
                  id="image"
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="minimum">Minimum Price</Label>
                  <Input
                    id="minimum"
                    type="number"
                    onChange={(e) => setMinimum(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="maximum">Maximum Price</Label>
                  <Input
                    id="maximum"
                    type="number"
                    onChange={(e) => setMaximum(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <a className="w-full" onClick={submitListing}>
                <Button>Create Listing</Button>
              </a>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
