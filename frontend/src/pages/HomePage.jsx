import React from 'react'
import { userAuthStore } from '../store/authStore'
import { formatDate } from '../../../backend/utils/date.js'
import MyButton from '../components/MyButton.jsx'
import { Loader } from 'lucide-react'

const HomePage = () => {
  const { user, logout, isLoading } = userAuthStore()


  async function handleLogout() {
    await logout()
  }
  return (
    <>
      <div className='h-screen flex items-center justify-center '>
        <div className="bg-base-300 w-max-md shadow-sm border border-primary px-5">
          <div className="card-body flex items-center">
            <h2 className="card-title">User Info</h2>
          </div>
          <form className='w-80'>
            <div className='bg-gray-900 p-5 m-5 rounded-md'>
              <p className='text-sm text-neutral-content'>User: {user.name}</p>
              <p className='text-sm text-neutral-content'>Email: {user.email}</p>
            </div>
            <div className='bg-gray-900 p-5 m-5 rounded-md'>
              <p className='text-sm text-neutral-content'>Joined: <span>
                {new Date(user.createdAt).toLocaleDateString("en-Us", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}</span></p>
              <p className='text-sm text-neutral-content'>Last Login: {user.lastLogin ? formatDate(user.lastLogin) : "You just signed in"}</p>
            </div>
            <MyButton disabled={isLoading} onClick={handleLogout}>
              {isLoading ? <Loader size={24} className='animate-spin mx-auto' /> : "Logout"}
            </MyButton>
          </form>
        </div>
      </div>
    </>
  )
}

export default HomePage