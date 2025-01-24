
import express from 'express';
import Player from '../schema/player.schema.js';
import ErrorResponse from '../helper/res.error.js';
import success from '../helper/res.success.js';
import BiddingGround from "../schema/bidding.schema.js"



const createPlayer = async (req, res) => {
  console.log(req.body);
  const { email, phone } = req.body;

  // if (!email ||!phone) {
  //   return res.status(400).json({ message: 'Email and phone number are required' });
  // }
  const findPlayer = await Player.findOne({ email: email, phone: phone });
  if (findPlayer) {
    return ErrorResponse.CONFLICTS(res, 'Player already exist');
  }
  const newPlayer = new Player(req.body);

  try {
    await newPlayer.save();
    success.successCreatedResponse(res, newPlayer, 'Player created successfully');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

}


const getAllPlayer = async (req, res) => {

  try {
    const players = await Player.find();
    success.successResponse(res, players, 'Players retrieved successfully');
  } catch (error) {
    return ErrorResponse.InternalServerError(res, error.message);
  }
}


const getLatestPlayerWithHighestBasePrice = async () => {
  try {
    const players = await Player.aggregate([
      // Perform a lookup to find related documents in the BiddingGround collection
      {
        $lookup: {
          from: "biddinggrounds", // Collection name for BiddingGround (lowercase and plural by default)
          localField: "_id",     // Field in Player to match
          foreignField: "playerId", // Field in BiddingGround to match
          as: "biddingInfo",     // Resulting array field
        },
      },
      // Filter out players who are already in the BiddingGround collection
      {
        $match: {
          biddingInfo: { $size: 0 }, // Only include players with no matching biddingInfo
        },
      },
      // Sort by basePrice (highest first) and createdAt (latest first)
      {
        $sort: {
          basePrice: -1,
          createdAt: -1,
        },
      },
      // Limit the result to one player
      {
        $limit: 1,
      },
    ]);

    // Return the player if found, or null if no matching player exists
    console.log(players.length > 0 ? players[0] : null           )
    return players.length > 0 ? players[0] : null;
  } catch (error) {
    console.error("Error fetching player not in BiddingGround:", error.message);
    throw new Error("Failed to fetch player");
  }
};




export { createPlayer, getAllPlayer, getLatestPlayerWithHighestBasePrice }