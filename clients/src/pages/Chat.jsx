import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Model from '../components/Model';
import { BsEmojiSmile, BsFillEmojiSmileFill } from "react-icons/bs"
import { AiOutlinePaperClip } from "react-icons/ai"
import { IoClose } from "react-icons/io5"
import { fetchMessages, sendMessage } from '../apis/messages';
import { useEffect } from 'react';
import MessageHistory from '../components/MessageHistory';
import io from "socket.io-client"
import "./home.css"
import { fetchChats, setNotifications } from '../redux/chatsSlice';
import Loading from '../components/ui/Loading';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { getChatName } from '../utils/logics';
import Typing from '../components/ui/Typing';
import { validUser } from '../apis/auth';
import { toast } from 'react-toastify';

const ENDPOINT = process.env.REACT_APP_API_URL
let socket, selectedChatCompare;

function Chat(props) {
  const { activeChat, notifications } = useSelector((state) => state.chats)
  const dispatch = useDispatch()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const fileInputRef = useRef(null)
  const activeUser = useSelector((state) => state.activeUser)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB!')
      return
    }
    setSelectedFile(file)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setFilePreview(reader.result)
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const keyDownFunction = async (e) => {
    if (!message.trim() && !selectedFile) return
    if (e.key === "Enter" || e.type === "click") {
      const messageToSend = message.trim()
      const fileToSend = selectedFile
      setMessage("")
      setSelectedFile(null)
      setFilePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      socket.emit("stop typing", activeChat._id)
      try {
        const data = await sendMessage({
          chatId: activeChat._id,
          message: messageToSend,
          file: fileToSend
        })
        if (data && data._id) {
          socket.emit("new message", data)
          setMessages(prev => Array.isArray(prev) ? [...prev, data] : [data])
          dispatch(fetchChats())
        } else {
          setMessage(messageToSend)
          setSelectedFile(fileToSend)
        }
      } catch (error) {
        console.error('Send error:', error)
        setMessage(messageToSend)
        setSelectedFile(fileToSend)
      }
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false))
    return () => {
      socket.off("typing")
      socket.off("stop typing")
    }
  }, [])

  useEffect(() => {
    if (activeUser && activeUser.id) {
      socket.emit("setup", activeUser)
      socket.on("connected", () => setSocketConnected(true))
    }
    return () => { socket.off("connected") }
  }, [activeUser])

  useEffect(() => {
    const fetchMessagesFunc = async () => {
      if (activeChat && activeChat._id) {
        setLoading(true)
        try {
          const data = await fetchMessages(activeChat._id)
          setMessages(data || [])
          socket.emit("join room", activeChat._id)
        } catch (error) {
          console.error('Error fetching messages:', error)
          setMessages([])
        } finally {
          setLoading(false)
        }
      }
    }
    fetchMessagesFunc()
    selectedChatCompare = activeChat
  }, [activeChat])

  useEffect(() => {
    const handleMessageReceived = (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chatId._id) {
        if (!notifications.includes(newMessageRecieved)) {
          dispatch(setNotifications([newMessageRecieved, ...notifications]))
        }
      } else {
        setMessages(prev => Array.isArray(prev) ? [...prev, newMessageRecieved] : [newMessageRecieved])
      }
      dispatch(fetchChats())
    }
    socket.on("message recieved", handleMessageReceived)
    return () => { socket.off("message recieved", handleMessageReceived) }
  }, [notifications, dispatch])

  useEffect(() => {
    const isValid = async () => {
      try {
        const data = await validUser()
        if (!data?.user) window.location.href = "/login"
      } catch (error) {
        window.location.href = "/login"
      }
    }
    isValid()
  }, [])

  if (loading) {
    return (
      <div className={props.className} style={{background: 'linear-gradient(180deg, #fdf4ff 0%, #faf5ff 100%)'}}>
        <Loading />
      </div>
    )
  }

  return (
    <>
      {activeChat ? (
        <div className={`${props.className} flex flex-col`}>

          {/* Header */}
          <div className='flex justify-between items-center px-5 w-[100%] py-[3px]'
            style={{background: 'linear-gradient(135deg, #6d28d9 0%, #a855f7 60%, #ec4899 100%)'}}>
            <div className='flex items-center gap-x-[10px]'>
              <h5 className='text-[17px] text-white font-bold tracking-wide drop-shadow-sm'>
                {getChatName(activeChat, activeUser)}
              </h5>
            </div>
            <div><Model /></div>
          </div>

          {/* Messages */}
          <div className='scrollbar-hide w-[100%] flex-1 overflow-y-scroll p-4 pb-[130px]'
            style={{background: 'linear-gradient(180deg, #fdf4ff 0%, #faf5ff 100%)'}}>
            <MessageHistory typing={isTyping} messages={messages} />
            <div className='ml-7'>
              {isTyping && <Typing width="100" height="100" />}
            </div>
          </div>

          {/* Input area */}
          <div className='absolute left-[31%] bottom-[3%]'>
            {showPicker && (
              <div className='absolute bottom-[110px] left-0'>
                <Picker data={data} onEmojiSelect={(e) => setMessage(message + e.native)} />
              </div>
            )}

            {/* File Preview */}
            {selectedFile && (
              <div className='rounded-lg p-3 mb-2 flex items-center justify-between w-[360px] sm:w-[400px] md:w-[350px] lg:w-[400px]'
                style={{background: '#faf5ff', border: '1px solid #e9d5ff'}}>
                <div className='flex items-center gap-2'>
                  {filePreview ? (
                    <img src={filePreview} alt="preview" className='w-12 h-12 object-cover rounded' />
                  ) : (
                    <AiOutlinePaperClip className='w-6 h-6 text-[#a855f7]' />
                  )}
                  <div>
                    <p className='text-sm font-medium text-[#3b0764] truncate max-w-[200px]'>{selectedFile.name}</p>
                    <p className='text-xs text-[#a855f7]'>{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button onClick={handleRemoveFile} type="button" className='text-red-400 hover:text-red-600'>
                  <IoClose className='w-5 h-5' />
                </button>
              </div>
            )}

            {/* Text Input */}
            <div className='px-6 py-3 w-[360px] sm:w-[400px] md:w-[350px] h-[50px] lg:w-[400px] rounded-t-[10px]'
              style={{background: '#faf5ff', border: '1px solid #d8b4fe'}}>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  onChange={(e) => {
                    setMessage(e.target.value)
                    if (!socketConnected) return
                    if (!typing) {
                      setTyping(true)
                      socket.emit('typing', activeChat._id)
                    }
                    let lastTime = new Date().getTime()
                    const time = 3000
                    setTimeout(() => {
                      const timeNow = new Date().getTime()
                      const timeDiff = timeNow - lastTime
                      if (timeDiff >= time && typing) {
                        socket.emit("stop typing", activeChat._id)
                        setTyping(false)
                      }
                    }, time)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) keyDownFunction(e)
                  }}
                  className='chat-input w-[100%] text-[#3b0764] placeholder-[#c084fc]'
                  style={{background: '#faf5ff'}}
                  type="text"
                  name="message"
                  placeholder="Type a message..."
                  value={message}
                  autoComplete="off"
                />
              </form>
            </div>

            {/* Bottom Bar */}
            <div className='px-6 py-3 w-[360px] sm:w-[400px] md:w-[350px] lg:w-[400px] rounded-b-[10px] h-[50px]'
              style={{background: '#faf5ff', borderLeft: '1px solid #d8b4fe', borderRight: '1px solid #d8b4fe', borderBottom: '1px solid #d8b4fe'}}>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-x-2'>
                  <button type="button" onClick={() => fileInputRef.current.click()} className='cursor-pointer hover:scale-110 transition-transform'>
                    <AiOutlinePaperClip className='w-[22px] h-[22px] text-[#a855f7] hover:text-[#7c3aed]' />
                  </button>
                  <input ref={fileInputRef} type="file" onChange={handleFileSelect} className='hidden' accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar" />
                  <button type="button" className='cursor-pointer hover:scale-110 transition-transform' onClick={() => setShowPicker(!showPicker)}>
                    {showPicker
                      ? <BsFillEmojiSmileFill className='w-[20px] h-[20px] text-[#ec4899]' />
                      : <BsEmojiSmile className='w-[20px] h-[20px] text-[#a855f7] hover:text-[#7c3aed]' />
                    }
                  </button>
                </div>
                <button
                  onClick={(e) => keyDownFunction(e)}
                  disabled={!message.trim() && !selectedFile}
                  type="button"
                  className='text-[14px] px-4 py-[6px] font-medium rounded-[8px] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                  style={{
                    background: (!message.trim() && !selectedFile) ? '#e9d5ff' : 'linear-gradient(135deg, #7c3aed, #ec4899)',
                    color: (!message.trim() && !selectedFile) ? '#c084fc' : 'white',
                    boxShadow: (!message.trim() && !selectedFile) ? 'none' : '0 2px 10px rgba(124,58,237,0.4)'
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ✅ FIXED: Welcome screen - purple pink background
        <div className={props.className}
          style={{background: 'linear-gradient(135deg, #fdf4ff 0%, #faf5ff 50%, #f3e8ff 100%)'}}>
          <div className='relative h-full'>
            <div className='absolute top-[40vh] left-[44%] flex flex-col items-center justify-center gap-y-3'>

              {/* Profile pic with purple gradient border */}
              <div style={{
                padding: '3px',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                borderRadius: '50%',
                boxShadow: '0 4px 20px rgba(124,58,237,0.3)'
              }}>
                <img
                  className='w-[60px] h-[60px] rounded-full object-cover'
                  alt="User profile"
                  src={activeUser.profilePic}
                />
              </div>

              {/* Welcome text */}
              <h3 className='text-[#4c1d95] text-[20px] font-medium tracking-wider'>
                Welcome{' '}
                <span className='text-[20px] font-bold' style={{
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {activeUser.name}
                </span>
              </h3>

              {/* Subtitle */}
              <p className='text-[#a855f7] text-[13px] font-medium tracking-wide opacity-80'>
                ✨ Select a chat to start messaging
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Chat