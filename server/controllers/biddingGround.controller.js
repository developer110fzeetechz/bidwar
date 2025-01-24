import BiddingGround from "../schema/bidding.schema.js"

const addBid = async (data) => {
  const { playerId, bidderId, bidAmount, bidderName } = data
  try {
    // Find the bidding ground document for the player
    let biddingGround = await BiddingGround.findOne({ playerId });

    if (!biddingGround) {
      // Create a new bidding ground document if it doesn't exist
      biddingGround = new BiddingGround({ playerId, bids: [] });
    }

    // Calculate the next bid amount
    const lastBid = biddingGround.bids[biddingGround.bids.length - 1];
    const nextBidAmount = bidAmount + 1000;

    // Add the new bid to the `bids` array
    biddingGround.bids.push({
      bidderId,
      bidderName,
      bidAmount,
      bidTime: new Date(),
      nextBidAmount,
    });

    const result = await biddingGround.save();
    return result
  } catch (error) {
    console.error("Error adding bid:", error);
  }
};


const soldToFunctionalities = async (data) => {
  const { playerId } = data
  const biddingGround = await BiddingGround.findOne({
    playerId,
    status: "open", // Ensure the player is still open for bidding
  }).populate("bids.bidderId");

  if (!biddingGround) {
    return { message: "No active bidding found for this player." };
  }

  const lastBid = biddingGround.bids[biddingGround.bids.length - 1];
  // console.log(lastBid)
  biddingGround.status = "sold";
  biddingGround.soldTo = lastBid.bidderId; // Set the last bidder as the buyer
  const res = await biddingGround.save()

  return {
    message: "Player sold successfully.",
    status: "sold",
    bidder: lastBid.bidderName,
    bidAmount: lastBid.bidAmount,
  };
}
export { addBid, soldToFunctionalities }