import { useRef, useEffect, useState } from 'react'

const useAudio = (audioUrls) => {
  const audioRef = useRef(null)
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null)

  const getRandomAudioUrl = () => {
    if (!Array.isArray(audioUrls) || audioUrls.length === 0) {
      console.error('No audio files provided')
      return null
    }
    const randomIndex = Math.floor(Math.random() * audioUrls.length)
    return audioUrls[randomIndex]
  }

  useEffect(() => {
    const selectedAudioUrl = getRandomAudioUrl()
    if (!selectedAudioUrl) return

    setCurrentAudioUrl(selectedAudioUrl)

    const audio = new Audio(selectedAudioUrl)
    audio.loop = true
    audioRef.current = audio

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [audioUrls])

  const play = () => {
    try {
      if (!audioRef.current) {
        const selectedAudioUrl = getRandomAudioUrl()
        if (!selectedAudioUrl) return false

        setCurrentAudioUrl(selectedAudioUrl)
        audioRef.current = new Audio(selectedAudioUrl)
        audioRef.current.loop = true
      }

      audioRef.current.play()
      return true
    } catch (error) {
      console.error('Audio playback error:', error)
      return false
    }
  }

  const pause = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      return true
    } catch (error) {
      console.error('Audio pause error:', error)
      return false
    }
  }

  const stop = () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
      return true
    } catch (error) {
      console.error('Audio stop error:', error)
      return false
    }
  }

  return {
    play,
    pause,
    stop,
    currentAudioUrl
  }
}

export default useAudio