import React, { useState, useEffect } from 'react';
import { FaPencil, FaRegTrashCan } from 'react-icons/fa6';
import { FiSettings } from 'react-icons/fi';
import { LuFilePlus2 } from 'react-icons/lu';
import { AddMusicForm, Settings } from '../../components';
import { useStore } from '../../providers/storeProvider';
import { invoke } from '@tauri-apps/api';

export const MusicList: React.FC = () => {
  const {getItem} = useStore()
  const [musicFiles, setMusicFiles] = useState<string[]>([])
  const [isOpenAddMusic, setIsOpenAddMusic] = useState<boolean>(false)
  const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false)
  const [defaultPath, setDefaultPath] = useState<string | null>(null)

  const keyDownHandler = (e: KeyboardEvent) => {
    if(e.key === 'Escape'){
      setIsOpenAddMusic(false);
      setIsOpenSettings(false)
    }
  }
  useEffect(() => {
    const handleList = async () => {
      try{
        setDefaultPath(await getItem<string>("defaultPathSavedFiles"))
        if(defaultPath){
          const files = await invoke<string[]>("listMusic", {folderPath: defaultPath})
          setMusicFiles(files)
        }
      } catch (err){
        console.error(err);
      }
    }

    handleList()

    window.addEventListener("keydown", keyDownHandler)

    return () => {
      window.removeEventListener("keydown", keyDownHandler)
    }
  }, [getItem, defaultPath])

  const handleRemove = async (fileName: string) => {
    try{
      await invoke("removeMusic", { filePath: `${defaultPath}\\${fileName}` })
      window.location.reload()
    } catch (err){
      console.error(err);
    }
  }

  return (
    <>
    {isOpenSettings && (<Settings setIsOpen={setIsOpenSettings}/>)}
    {isOpenAddMusic && ( <AddMusicForm setIsOpen={setIsOpenAddMusic}/>)}
    <div className="w-full h-full rounded-2xl bg-slate-700 px-2 py-2 overflow-hidden">
      <div className="flex justify-between items-center">
        <p className="text-white text-lg font-semibold">{musicFiles.length}</p>
        <div className="flex items-center gap-5 text-white text-xl font-semibold">
          <button onClick={() => setIsOpenSettings(true)}>
            <FiSettings />
          </button>
          <button onClick={() => setIsOpenAddMusic(true)}>
            <LuFilePlus2 />
          </button>
        </div>
      </div>

      <div className="w-full flex justify-center items-center text-white text-lg font-semibold my-5">
        <p className="text-center w-[5%]">Nr</p>
        <p className="text-center w-[65%]">Title</p>
        <p className="text-center w-[15%]">Time</p>
        <p className="text-center w-[15%]">Actions</p>
      </div>
      <div className="flex flex-col w-full h-full gap-3">
        {musicFiles.map((file, index) => (
          <div key={index} className="w-full flex justify-center items-center text-white text-md font-semibold">
            <p className="text-center w-[5%]">{index + 1}.</p>
            <p className="text-center w-[65%] overflow-hidden">{file.split('.mp3')[0]}</p>
            <p className="text-center w-[15%]">7:55 - 8:00</p>
            <div className="w-[15%] flex justify-center gap-4 items-center text-lg text-white font-semibold">
              <FaPencil />
              <button onClick={() => handleRemove(file)}>
                <FaRegTrashCan />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};
