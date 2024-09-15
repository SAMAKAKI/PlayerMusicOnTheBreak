import React, { useEffect, useRef, useState } from 'react'
import { GiMusicalNotes } from 'react-icons/gi'
import styles from './audioPlayer.module.css'
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa'
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from 'react-icons/hi2'

interface AudioPlayerProps {
  tracks: string[]
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ tracks }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const volumeRef = useRef<HTMLInputElement | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [isMute, setIsMute] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(1)
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0)

  useEffect(() => {
    resetPlayer()
  }, [currentTrackIndex])

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
        setVolume(audioRef.current.volume)
        audioRef.current.volume = 0
        if (volumeRef.current) {
          volumeRef.current.value = '0'
        }
      } else {
        audioRef.current.volume = volume 
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
      setVolume(newVolume) 
      if (newVolume === 0) {
        setIsMute(true)
      } else {
        setIsMute(false)
      }
    }
  }

  const handlePrevious = () => {
    const previousIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length
    setCurrentTrackIndex(previousIndex)
    setIsPlaying(false)
    resetPlayer()
  }

  // Handle switching to the next track
  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length
    setCurrentTrackIndex(nextIndex)
    setIsPlaying(false)
    resetPlayer()
  }

  const resetPlayer = () => {
    if (audioRef.current) {
      audioRef.current.load() // Reload the new audio file
      setCurrentTime(0)
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className='w-full h-full flex justify-center items-center flex-col gap-10'>
      <div className="w-[200px] h-[200px] rounded-full bg-slate-300 flex justify-center items-center">
        <GiMusicalNotes className='text-7xl text-slate-400'/>
      </div>
      <audio ref={audioRef} src={tracks[currentTrackIndex]} onTimeUpdate={handleTimeUpdate} preload="metadata" />
      <div className='w-1/2 flex justify-center items-center gap-5'>
        <button onClick={handlePrevious}>
          <FaStepBackward className='text-white text-xl' />
        </button>
        <button onClick={handlePlayPause}>
          {!isPlaying ? <FaPlay className='text-white text-xl'/> : <FaPause className='text-white text-xl'/>}
        </button>
        <button onClick={handleNext}>
          <FaStepForward className='text-white text-xl' />
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
