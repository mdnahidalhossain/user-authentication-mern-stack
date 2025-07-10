import express from 'express'
import { connectDB } from './database/db.js'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()
const app = express()
const Port = process.env.PORT || 5000

app.use(cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true
}));

// adding a middleware
app.use(express.json()) //allows us to parse req/res.body

app.use(cookieParser()) //allows us to parse incoming cookies

app.use("/api/auth", authRoutes)

app.listen(Port, () => {
    connectDB()
    console.log("Server is running on port: ", Port)
})

export default app