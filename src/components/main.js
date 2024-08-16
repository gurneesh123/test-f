import React, { useState, useEffect } from 'react';
import { getAllArt, addBid } from '../R.js';

const Main = () => {
    const [arts, setArts] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllArt();
                if(result) {
                    setArts(result.data);
                }
            } catch (error) {
                console.error("Error in getting arts", error);
            }
        };
        fetchData();
    }, []);

    const handleBidSubmit = async (artId, user, bidAmount) => {
        try {
            const artToUpdate = arts.find(art => art._id === artId);
            if (!artToUpdate) {
                setErrorMessage("Art not found.");
                return;
            }
    
            if (!user || isNaN(bidAmount) || bidAmount <= 0) {
                setErrorMessage("Please provide a valid bid amount.");
                return;
            }
    
            const highestBid = artToUpdate.bids.reduce((maxBid, currentBid) => 
                (currentBid.bid > maxBid.bid) ? currentBid : maxBid, { bid: 0 });
    
            if (bidAmount <= highestBid.bid) {
                setErrorMessage("Your bid must be higher than the current highest bid.");
                return;
            } else {
                setErrorMessage(null);
            }
    
            const result = await addBid(artId, { user, bid: bidAmount });
            if (result.status === 200) {
                const updatedArts = arts.map(art => {
                    if (art._id === artId) {
                        return { ...art, bids: [...art.bids, { user, bid: bidAmount }] };
                    }
                    return art;
                });
                setArts(updatedArts);
            }
        } catch (error) {
            console.error("Error in adding bid", error);
            setErrorMessage("Error adding bid. Please try again.");
        }
    };
    

    return (
        <div className='App'>
            <div className='photo-gallery'>
                {arts.map((art) => (
                    <div className="photo-container" key={art._id}>
                        <div className="photo">
                            <img src={art.src} alt={art.alt} width="200" />
                        </div>
                        <div className="comments-section">
                            <h4>Bids</h4>
                            <ul>
                                {art.bids.map((bid, index) => (
                                    <li key={index}><strong>{bid.user}:</strong> ${bid.bid}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="addbid">
                            
                        <form className="comment-form" onSubmit={(e) => {
                            e.preventDefault();
                            const user = e.target.elements.user.value.trim();
                            const bidAmount = parseFloat(e.target.elements.bidAmount.value); // Ensure bidAmount is a number

                            if (!user || isNaN(bidAmount) || bidAmount <= 0) {
                                setErrorMessage("Please provide a valid bid amount.");
                                return;
                            }

                            handleBidSubmit(art._id, user, bidAmount);
                            e.target.reset();
                        }}>
                            <input type="text" name="user" placeholder="Your name" />
                            <input type="number" name="bidAmount" placeholder="Add a higher bid" min="0" step="any" />
                            <button type="submit">Submit Your Higher Bid</button>
                        </form>

                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Main;
