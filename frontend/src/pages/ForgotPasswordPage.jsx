import React, { useState } from 'react'
import { userAuthStore } from '../store/authStore'
import { ArrowLeft, Loader } from 'lucide-react'
import MyButton from '../components/MyButton'
import InputField from '../components/InputField'
import { Link } from 'react-router-dom'

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const { forgotPassword, isLoading, } = userAuthStore()

    async function handleSubmit(event) {
        event.preventDefault()

        await forgotPassword(email)

        setIsSubmitted(true)
    }

    return (
        <>
            <div className='h-screen flex items-center justify-center '>
                <div className="bg-base-300 w-max-md shadow-sm">
                    <div className="card-body flex items-center">
                        <h2 className="card-title mb-5">Forgot Password</h2>
                        <p>Enter your email address to recieve the passwrod reset link.</p>
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className='w-80'>
                                <InputField className="input mt-3 h-12" type='email' placeholder='Enter email' value={email} onChange={(event) => setEmail(event.target.value)} required />

                                <MyButton type='submit'>
                                    {isLoading ? <Loader size={24} className='animate-spin mx-auto' /> : "Send Resend Link"}
                                </MyButton>
                            </form>
                        ) : (
                            <div className='h-screen flex items-center justify-center '>
                                <div className="bg-base-300 w-max-md shadow-sm">
                                    <div className="card-body flex items-center">
                                        <h2 className="card-title">Forgot Password</h2>
                                        <p>If an account exists for the given {email}, you will recieve a password reset link shortly.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='bg-gray-900 h-8 flex justify-center items-center'>
                        <p className='text-sm text-neutral-content'><Link to={'/login'} className='text-primary font-medium hover:underline flex items-center'> <ArrowLeft className='w-4 mr-2' /> Back to Login</Link></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPasswordPage