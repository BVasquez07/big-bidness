import { useState, useEffect } from "react";

export default function ListingTitle({title}){
    const [listingTitle, setListingTitle] = useState(title);

    return(
        <div className="text-4xl font-semibold">
            {listingTitle}
        </div>
    );
};

