'use client'
import CurrentBids from "./components/currentBids/currentBids";
import Comments from "./components/comments/comments";
import ListingCard from "./components/listingDetails/listingCard";
import ListingTitle from "./components/listingDetails/listingTitle";
import BidAuthor from "./components/currentBids/bidAuthor";

export default function Listing() {
    return(

        /*
            Componentes needed:
                1. listing details 
                2. Current Bids
                3. Comment section (will have some sub components)
        
        */
        <div className="m-2">
                <div className="border-2 border-orange-300">
                        <ListingTitle
                            title="Iphone 15 pro max"
                        />
                </div>
                <div className="flex space-x-2 mt-2 border-2">
                    <div className="flex-1 border-2 border-pink-300">
                        <ListingCard
                            image="default.jpg"
                        />
                    </div>
                    <div className="flex-1 border-2 border-purple-300">
                        <div>
                            <BidAuthor
                                author="Bigasjkdhkashdkmashdkahsjdk asdasd  "
                                image="blixy.jpg"
                                rating={String(4)} /*this should be an integer (let's not worry about floats for now) input*/
                            />
                        </div>
                        <CurrentBids/>
                    </div>
                </div>
                <div className="border-2 border-red-400 mt-2">
                    <Comments/>
                </div>
        </div>
    );
}
