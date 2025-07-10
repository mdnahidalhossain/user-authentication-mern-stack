import { useState } from 'react'
import InputField from '../components/InputField'
import { Link } from 'react-router-dom'
import MyButton from '../components/MyButton'
import { userAuthStore } from '../store/authStore'
import { Loader } from 'lucide-react'

const LoginPage = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { login, isLoading, error} = userAuthStore()

  async function handleLogin(event) {

    event.preventDefault()
    try {
      await login(email, password)
    } catch (error) {
      console.log("Login failed:", error)
    }
  }

  return (
    <>
      <div className='h-screen flex items-center justify-center '>
        <div className="bg-base-300 w-max-md shadow-sm">
          <div className="card-body flex items-center">
            <h2 className="card-title">Log In</h2>
            <form onSubmit={handleLogin} className='w-80'>
              <InputField className="input mt-3 mb-3 h-12" type='email' placeholder='Enter email' value={email} onChange={(event) => setEmail(event.target.value)} />

              <InputField className="input mt-3 mb-3 h-12" type='password' placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} />

              <div className='flex justify-end hover:text-yellow-500'>
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              {error && <p className='text-red-500 font-semibold mt-1'>{typeof error === 'string' }</p>}


              <MyButton type='submit' disabled={isLoading}>
                {isLoading ? <Loader size={24} className='animate-spin mx-auto' /> : "Login"}
              </MyButton>
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

export default LoginPage