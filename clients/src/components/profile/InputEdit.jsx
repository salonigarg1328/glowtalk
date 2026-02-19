import React, { useState } from 'react'
import { TbEdit } from "react-icons/tb"
import { BsCheck2 } from "react-icons/bs"

function InputEdit({ type, handleChange, input, handleSubmit }) {
  const [editable, setEditable] = useState(false)

  const submitButton = () => {
    handleSubmit()
    setEditable(false)
  }

  const label = type === "name" ? "Your name" : "Your bio"

  return (
    <>
      <div className='flex flex-col py-4 mt-4 bg-[#ffff] shadow-md px-4 gap-y-3'>

        {/* ✅ label fixed */}
        <p className='text-[12px] text-purple-600 font-medium tracking-wide'>
          {label}
        </p>

        {
          !editable ?

            <div className='flex justify-between items-center'>

              <p className='text-[14.5px] text-[#3b4a54]'>
                {input}
              </p>

              <button onClick={() => setEditable(!editable)}>
                <TbEdit className='w-[21px] h-[21px] text-purple-600' />
              </button>
            </div>

            :

            <div className='flex items-center justify-between'>

              <div>
                <input
                  name={type}
                  onChange={handleChange}
                  className='text-[14.5px] text-[#3b4a54] outline-0 border-b border-purple-300 focus:border-purple-600'
                  type="text"
                  value={input}
                />
              </div>

              <div className='flex items-center gap-x-4'>
                <button onClick={submitButton}>
                  <BsCheck2 className='w-[21px] h-[21px] text-purple-600' />
                </button>
              </div>

            </div>
        }

      </div>
    </>
  )
}

export default InputEdit
