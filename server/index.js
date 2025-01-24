import express from "express"
import morgan from 'morgan'
import PlayerRouter from "./routes/player.route.js"
import userRouter from "./routes/users.routes.js"
import dashboardRouter from "./routes/dahsboard.route.js"
import { Server } from "socket.io"; // Import Socket.IO
import http from "http"; // Required to create an HTTP server
import dotenv from "dotenv"
import connectDb from "./helper/connectDb.js"
const app = express()
const server = http.createServer(app);

dotenv.config()
connectDb()

console.log("{global:global.io}")

global.io = new Server(server, {
    cors: {
        origin: "*", // Adjust this to allow specific origins
        methods: ["GET", "POST"],
    }
});

import testio from "./socket/socket.js"
import { sendMail } from "./helper/sendMail.js"
testio()


app.use(morgan('tiny'))
app.use(express.json())
const PORT = process.env.PORT || 3030



app.use("/api/players", PlayerRouter)
app.use("/api/users", userRouter)
app.use("/api/dashboard", dashboardRouter)
app.get("/", (req, res) => {
    sendMail()
    res.send("Hello World")
})

server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})