import { useState, useRef, useEffect } from 'react'

const useTimer = () => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setTime(t => t + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [isRunning, isPaused])

  const start = () => {
    setIsRunning(true)
    setTime(0)
    startTimeRef.current = new Date()
  }

  const pause = () => {
    setIsPaused(!isPaused)
  }

  const stop = () => {
    clearInterval(timerRef.current)
    setIsRunning(false)
    setIsPaused(false)
  }

  const reset = () => {
    setTime(0)
    setIsRunning(false)
    setIsPaused(false)
    clearInterval(timerRef.current)
  }

  const getStartTime = () => startTimeRef.current

  return {
    time,
    isRunning,
    isPaused,
    start,
    pause,
    stop,
    reset,
    getStartTime
  }
}

export default useTimer