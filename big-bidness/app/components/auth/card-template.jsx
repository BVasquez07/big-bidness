
import React from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
//import { label } from "@/components/ui/label"
//import { Input } from "@/components/ui/input"

import Link from 'next/link';


export const CardTemplate = ({title, label, backButtonHref, backButtonText1, backButtonText2, children}) => {
    return (
        <Card className="xl:w-1/3 lg:w-1/2 md:w-2/3 sm:w-3/4 w-full mx-auto">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                <CardDescription>{label}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter className="flex items-center space-x-2">
                <p className="text-sm">{backButtonText1}</p>
                <Link href={backButtonHref} passHref>
                    <Button className="text-sm text-black" size="sm" variant="outline">{backButtonText2}</Button>
                </Link>
            </CardFooter>
        </Card>
    );
    }

export default CardTemplate;