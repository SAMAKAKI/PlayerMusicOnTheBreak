import React, { useRef, useState } from 'react'
import { GiMusicalNotes } from 'react-icons/gi'
import styles from './audioPlayer.module.css'
import { FaPlay, FaPause } from 'react-icons/fa'
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from 'react-icons/hi2'

interface AudioPlayerProps {
  src: string // URL or path to the audio file
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const volumeRef = useRef<HTMLInputElement | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [isMute, setIsMute] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(1)

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(event.target.value)
    }
  }

  const handleMute = () => {
    if (audioRef.current) {
      if (!isMute) {
        setVolume(audioRef.current.volume) // Сохраняем текущее значение громкости
        audioRef.current.volume = 0
        if (volumeRef.current) {
          volumeRef.current.value = '0'
        }
      } else {
        audioRef.current.volume = volume // Возвращаем сохранённую громкость
        if (volumeRef.current) {
          volumeRef.current.value = String(volume)
        }
      }
      setIsMute(!isMute)
    }
  }

  const handleVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      setVolume(newVolume) // Обновляем текущее значение громкости
      if (newVolume === 0) {
        setIsMute(true)
      } else {
        setIsMute(false)
      }
    }
  }

  return (
    <div className='w-full h-full flex justify-center items-center flex-col gap-10'>
      <div className="w-[200px] h-[200px] rounded-full bg-slate-300 flex justify-center items-center">
        <GiMusicalNotes className='text-7xl text-slate-400'/>
      </div>
      <audio ref={audioRef} src={src} onTimeUpdate={handleTimeUpdate} preload="metadata" />
      <div className='w-1/2 flex justify-center items-center gap-5'>
        <button onClick={handlePlayPause}>
          {!isPlaying ? <FaPlay className='text-white text-xl'/> : <FaPause className='text-white text-xl'/>}
        </button>
        <div className="flex items-center text-white text-lg font-semibold">
          <span>{`${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')}`}</span> / 
          <span>{`${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`}</span>
        </div>
        <label className={`${styles.slider}`}>
          <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek} className={`${styles.level}`}/>
        </label>
        <div className="flex items-center gap-5">
          <button onClick={handleMute} >
            { isMute ? <HiMiniSpeakerXMark className='text-white text-2xl font-semibold'/> : <HiMiniSpeakerWave className='text-white text-2xl font-semibold'/>}
          </button>
          <label className={`${styles.slider}`}>
            <input type="range" className={`${styles.level}`} min={'0'} max={'1'} step={'0.01'} onChange={handleVolume} ref={volumeRef}/>
          </label>
        </div>
      </div>
    </div>
  )
}
