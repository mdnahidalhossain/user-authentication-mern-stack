import React, { useEffect, useRef, useState } from 'react'
import InputField from '../components/InputField'
import { Link, useNavigate } from 'react-router-dom'
import MyButton from '../components/MyButton'
import { userAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const VerifyEmailPage = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const inputRefs = useRef([])
    const navigate = useNavigate()
    // const isLoading = false

    

    function handleChange(index, value) {
        const newCode = [...code]

        //handle pasted content
        if (value.length > 1) {
            const pasteCode = value.slice(0, 6).split("")

            for (let i=0; i<6; i++) {
                newCode[i] = pasteCode[i] || ""
            }
            setCode(newCode)

            //focus on the last non-empty input or the first empty one
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "")
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5
            inputRefs.current[focusIndex].focus()
        } else {
            newCode[index] = value
            setCode(newCode)

            //move focus to the next input field if value is entered
            if (value && index < 5) {
                inputRefs.current[index + 1].focus()
            }
        }
    }


    function handleKeyDown(index, event) {
        if (event.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }

    const {verifyEmail, error, isLoading} = userAuthStore()

    async function handleSubmit(event) {
        event?.preventDefault()

        const verificationCode = code.join("")

        try {
            await verifyEmail(verificationCode)
            navigate("/")
            toast.success("Email verified successfully!")

        } catch (error) {
            console.log(error)
        }
        console.log(`Verification code submitted: ${verificationCode}`)
    }

    useEffect(() => {
        if (code.every(digit => digit !== '')) {

            handleSubmit(new Event('submit'))
        }
    }, [code])

    return (
        <>
            <div className='h-screen flex items-center justify-center '>
                <div className="bg-base-300 w-max-md shadow-sm">
                    <div className="card-body items-center">
                        <h2 className="card-title">Verify Your Email</h2>
                        <p>Enter the 6-digit code sent to your email address.</p>
                        <form onSubmit={handleSubmit} className='w-100'>
                            <div className='flex justify-between p-2'>
                                {code.map((digit, index) => (
                                <InputField key={index} ref={(el) => (inputRefs.current[index] = el)} maxLength = '6' value={digit} onChange={(event) => handleChange(index, event.target.value)} onKeyDown={(event) => handleKeyDown(index, event)} type='text' inputMode="numeric" className="input h-12 mx-2 text-center"/>
                            ))}
                            </div>
                            {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

                            <MyButton type='submit' disabled={isLoading || code.some((digit) => !digit)}>{isLoading ? "Verifying..." : "Verify Email"}</MyButton>
                        </form>
                    </div>
                    <div className='bg-gray-900 h-8 flex justify-center items-center'>
                        <p className='text-sm text-neutral-content'>Don't have an account? {" "} <Link to={'/signup'} className='text-primary font-medium hover:underline'>Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VerifyEmailPage