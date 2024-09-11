import React from 'react'
import { FaPencil, FaRegTrashCan } from 'react-icons/fa6'
import { FiSettings } from 'react-icons/fi'
import { LuFilePlus2 } from 'react-icons/lu'

export const ProposalsList: React.FC = () => {
  return (
    <div className='w-full h-full rounded-2xl bg-slate-700 px-2 py-2 overflow-hidden'>
      <div className="flex justify-between items-center">
        <p className='text-white text-lg font-semibold'>0/13</p>
        <div className="flex items-center gap-5 text-white text-xl font-semibold">
          <button><FiSettings /></button>
          <button><LuFilePlus2 /></button>
        </div>
      </div>
      <div className="w-full flex justify-center items-center text-white text-lg font-semibold my-5">
        <p className='text-center w-[5%]'>Nr</p>
        <p className='text-center w-[65%]'>Title</p>
        <p className='text-center w-[15%]'>Time</p>
        <p className='text-center w-[15%]'>Actions</p>
      </div>
      <div className="flex flex-col w-full h-full gap-3">
        <div className="w-full flex justify-center items-center text-white text-md font-semibold">
          <p className='text-center w-[5%]'>1.</p>
          <p className='text-center w-[65%] overflow-hidden'>SQWOZ BAB - ozero</p>
          <p className='text-center w-[15%]'>7:55 - 8:00</p>
          <div className='w-[15%] flex justify-center gap-4 items-center text-lg text-white font-semibold'>
            <FaPencil />
            <FaRegTrashCan />
          </div>
        </div>
      </div>
    </div>
  )
}
