import express from 'express'
import { checkAuth, forgotPassword, getAllUsers, resetPassword, userLogin, userLogout, userSignup, verifyEmail } from '../controller/userAuthController.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.get('/', getAllUsers)

//to check user authentication
router.get('/check-user-auth', verifyToken, checkAuth)

router.post('/signup', userSignup)
router.post('/login', userLogin)
router.post('/logout', userLogout)

router.post('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword)

router.post('/reset-password/:token', resetPassword)

export default router