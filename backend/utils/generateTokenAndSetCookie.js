import dotenv  from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

//generate a user account verification token according to user ID
export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production", //for https
        sameSite: "strict",
        maxAge: 1 * 60 * 60 * 1000,
    })
}