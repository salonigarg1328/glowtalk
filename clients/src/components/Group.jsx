import React, { useState } from 'react'
import { BsPlusLg } from "react-icons/bs"
import { Modal, Box } from "@mui/material"
import { searchUsers } from '../apis/auth';
import { RxCross2 } from "react-icons/rx"
import { useEffect } from 'react';
import { createGroup } from '../apis/chat';
import { fetchChats } from '../redux/chatsSlice';
import { useDispatch } from 'react-redux';
import Search from './group/Search';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2
};

function Group() {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  const [chatName, setChatName] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUsers] = useState([])
  
  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    setOpen(false)
    setSearch("")
    setSearchResults([]) // ✅ Also clear search results
    setSelectedUsers([])
    setChatName("") // ✅ Clear chat name too
  }
  
  const handleFormSearch = async (e) => {
    setSearch(e.target.value)
  }
  
  const handleClick = (e) => {
    if (selectedUser.includes(e)) {
      return
    }
    setSelectedUsers([...selectedUser, e])
  }

  const deleteSelected = (ele) => {
    setSelectedUsers(selectedUser.filter((e) => e._id !== ele._id))
  }
  
  const handleSubmit = async () => {
    if (selectedUser.length >= 2) {
      try {
        await createGroup({
          chatName,
          users: JSON.stringify(selectedUser.map((e) => e._id))
        })
        dispatch(fetchChats())
        handleClose()
      } catch (error) {
        console.error('Create group error:', error)
      }
    }
  }
  
  useEffect(() => {
    const searchChange = async () => {
      // ✅ Only search if query is not empty
      if (!search || search.trim() === '') {
        setSearchResults([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // ✅ FIX: Remove { data } destructuring
        const users = await searchUsers(search)
        console.log('Search results:', users) // DEBUG
        setSearchResults(users || [])
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }
    
    searchChange()
  }, [search])
  
  return (
    <>
      <button className='mt-1 transition duration-150 ease-in-out' onClick={handleOpen}>
        <div className='flex justify-start border-r-2'>
          <button className='text-[11px] font-normal tracking-wide flex items-center gap-x-1 bg-[#f6f6f6] text-[#1f2228] py-1 -mb-7 mt-2 px-2'>
            New Group <BsPlusLg />
          </button>
        </div>
      </button>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h5 className='text-[18px] text-[#111b21] font-medium text-center'>Create A Group</h5>

          <form onSubmit={(e) => e.preventDefault()} className='flex flex-col gap-y-3 mt-3'>
            <input 
              onChange={(e) => setChatName(e.target.value)} 
              value={chatName}
              className="border-[#c4ccd5] border-[1px] text-[13.5px] py-[4px] px-2 w-[100%]" 
              type="text" 
              name="chatName" 
              placeholder="Group Name" 
              required 
            />
            
            <input 
              onChange={handleFormSearch}
              value={search}
              className="border-[#c4ccd5] border-[1px] text-[13.5px] py-[4px] px-2 w-[100%]" 
              type="text" 
              name="users" 
              placeholder="Add users" 
            />
            
            <div className='flex flex-wrap -mt-2 gap-2'>
              {
                selectedUser?.map((e) => {
                  return (
                    <button 
                      key={e._id} 
                      onClick={() => deleteSelected(e)} 
                      type="button"
                      className='flex items-center gap-x-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-400'
                    >
                      <span>{e.name}</span>
                      <RxCross2 />
                    </button>
                  )
                })
              }
            </div>

            <Search 
              isLoading={isLoading} 
              handleClick={handleClick} 
              search={search} 
              searchResults={searchResults} 
            />

            <div className='flex justify-end mt-3'>
              <button 
                onClick={handleSubmit} 
                disabled={selectedUser.length < 2 || !chatName}
                className='bg-[#0086ea] text-[#fff] text-[15px] font-medium px-2 py-1 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed' 
                type='button'
              >
                Create
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  )
}

export default Group