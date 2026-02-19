import React, { useEffect, useState } from 'react'
import { validUser } from '../apis/auth'
import { useNavigate } from "react-router-dom"

function Start() {
  const pageRoute = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const isValid = async () => {
      try {
        const data = await validUser()
        
        if (data?.user) {
          // User is valid, go to chats
          pageRoute("/chats")
        } else {
          // User invalid, go to login
          pageRoute("/login")
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        // On error, go to login
        pageRoute("/login")
      } finally {
        setChecking(false)
      }
    }

    isValid()
  }, [pageRoute])

  return (
    <div className='bg-[#fff] flex items-center justify-center w-[100vw] h-[100vh] flex-col'>
      <lottie-player 
        src="https://assets1.lottiefiles.com/private_files/lf30_kanwuonz.json" 
        background="transparent" 
        speed="1" 
        style={{ width: "300px", height: "260px" }} 
        loop 
        autoplay
      ></lottie-player>
      <h3 className='font-semibold text-[13px] tracking-wider -mt-16'>
        Please Wait. It Might take some time
      </h3>
    </div>
  )
}

export default Start