import { Navigate, Route, Routes } from "react-router-dom"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import VerifyEmailPage from "./pages/VerifyEmailPage"
import { userAuthStore } from "./store/authStore"
import { useEffect } from "react"
import HomePage from "./pages/HomePage"
import { Loader } from "lucide-react"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"

//restricts user to return to login/signup page once verified/authenticated
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = userAuthStore()

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />
  }

  return children
}

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = userAuthStore()


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />
  }

  return children
}

function App() {

  //getting the authenticated user data
  const { checkAuth, isCheckingAuth, isAuthenticated, user } = userAuthStore()

  useEffect(() => {

    checkAuth()

  }, [checkAuth])

  console.log("isAuthenticated", isAuthenticated)
  console.log("user", user)
  if (isCheckingAuth) return <div className="flex justify-center items-center h-dvh"><Loader size={24} className='animate-spin ' /></div>;

  return (
    <>
      <Routes>
        {/* <Route path="/" element={<HomePage />}></Route> */}

        {/* protecting "HomePage" from unauthorised user. For example: once logged out, the user will be direstec to login page and if the user tries to return to home page without logging in, the user will not be allowed without proper authentication/login */}
        <Route path="/" element={
          <ProtectRoute>
            <HomePage />
          </ProtectRoute>
        }></Route>

        {/* <Route path="/signup" element={<SignupPage />}></Route> */}

        {/* this restricts verified/athenticated users to return to signup page / login page. If a user tries ti go back to signup page, the user will be redirected to home page */}
        <Route path="/signup" element={
          <RedirectAuthenticatedUser>
            <SignupPage />
          </RedirectAuthenticatedUser>
        }></Route>

        {/* <Route path="/login" element={<LoginPage />}></Route> */}

        <Route path="/login" element={
          <RedirectAuthenticatedUser>
            <LoginPage />
          </RedirectAuthenticatedUser>
        }></Route>
        <Route path="/verify-email" element={<VerifyEmailPage />}></Route>
        <Route path="/forgot-password" element={<RedirectAuthenticatedUser>
          <ForgotPasswordPage />
        </RedirectAuthenticatedUser>}></Route>
      </Routes>
    </>
  )
}

export default App
