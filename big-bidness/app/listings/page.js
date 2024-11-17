'use client'

/*
You can define multiple "use client" entry points in your React Component tree. This allows you to split your application into multiple client bundles.

"use client" doesn't need to be defined in every component that needs to be 
rendered on the client. 
Once you define the boundary, 
all child components and modules imported into it are considered part of the client bundle.

*/
import ListingDetails from "./components/listingDetails/listingDetails";
import CurrentBids from "./components/currentBids/currentBids";
import Comments from "./components/comments/comments";

export default function Listing() {
    return(

        /*
        
            Componentes needed:
                1. listing details 
                2. Current Bids
                3. Comment section (will have some sub components)
        
        */
        <div>
            <>
                <div className="p-4">
                    <ListingDetails
                        title="Iphone 15 pro max"
                        image="default.jpg"
                        author="Big Blixy"
                    />
                </div>
                <div className="p-4">
                    <CurrentBids/>
                </div>
                <div className="p-4">
                    <Comments/>
                </div>
            </> 
        </div>
    );
}
