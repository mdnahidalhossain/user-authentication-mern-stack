// http requests from database through API: 
// GET(Read/fetch data for a post), 
// POST(Create a post in the databse), 
// PUT(update a post in the databse), 
// DELETE(dete a post in the database)

import User from "../models/Users.js"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import { sendPasswordResetMail, sendResetSuccessMail, sendVerificationMail, sendWelcomeMail } from "../mailtrap/sendVerificationMail.js"


export async function getAllUsers(_, res) {
    //sending successful status fetching status to the database
    try {
        const allUsers = await User.find()
        res.status(200).json(allUsers)
    } catch (error) {
        console.error("Error in 'getAllNotes' controller", error)
        res.status(500).json({ message: "Internal server error" })
    }
}
// creating new users
export async function userSignup(req, res) {
    // res.send("SignUp page")
    const { email, password, name } = req.body
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required!")
        }

        //to check if a user exists under the provided 'email' during signup
        const users = await User.findOne({
            email,
        })

        if (users) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        //to encrypt the password and keeping the passwords safe
        const hashPassword = await bcrypt.hash(password, 10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
        const newUser = new User({
            email,
            password: hashPassword,
            name,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })

        await newUser.save()

        // when a user account is created, a verification email will be sent to the use with the 'verification token' created during signup
        generateTokenAndSetCookie(res, newUser._id)

        //after generating verification token, a verificatiol mail will be sent to the newly signed up user
        await sendVerificationMail(newUser.email, verificationToken)

        res.status(201).json({
            success: true,
            message: "User created successfully",
            newUser: {
                ...newUser._doc,
                password: undefined
            }
        })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    const { verificationCode } = req.body

    try {
        const user = await User.findOne({
            verificationToken: verificationCode,
            //if the exprire time/date is greater than current time, the verification code is still valid
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" })
        }

        user.isVerified = true
        //then remove the verification token and expire date from the Api/database
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined
        await user.save()
        //if verrified then send a 'Welcome' mail to the new user
        await sendWelcomeMail(user.email, user.name)

        //send a response back
        res.status(200).json({
            success: true,
            message: "Email verified successfully!",
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export async function userLogin(req, res) {
    const { email, password } = req.body

    try {
        const userLogin = await User.findOne({ email })

        if (!userLogin) {
            return res.status(400).json({
                success: false,
                message: "Invaild credentials"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, userLogin.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            })
        }

        generateTokenAndSetCookie(res, userLogin._id)

        userLogin.lastLogin = new Date()
        await userLogin.save()

        res.status(200).json({
            success: true,
            message: "Logged in succesfully!",
            user: {
                ...userLogin._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("Login error! ", error)
        res.status(400).json({ success: false, message: error.message })
    }
}

export async function userLogout(req, res) {
    // res.send("Logout page")
    res.clearCookie("token")
    res.status(200).json({
        success: true,
        message: "Logged out successfully!"
    })
}

export async function forgotPassword(req, res) {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000

        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        await user.save()

        await sendPasswordResetMail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({
            success: true,
            message: "Passord reset link sent succesfully!",
        })

    } catch (error) {
        console.log("Password reset error! ", error)
        res.status(400).json({ success: false, message: error.message })
    }
}

export async function resetPassword(req, res) {
    const { token } = req.params
    const { newPassword } = req.body
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            })
        }

        //update/reset password
        const hashPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined
        await user.save()

        await sendResetSuccessMail(user.email)

        res.status(200).json({
            success: true,
            message: "Password Reset Success mail sent!",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("Password reset success mail error! ", error)
        res.status(400).json({ success: false, message: error.message })
    }
}

export async function checkAuth(req, res) {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Password Reset Success mail sent!",
            user: {
                ...user._doc,

                password: undefined
            }
        })

    } catch (error) {
        console.log("Error in 'checkAuth'", error)
        res.status(400).json({ success: false, message: error.message })
    }
}
