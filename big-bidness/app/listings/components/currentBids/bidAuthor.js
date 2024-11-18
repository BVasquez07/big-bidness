import {useEffect } from "react";
import UserCard from "../shared/userCard";

export default function BidAuthor({author, image, rating}){
    return(
        <div>
            <UserCard
                author={author}
                image={image}
                rating={rating}
            />
        </div>
    );
};

