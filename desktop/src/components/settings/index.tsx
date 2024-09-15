import { open } from '@tauri-apps/api/dialog'
import React, { useEffect, useState } from 'react'
import { FaPencil, FaX } from 'react-icons/fa6'
import { useStore } from '../../providers/storeProvider'

interface SettingsProps {
  setIsOpen: (isOpen: boolean) => void
}

export const Settings: React.FC<SettingsProps> = ({setIsOpen}) => {
  const [folderPath, setFolderPath] = useState<string | null>(null)
  const {getItem, setItem} = useStore()

  useEffect(() => {
    const checkPath = async () => {
      const storedPath = await getItem<string>("defaultPathSavedFiles")

      if(storedPath && storedPath.length > 0){
        setFolderPath(storedPath)
      }
    }

    checkPath()
  }, [getItem])

  const selectFolder = async () => {
    const selectedFolder = await open({
      directory: true,
      multiple: false
    })

    if(typeof selectedFolder === 'string'){
      setFolderPath(selectedFolder)
    }
  }

  const handleSetSettings = async () => {
    await setItem("defaultPathSavedFiles", folderPath)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div className='w-full h-full absolute flex justify-center items-center top-0 left-0 z-30 bg-zinc-600/60'>
      <div className="relative w-1/3 h-3/6 bg-slate-800 rounded-2xl p-4">
        <div className="absolute top-4 right-4">
          <button onClick={handleClose}>
            <FaX className='text-white text-xl'/>
          </button>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col gap-4">
            <p className='text-lg text-white font-semibold'>Files are saved in:</p>
            <label htmlFor="" className='relative'>
              <input type="text" value={folderPath?.toString()} className='rounded-md bg-slate-500 py-2 px-4 text-white text-md w-full' disabled/>
              <button className='absolute right-0 bg-blue-600 p-3 text-white rounded-e-md' onClick={selectFolder}><FaPencil /></button>
            </label>
          </div>
          <button className='bg-blue-600 rounded-xl text-xl text-white font-semibold py-2' onClick={handleSetSettings}>Save</button>
        </div>
      </div>
    </div>
    )
}
