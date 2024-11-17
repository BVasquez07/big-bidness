import { useState, useEffect } from "react";

export default function ListingDetails({title, image, author}){
    const [listingTitle, setTitle] = useState(title);
    const [listingImage, setlistingImage] = useState(image);
    const [listingAuthor, setlistingAuthor] = useState(author); // this needs to be a child component
    //it will be more complex as it requires UserName, Ratings (stars), profile picture for now it will suffice
    return(
        <>
            <h1>{listingTitle}</h1>
            <h1>{listingImage}</h1>
            <h3>{listingAuthor}</h3>
        </>
    );
};

