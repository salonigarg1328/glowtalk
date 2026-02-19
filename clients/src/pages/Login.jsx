import React from 'react'
import { useEffect } from 'react'
import { GoogleLogin } from "react-google-login"
import { gapi } from "gapi-script"
import { googleAuth } from '../apis/auth'
import { useState } from 'react'
import { loginUser } from '../apis/auth'
import { Link, useNavigate } from 'react-router-dom'
import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs"
import { toast } from 'react-toastify'

const defaultData = {
  email: "",
  password: ""
}

function Login() {
  const [formData, setFormData] = useState(defaultData)
  const [isLoading, setIsLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const pageRoute = useNavigate()

  const googleSuccess = async (res) => {
    if (res?.profileObj) {
      setIsLoading(true)
      try {
        const response = await googleAuth({ tokenId: res.tokenId })
        setIsLoading(false)

        if (response?.data?.token) {
          localStorage.setItem("userToken", response.data.token)
          toast.success("Google login successful!")
          pageRoute("/chats")
        } else {
          toast.error("Google authentication failed!")
        }
      } catch (error) {
        setIsLoading(false)
        toast.error("Something went wrong. Try again!")
      }
    }
  }

  const googleFailure = () => {
    toast.error("Google authentication failed!")
  }

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const formSubmit = async (e) => {
    e.preventDefault()

    if (formData.email.includes("@") && formData.password.length > 6) {
      setIsLoading(true)
      try {
        const data = await loginUser(formData)

        if (data?.token && data?.status === 200) {
          localStorage.setItem("userToken", data.token)
          toast.success("Login Successful! 😍")
          setIsLoading(false)
          pageRoute("/chats")
        } else {
          setIsLoading(false)
          toast.error(data?.message || "Invalid Credentials!")
          setFormData({ ...formData, password: "" })
        }
      } catch (error) {
        setIsLoading(false)
        toast.error("Login failed!")
        setFormData({ ...formData, password: "" })
      }
    } else {
      setIsLoading(false)
      toast.warning("Invalid email or short password!")
      setFormData(defaultData)
    }
  }

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: ''
      });
    };
    gapi.load('client:auth2', initClient);
  }, [])

  return (
    <>
      {/* ✅ Purple dark gradient bg */}
      <div className='bg-gradient-to-br from-[#140a2a] via-[#1f1147] to-[#2a0f3d] w-[100vw] h-[100vh] flex justify-center items-center'>

        <div className='w-[90%] sm:w-[400px] pl-0 ml-0 h-[400px] sm:pl-0 sm:ml-9 mt-20 relative'>

          <div className='absolute -top-5 left-0'>
            <h3 className='text-[25px] font-bold tracking-wider text-white'>Login</h3>

            {/* ✅ accent link color */}
            <p className='text-white text-[12px] tracking-wider font-medium'>
              No Account ?{" "}
              <Link className='text-pink-400 underline' to="/register">
                Sign up
              </Link>
            </p>
          </div>

          <form className='flex flex-col gap-y-3 mt-[12%]' onSubmit={formSubmit}>

            {/* ✅ input themed */}
            <div>
              <input
                className="w-[100%] sm:w-[80%] bg-[#2b1b4d] border border-purple-500/40 h-[50px] pl-3 text-white placeholder-purple-200 focus:border-pink-400 outline-none"
                onChange={handleOnChange}
                name="email"
                type="email"
                placeholder='Email'
                value={formData.email}
                required
              />
            </div>

            <div className='relative'>
              <input
                className='w-[100%] sm:w-[80%] bg-[#2b1b4d] border border-purple-500/40 h-[50px] pl-3 text-white placeholder-purple-200 focus:border-pink-400 outline-none'
                onChange={handleOnChange}
                type={showPass ? "text" : "password"}
                name="password"
                placeholder='Password'
                value={formData.password}
                required
              />

              {!showPass ?
                <button type='button' onClick={() => setShowPass(!showPass)}>
                  <BsEmojiLaughing className='text-purple-300 absolute top-3 right-5 sm:right-24 w-[30px] h-[25px]' />
                </button>
                :
                <button type='button' onClick={() => setShowPass(!showPass)}>
                  <BsEmojiExpressionless className='text-purple-300 absolute top-3 right-5 sm:right-24 w-[30px] h-[25px]' />
                </button>
              }
            </div>

            {/* ✅ main button gradient updated */}
            <button
              style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)" }}
              className='w-[100%] sm:w-[80%] h-[50px] font-bold text-white tracking-wide text-[17px] relative rounded-md'
              type='submit'
              disabled={isLoading}
            >

              <div style={{ display: isLoading ? "" : "none" }} className='absolute -top-[53px] left-[27%] sm:left-[56px]'>
                <lottie-player
                  src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json"
                  background="transparent"
                  speed="1"
                  style={{ width: "200px", height: "160px" }}
                  loop
                  autoplay
                ></lottie-player>
              </div>

              <p style={{ display: isLoading ? "none" : "block" }}>
                Login
              </p>
            </button>

            <p className='text-white text-center sm:-ml-20'>/</p>

            {/* ✅ Google button themed */}
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              render={(renderProps) => (
                <button
                  style={{
                    borderImage: "linear-gradient(to right, #7c3aed, #ec4899)",
                    borderImageSlice: "1"
                  }}
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="py-3.5 px-4 border rounded-lg flex items-center w-[100%] sm:w-[80%] bg-[#24143f]"
                  type="button"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
</svg>
                  <p className="font-medium ml-4 text-white">
                    Continue with Google
                  </p>
                </button>
              )}
              onSuccess={googleSuccess}
              onFailure={googleFailure}
              cookiePolicy={'single_host_origin'}
              scope="profile email"
            />

          </form>
        </div>
      </div>
    </>
  )
}

export default Login
