import React, { useState } from 'react'
import InputField from '../components/InputField'
import { Link, useNavigate } from 'react-router-dom'
import PasswordStrengthBar from '../components/PasswordStrengthBar'
import MyButton from '../components/MyButton'
import { Loader } from 'lucide-react'
import { userAuthStore } from '../store/authStore'


const SignupPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const { signup, error, isLoading } = userAuthStore()

  async function handleSignup(event) {
    event.preventDefault()

    try {
      await signup(email, password, name)
      navigate("/verify-email")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className='h-screen flex items-center justify-center '>
        <div className="bg-base-300 w-max-md shadow-sm">
          <div className="card-body flex items-center">
            <h2 className="card-title">Create Account</h2>
            <form onSubmit={handleSignup} className='w-80'>
              <InputField className="input mt-3 mb-3 h-12" type='text' placeholder='Full Name' value={name} onChange={(event) => setName(event.target.value)} />
              <InputField className="input mt-3 mb-3 h-12" type='email' placeholder='Enter email' value={email} onChange={(event) => setEmail(event.target.value)} />
              <InputField className="input mt-3 mb-3 h-12" type='password' placeholder='Enter Password' value={password} onChange={(event) => setPassword(event.target.value)} />
              {error && <p className='text-red-500 font-semibold mt-2'>{typeof error ==='string'}</p>}
              <PasswordStrengthBar password={password} />
              <MyButton type='submit' disabled={isLoading}>{isLoading ? <Loader size={24} className='animate-spin mx-auto' /> : "Sign Up"}</MyButton>
            </form>
          </div>
          <div className='bg-gray-900 h-8 flex justify-center items-center'>
            <p className='text-sm text-neutral-content'>Already have an account? {" "} <Link to={'/login'} className='text-primary font-medium hover:underline'>Log In</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignupPage