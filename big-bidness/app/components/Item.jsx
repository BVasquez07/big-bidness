import React from 'react';
import { Card, CardBody, CardFooter, Typography, Button } from '@material-tailwind/react';
import Link from 'next/link';

export const Item = ({ data }) => {
  return (
    <Link href={`/itemPage/${data.product_id}`} className="block cursor-pointer">
    <Card className="mt-6 w-[350px] h-[450px] m-2 border border-gray-300 rounded-lg shadow-md">
      <div className="relative h-[250px] overflow-hidden rounded-t-lg">
        <img 
          alt="Product" 
          className="w-full h-full object-cover" 
          src={data.imageurl} 
        />
      </div>
      <CardBody className="p-6 flex flex-col">
        <Typography variant="h5" color="blue-gray" className="mb-2 truncate">
          {data.product_name}
        </Typography>
        <Typography color="gray" className="mb-2">
          {data.price}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Button className="bg-black text-white hover:bg-gray-800 py-2 px-4 text-lg rounded-lg">
          Buy Now
        </Button>
      </CardFooter>
    </Card>

    </Link>
  );
};
