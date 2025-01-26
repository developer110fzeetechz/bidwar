import { addBid, soldToFunctionalities } from "../controllers/biddingGround.controller.js"
import { saveMessages } from "../controllers/GroupMessagesControler.js"
import { getAllMessagesPrivate, individualConversationSave } from "../controllers/IndividualConversations.js"
import { getOnlineuser, saveuser } from "../controllers/onlineUser.controller.js"
import { getLatestPlayerWithHighestBasePrice } from "../controllers/player.controller.js"
import OnlineUser from "../schema/socket.schema.js"


function logTimeExpired() {
    const startTime = new Date();
    console.log(`Start time: ${startTime.toLocaleTimeString()}`);

    setTimeout(() => {
        console.log('time expired')
        return "Time Expired"
    }, 10000); // 10,000 milliseconds = 10 seconds
}
export default () => {
    global.io.on('connection', (socket) => {
        console.log('new User connected', socket.id)

        socket.on('go:online', (data) => {
            saveuser(data)

        })
        socket.on("onlineUsers", async () => {
            const users = await getOnlineuser(socket.id)
            socket.emit("onlineUsers", users)
        })


        socket.on('disconnect', async () => {
            console.log('user disconnected', socket.id)
            try {
                const res = await OnlineUser.findOneAndDelete({ socketId: socket.id })
                socket.emit("onlineUsers", res)
            } catch (error) {
                console.log(error)
            }
        })

        socket.on('chat:message', async (msg) => {
            // console.log(msg)
            await saveMessages(msg)
            global.io.emit('chat:message', msg)
        })

        socket.on('getPrivate:messages', async (data) => {
            const messages = await getAllMessagesPrivate(data)
            socket.emit('receivePrivate:messages', messages);
        })
        socket.on('private:message', async (data) => {
            const { socketId, ...message } = data
            await individualConversationSave(message)
            global.io.to(socketId).emit('private:message', message);
        })

        socket.on("start:auction", async (data) => {
            global.io.emit("start:auction", data)
            const currentPlayer = await getLatestPlayerWithHighestBasePrice()
            global.io.emit("currentPlayer", currentPlayer)

        })

        socket.on("currentBid", async (data) => {
            console.log(data)
            const bids = await addBid(data)

            global.io.emit("currentBid", bids)
        })
        socket.on("outofRace", async (data) => {
            console.log('player out of',data)

            global.io.emit("outofRace", data)
        }) 
        socket.on("soldTo", async (data) => {
            console.log('soldTo',data)

            const result = await soldToFunctionalities(data)
            global.io.emit("soldTo", result)
            
            setTimeout(async() => {
                const currentPlayer = await getLatestPlayerWithHighestBasePrice()
                global.io.emit("currentPlayer", currentPlayer)
    
            }, 3000);
            
        })

        socket.on("lastChance",()=>{
            socket.emit("lastChance",{
                message:"Its Your last Chance to Bid for this player"
            })
        })
        
    })
    return global.io;
}