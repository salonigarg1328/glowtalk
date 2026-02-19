import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from "react-google-login"
import { gapi } from "gapi-script"
import { useEffect } from 'react'
import { googleAuth, registerUser } from '../apis/auth'
import { useState } from 'react'
import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs"
import { toast } from 'react-toastify'

const defaultData = {
  firstname: "",
  lastname: "",
  email: "",
  password: ""
}

function Regsiter() {
  const [formData, setFormData] = useState(defaultData)
  const [isLoading, setIsLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const pageRoute = useNavigate()

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.email.includes("@") && formData.password.length > 6) {
      try {
        const data = await registerUser(formData)

        if (data?.token) {
          localStorage.setItem("userToken", data.token)
          toast.success("Successfully Registered! 😍")
          setIsLoading(false)
          pageRoute("/chats")
        } else {
          setIsLoading(false)
          toast.error(data?.error || data?.message || "Registration failed!")
        }
      } catch (error) {
        setIsLoading(false)
        toast.error("Registration failed!")
      }
    } else {
      setIsLoading(false)
      toast.warning("Invalid email or short password!")
      setFormData({ ...formData, password: "" })
    }
  }

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
      } catch {
        setIsLoading(false)
        toast.error("Something went wrong. Try again!")
      }
    }
  }

  const googleFailure = () => {
    toast.error("Google authentication failed!")
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
    <div className='bg-gradient-to-br from-[#140a2a] via-[#1f1147] to-[#2a0f3d] w-[100vw] h-[100vh] flex justify-center items-center'>

      <div className='w-[90%] sm:w-[400px] pl-0 ml-0 h-[400px] sm:pl-0 sm:ml-9 mt-10 relative'>

        <div className='absolute -top-7 left-0'>
          <h3 className='text-[25px] font-bold tracking-wider text-white'>Register</h3>

          <p className='text-white text-[12px] tracking-wider font-medium'>
            Have Account ?{" "}
            <Link className='text-pink-400 underline' to="/login">
              Sign in
            </Link>
          </p>
        </div>

        <form className='flex flex-col gap-y-3 mt-[12%]' onSubmit={handleOnSubmit}>

          {/* names */}
          <div className='flex gap-x-2 w-[100%]'>
            <input
              onChange={handleOnChange}
              className='bg-[#2b1b4d] border border-purple-500/40 h-[50px] pl-3 text-white placeholder-purple-200 w-[49%] sm:w-[47%] focus:border-pink-400 outline-none'
              type="text"
              name="firstname"
              placeholder='First Name'
              value={formData.firstname}
              required
            />
            <input
              onChange={handleOnChange}
              className='bg-[#2b1b4d] border border-purple-500/40 h-[50px] pl-3 text-white placeholder-purple-200 w-[49%] sm:w-[47%] focus:border-pink-400 outline-none'
              type="text"
              name="lastname"
              placeholder='Last Name'
              value={formData.lastname}
              required
            />
          </div>

          {/* email */}
          <div>
            <input
              onChange={handleOnChange}
              className='bg-[#2b1b4d] border border-purple-500/40 h-[50px] pl-3 text-white placeholder-purple-200 w-[100%] sm:w-[96.3%] focus:border-pink-400 outline-none'
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              required
            />
          </div>

          {/* password */}
          <div className='relative flex flex-col gap-y-3'>
            <input
              onChange={handleOnChange}
              className='bg-[#2b1b4d] border border-purple-500/40 h-[50px] pl-3 text-white placeholder-purple-200 w-[100%] sm:w-[96.3%] focus:border-pink-400 outline-none'
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password (min 7 characters)"
              value={formData.password}
              required
            />

            {!showPass ?
              <button type='button' onClick={() => setShowPass(!showPass)}>
                <BsEmojiLaughing className='text-purple-300 absolute top-3 right-4 sm:right-6 w-[30px] h-[25px]' />
              </button>
              :
              <button type='button' onClick={() => setShowPass(!showPass)}>
                <BsEmojiExpressionless className='text-purple-300 absolute top-3 right-4 sm:right-6 w-[30px] h-[25px]' />
              </button>
            }
          </div>

          {/* register button */}
          <button
            style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)" }}
            className='w-[100%] sm:w-[96.3%] h-[50px] font-bold text-white tracking-wide text-[17px] relative rounded-md'
            type='submit'
            disabled={isLoading}
          >

            <div style={{ display: isLoading ? "" : "none" }} className='absolute -top-[53px] left-[29.5%] sm:left-[87px]'>
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
              Register
            </p>
          </button>

          <p className='text-white text-center sm:-ml-8'>/</p>

          {/* google button */}
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
                className="py-3.5 px-4 border rounded-lg flex items-center w-[100%] sm:w-[96.3%] bg-[#24143f]"
                type="button"
              >
                <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg" alt="google" />
                <p className="font-medium ml-4 text-white">
                  Continue with Google
                </p>
              </button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy={'single_host_origin'}
          />

        </form>
      </div>
    </div>
  )
}

export default Regsiter
