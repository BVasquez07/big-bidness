import { useState, useEffect } from "react";

export default function ListingCard({image, author}){
    const [listingImage, setlistingImage] = useState(image);
    const [listingAuthor, setlistingAuthor] = useState(author); // this needs to be a child component
    //it will be more complex as it requires UserName, Ratings (stars), profile picture for now it will suffice
    return(
        <>
            <div className="w-80 h-80 animate-pulse rounded-lg bg-[url('https://media.discordapp.net/attachments/1307407066800984115/1307506046792761528/image.png?ex=673a8d65&is=67393be5&hm=9796bd2cead401d1b7f43945844391063bd9f2d9a585575e231e9c7e6d909ee1&=&format=webp&quality=lossless&width=634&height=634')]">
                {listingImage}
            </div>
            <div>
                {listingAuthor}
            </div>
        </>
    );
};

