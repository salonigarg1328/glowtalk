import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchUsers, validUser } from '../apis/auth'
import { setActiveUser } from '../redux/activeUserSlice'
import { RiNotificationBadgeFill } from "react-icons/ri"
import { BsSearch } from "react-icons/bs"
import { BiNotification } from "react-icons/bi"
import { IoIosArrowDown } from "react-icons/io"
import { setShowNotifications, setShowProfile } from '../redux/profileSlice'
import Chat from './Chat'
import Profile from "../components/Profile"
import { acessCreate } from "../apis/chat.js"
import "./home.css"
import { fetchChats, setNotifications } from '../redux/chatsSlice'
import { getSender } from '../utils/logics'
import { setActiveChat } from '../redux/chatsSlice'
import Group from '../components/Group'
import Contacts from '../components/Contacts'
import { Effect } from "react-notification-badge"
import NotificationBadge from 'react-notification-badge';
import Search from '../components/group/Search'

function Home() {
  const dispatch = useDispatch()
  const { showProfile, showNotifications } = useSelector((state) => state.profile)
  const { notifications } = useSelector((state) => state.chats)
  const { activeUser } = useSelector((state) => state)
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const handleSearch = async (e) => {
    setSearch(e.target.value)
  }

  const handleClick = async (e) => {
    try {
      await acessCreate({ userId: e._id })
      dispatch(fetchChats())
      setSearch("")
      setSearchResults([])
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  useEffect(() => {
    const searchChange = async () => {
      if (!search || search.trim() === '') {
        setSearchResults([])
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const users = await searchUsers(search)
        setSearchResults(users || [])
      } catch (error) {
        console.error('Home search error:', error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }
    searchChange()
  }, [search])

  useEffect(() => {
    const isValid = async () => {
      try {
        setIsInitialLoading(true)
        const data = await validUser()
        if (data?.user) {
          const user = {
            id: data.user._id,
            email: data.user.email,
            profilePic: data.user.profilePic,
            bio: data.user.bio,
            name: data.user.name
          }
          dispatch(setActiveUser(user))
          await dispatch(fetchChats())
        } else {
          window.location.href = "/login"
        }
      } catch (error) {
        console.error('Auth validation failed:', error)
        window.location.href = "/login"
      } finally {
        setTimeout(() => setIsInitialLoading(false), 300)
      }
    }
    isValid()
  }, [dispatch])

  if (isInitialLoading || !activeUser?.id) {
    return (
      <div style={{background: 'linear-gradient(135deg, #f3e8ff 0%, #fdf4ff 100%)', height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{ textAlign: 'center' }}>
          <div style={{width: '60px', height: '60px', border: '4px solid #e9d5ff', borderTop: '4px solid #a855f7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px'}}></div>
          <h3 style={{background: 'linear-gradient(135deg, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px'}}>Loading your chats...</h3>
          <p style={{color: '#a855f7', fontSize: '14px', opacity: 0.8}}>Please wait</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #fdf4ff 100%)', minHeight: '100vh', width: '100%' }}>
       <div className="scrollbar-hide z-10 h-[100vh] lg:w-[90%] lg:h-[99vh] lg:mx-auto lg:mt-[1vh] lg:mb-0 overflow-y-hidden shadow-2xl rounded-xl lg:rounded-2xl">
          <div className='flex h-full'>
            {!showProfile ? (
              <div className="md:flex md:flex-col min-w-[360px] h-[100vh] relative" style={{ background: 'linear-gradient(180deg, #fdf4ff 0%, #faf5ff 100%)' }}>
                <div className='h-[61px] px-4 flex items-center justify-between' style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #a855f7 60%, #ec4899 100%)' }}>
                  <a className='flex items-center' href='/'>
                    <h3 className='text-[20px] text-white font-extrabold tracking-wider drop-shadow-sm'>💬 Messages</h3>
                  </a>
                  <div className='flex items-center gap-x-3'>
                    <button onClick={() => dispatch(setShowNotifications(!showNotifications))} className='relative'>
                      <NotificationBadge count={notifications.length} effect={Effect.SCALE} style={{ width: "15px", height: "15px", fontSize: "9px", padding: "4px 2px 2px 2px" }} />
                      {showNotifications ? <RiNotificationBadgeFill style={{ width: "24px", height: "24px", color: "#fff" }} /> : <BiNotification style={{ color: "#fff", width: "24px", height: "24px" }} />}
                    </button>
                    <div className={`${showNotifications ? "overflow-y-scroll scrollbar-hide tracking-wide absolute top-14 right-4 z-10 w-[240px] rounded-xl px-4 py-3 shadow-2xl border border-[#e9d5ff]" : "hidden"}`} style={{ background: '#faf5ff' }}>
                      <p className='text-[12px] font-bold text-[#7c3aed] mb-2 uppercase tracking-widest'>Notifications</p>
                      <div className='text-[13px] text-[#a855f7]'>{!notifications.length && "No new messages"}</div>
                      {notifications.map((e, index) => (
                        <div onClick={() => {dispatch(setActiveChat(e.chatId)); dispatch(setNotifications(notifications.filter((data) => data !== e)))}} key={index} className='text-[12.5px] text-[#4c1d95] px-2 py-1 cursor-pointer rounded-lg hover:bg-[#ede9fe] transition-colors'>
                          {e.chatId.isGroup ? `New Message in ${e.chatId.chatName}` : `New Message from ${getSender(activeUser, e.chatId.users)}`}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => dispatch(setShowProfile(true))} className='flex items-center gap-x-1'>
                      <img className='w-[30px] h-[30px] rounded-full object-cover border-2 border-white shadow-md' src={activeUser?.profilePic} alt="Profile" />
                      <IoIosArrowDown style={{ color: "#fff", height: "14px", width: "14px" }} />
                    </button>
                  </div>
                </div>
                <div className='relative pt-4 px-4 pb-2'>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <input onChange={handleSearch} value={search} className='w-full text-[#3b0764] tracking-wider pl-9 py-[8px] rounded-[12px] outline-0 border border-[#e9d5ff] placeholder-[#c084fc]' style={{ background: '#f3e8ff' }} type="text" name="search" placeholder=" Search" />
                  </form>
                  <div className='absolute top-[24px] left-[27px]'><BsSearch style={{ color: "#a855f7" }} /></div>
                  <Group />
                  <div className='h-[100vh] absolute z-10 w-[100%] left-[0px] top-[70px] flex flex-col gap-y-3 pt-3 px-4 border-t border-[#e9d5ff]' style={{ background: '#faf5ff', display: search ? "" : "none" }}>
                    <Search searchResults={searchResults} isLoading={isLoading} handleClick={handleClick} search={search} />
                  </div>
                </div>
                <Contacts />
              </div>
            ) : (
              <Profile className="min-w-[100%] sm:min-w-[360px] h-[100vh] shadow-xl relative" />
            )}
            <Chat className="chat-page relative lg:w-[100%] h-[100vh]" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home