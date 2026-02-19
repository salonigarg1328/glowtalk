import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setActiveChat, fetchChats } from '../redux/chatsSlice'
import { useEffect } from 'react'
import { getChatName, getChatPhoto, timeSince } from '../utils/logics'
import NoContacts from './ui/NoContacts'

var aDay = 24 * 60 * 60 * 1000;

function Contacts() {
  const { chats, activeChat } = useSelector((state) => state.chats)
  const dispatch = useDispatch()
  const activeUser = useSelector((state) => state.activeUser)

  useEffect(() => {
    dispatch(fetchChats())
  }, [dispatch])

  return (
    <>
      <div className='flex flex-col overflow-y-scroll scrollbar-hide h-[87vh] pb-10'>
        {
          chats?.length > 0 ? chats?.map((e) => {
            const isActive = activeChat._id === e._id
            return (
              <div
                onClick={() => dispatch(setActiveChat(e))}
                key={e._id}
                className='flex items-center justify-between cursor-pointer px-3 py-3 mx-2 my-[3px] rounded-xl transition-all duration-200'
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(236,72,153,0.1) 100%)'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid #a855f7' : '3px solid transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(168,85,247,0.12)' : 'none',
                }}
                onMouseEnter={(ev) => {
                  if (!isActive) {
                    ev.currentTarget.style.background = 'rgba(168,85,247,0.07)'
                  }
                }}
                onMouseLeave={(ev) => {
                  if (!isActive) {
                    ev.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <div className='flex items-center gap-x-3'>
                  {/* ✅ Profile photo - pink border */}
                  <div className='relative'>
                    <img
                      className='w-12 h-12 rounded-full object-cover'
                      style={{
                        border: isActive ? '2px solid #a855f7' : '2px solid #e9d5ff',
                        boxShadow: isActive ? '0 0 0 2px rgba(168,85,247,0.3)' : 'none'
                      }}
                      src={getChatPhoto(e, activeUser)}
                      alt=""
                    />
                  </div>

                  <div>
                    {/* ✅ Chat name */}
                    <h5
                      className='text-[14.5px] font-bold tracking-wide'
                      style={{ color: isActive ? '#6d28d9' : '#2b2e33' }}
                    >
                      {getChatName(e, activeUser)}
                    </h5>

                    {/* ✅ Latest message preview */}
                    <p
                      className='text-[12.5px] font-medium mt-[1px]'
                      style={{ color: isActive ? '#a855f7' : '#9ca3af' }}
                    >
                      {e.latestMessage?.message?.length > 28
                        ? e.latestMessage?.message.slice(0, 28) + "..."
                        : e.latestMessage?.message || (e.latestMessage?.file ? '📎 File' : '')
                      }
                    </p>
                  </div>
                </div>

                {/* ✅ Time - right side */}
                <div className='flex flex-col items-end gap-y-1 min-w-fit'>
                  <p
                    className='text-[11px] font-medium'
                    style={{ color: isActive ? '#a855f7' : '#b0b2b3' }}
                  >
                    {timeSince(new Date(Date.parse(e.updatedAt) - aDay))}
                  </p>
                </div>
              </div>
            )
          }) : <NoContacts />
        }
      </div>
    </>
  )
}

export default Contacts