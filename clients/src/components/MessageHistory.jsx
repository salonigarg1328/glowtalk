import React from 'react'
import { useSelector } from 'react-redux'
import ScrollableFeed from "react-scrollable-feed"
import { isSameSender, isSameSenderMargin, isSameUser, isLastMessage } from '../utils/logics'
import { Tooltip } from "@chakra-ui/tooltip";
import { Avatar } from "@chakra-ui/avatar";
import { AiOutlineFileText } from "react-icons/ai";
import "../pages/home.css"

function MessageHistory({ messages }) {
  const activeUser = useSelector((state) => state.activeUser)

  const renderFileContent = (file) => {
    if (!file || !file.url) return null

    if (file.type && file.type.startsWith('image/')) {
      return (
        <a href={file.url} target="_blank" rel="noopener noreferrer">
          <img
            src={file.url}
            alt={file.name}
            className='max-w-[250px] max-h-[250px] rounded-xl cursor-pointer hover:opacity-90 mb-1'
          />
        </a>
      )
    }

    return (
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className='flex items-center gap-2 hover:underline mb-1'
        style={{ color: 'inherit' }}
      >
        <AiOutlineFileText className='w-5 h-5 flex-shrink-0' />
        <span className='text-sm truncate max-w-[200px]'>{file.name}</span>
      </a>
    )
  }

  return (
    <>
      <ScrollableFeed className='scrollbar-hide'>
        {messages &&
          messages.map((m, i) => (
            <div className='flex items-end gap-x-[6px]' key={m._id}>
              {(isSameSender(messages, m, i, activeUser.id) ||
                isLastMessage(messages, i, activeUser.id)) && (
                  <Tooltip label={m.sender?.name} placement="bottom-start" hasArrow>
                    <Avatar
                      style={{ width: "30px", height: "30px", border: "2px solid #e879f9" }}
                      mr={1}
                      cursor="pointer"
                      name={m.sender?.name}
                      src={m.sender?.profilePic}
                      borderRadius="50%"
                    />
                  </Tooltip>
                )}

              <div
                className='message-bubble tracking-wide text-[14.5px] font-medium'
                style={{
                  background: m.sender._id === activeUser.id
                    ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)'
                    : '#f5f0ff',
                  marginLeft: isSameSenderMargin(messages, m, i, activeUser.id),
                  marginTop: isSameUser(messages, m, i, activeUser.id) ? 3 : 10,
                  borderRadius: m.sender._id === activeUser.id
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  padding: "10px 16px",
                  maxWidth: "460px",
                  color: m.sender._id === activeUser.id ? '#ffffff' : '#4c1d95',
                  boxShadow: m.sender._id === activeUser.id
                    ? '0 2px 12px rgba(124, 58, 237, 0.35)'
                    : '0 2px 8px rgba(168, 85, 247, 0.12)',
                  border: m.sender._id === activeUser.id
                    ? 'none'
                    : '1px solid #e9d5ff',
                }}
              >
                {m.file && renderFileContent(m.file)}
                {m.message && <div>{m.message}</div>}
              </div>
            </div>
          ))
        }
      </ScrollableFeed>
    </>
  )
}

export default MessageHistory