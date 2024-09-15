import { useEffect, useState } from "react"
import { AudioPlayer, MusicList } from "../../components"
import { invoke } from "@tauri-apps/api"
import { useStore } from "../../providers/storeProvider"

export const Home: React.FC = () => {
  const {getItem} = useStore()
  const [tracks, setTracks] = useState<string[]>([])
  const [folderPath, setFolderPath] = useState<string | null>(null)

  useEffect(() => {
    const handleGet = async () => {
      try{
        setFolderPath(await getItem("defaultPathSavedFiles"))
        if (folderPath){
          setTracks(await invoke<string[]>("listMusic", {folderPath}))
        }
      } catch (err) {
        console.error(err);
      }
    }

    handleGet()
  })

  return (
    <div className="flex justify-center items-center h-[90%]">
      <div className="w-3/5">
        <AudioPlayer tracks={tracks}/>
      </div>
      <div className="w-2/5 h-full">
        <MusicList />
      </div>
    </div>
  )
}

