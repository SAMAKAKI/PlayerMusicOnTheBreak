import React, { useEffect, useState } from 'react'
import { FaMusic, FaX } from 'react-icons/fa6';
import { useStore } from '../../providers/storeProvider';
import { invoke } from '@tauri-apps/api';

interface AddMusicFormProps {
  setIsOpen: (isOpen: boolean) => void
}

export const AddMusicForm: React.FC<AddMusicFormProps> = ({setIsOpen}) => {
  const {getItem} = useStore()
  const [folderPath, setFolderPath] = useState<string>('')
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [errorMesasge, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const checkPath = async () => {
      const storedInfo = await getItem<string>("defaultPathSavedFiles")

      if(storedInfo && storedInfo.length > 0){
        setFolderPath(storedInfo)
      }
    }

    checkPath()
  }, [getItem])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleClose = () => {
    setIsOpen(false)
  }

  const handeleSumbit = async (e: React.FormEvent) =>{
    e.preventDefault()

    if(!selectedFiles || !folderPath){
      setErrorMessage("You need to have selected files and a path to upload music")
      return
    }

    Array.from(selectedFiles).map((file) => {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const fileContent = event.target?.result as ArrayBuffer

        try{
          const response = await invoke("saveMusic", {
            folderPath,
            fileName: file.name,
            fileContent: Array.from(new Uint8Array(fileContent))
          })
          console.log(response);
          
        } catch(error){
          console.error(error);
          
        }
      }
      reader.readAsArrayBuffer(file)
    })
  }

  return (
  <div className='w-full h-full absolute flex justify-center items-center top-0 left-0 z-30 bg-zinc-600/60'>
    <div className="relative w-1/3 h-3/6 bg-slate-800 rounded-2xl p-4">
      <div className="absolute top-4 right-4">
        <button onClick={handleClose}>
          <FaX className='text-white text-xl'/>
        </button>
      </div>
      <form encType='multipart/form-data' className='flex flex-col h-full' onSubmit={handeleSumbit}>
        <label htmlFor="file-upload" className="block w-[25%] text-center text-lg cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
          Choose file
          <input id="file-upload" type="file" className="hidden" multiple onChange={handleFileChange} accept='audio/mp3'/>
        </label>
        <span className='block mt-5 text-white text-md font-semibold'>File will be save to: {folderPath}</span>
        {errorMesasge && (<span className='block mt-5 text-red-600 text-md font-semibold'>{errorMesasge}</span>)}
        {selectedFiles ? (
          <div className="mt-5 text-white border-2 rounded-lg border-blue-600 p-2 h-full overflow-hidden">
            <ul className='h-full flex flex-col gap-2'>
              {Array.from(selectedFiles).map((file, index) => (
                <li className='bg-blue-600/40 rounded-md px-2 py-1 flex items-center gap-2' key={index}><FaMusic />{file.name.split('.mp3')[0]}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-5 text-white border-2 rounded-lg border-blue-600 p-2 h-full flex justify-center items-center text-lg font-semibold">
            No File Chosen
          </div>
        )}
        <button type='submit' className='mt-5 text-center text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all py-2'>Upload</button>
      </form>
    </div>
  </div>
  )
}
