import success from '../helper/res.success.js';
import Player from '../schema/player.schema.js';
import Users from '../schema/users.schema.js'


const getSuymmary = async (req, res) => {
  const {type}= req.query;
  console.log({type})
    try {
        const players = await Player.find();
        const wicketKeepers = await Player.find({ "battingDetails.isWicketkeeper": true });
        const batsman = await Player.find({ playerType: 'batter' });
        const bowlingDetails = await Player.find({ playerType: 'bowler' });
        const allrounder = await Player.find({ playerType: 'allrounder' });
        const registeredTeam = await Users.find({ role: 'organisation' });


        let  data = {
            registeredPlayers: players.length,
            wicketKeepersCount: wicketKeepers.length,
            batsman: batsman.length,
            bowlers: bowlingDetails.length,
            allrounders: allrounder.length,
            registeredTeams: registeredTeam.length,
        }
        if(type=="Registered Players") {
            data=players
        }if(type=="Wicketkeepers") {
            data=wicketKeepers
        }
        if(type=="All Rounders") {
            data=allrounder
        }
        if(type=="Batsman") {
            data=batsman
        }
        if(type=="Bowlers") {
            data=bowlingDetails
        }
        if(type=="Teams") {
            data=registeredTeam
        }
        success.successResponse(res, data, 'Summary retrieved successfully')
    } catch (error) {
        console.log(error)
    }

}

export { getSuymmary }