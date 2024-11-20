import { useState, useEffect } from "react";


export default function UserCard({author, image, rating}){
    const [listingAuthor, setListingAuthor] = useState(`${author}`);
    const [profilePicture, setProfilePicture] = useState(`${image}`);
    const [authorRatings, setAuthorRatings] = useState(`${rating}`);

    return(
        <div className="border-2">
            <div className="inline-flex space-x-7 border-2">
                <div className="flex-1 w-10">
                    {profilePicture}
                </div>
                <div className="flex-1 space-y border-2">
                    <div className="text-xs font-bold strong block">{listingAuthor}</div>
                    <div className="text-xs block inline-flex">
                        <img src={`/rating_stars/${authorRatings}.png`} alt="user profile picture" className="w-15"></img>
                        {authorRatings}
                    </div>
                </div>
            </div>

        </div>
        
    );
};

