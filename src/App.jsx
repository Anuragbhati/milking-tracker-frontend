import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useTimer from './hooks/useTimer'
import useAudio from './hooks/useAudio'
import { saveMilkingSession } from './services/api'
import config from './config'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  text-align: center;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 2rem;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 0;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`

const Button = styled.button`
  background-color: ${props => props.variant === 'stop' ? '#e74c3c' : '#2ecc71'};
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  min-width: 150px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
    padding: 0.875rem;
  }
`

const Timer = styled.div`
  font-size: 4rem;
  margin: 2rem 0;
  font-weight: bold;
  color: #34495e;
  font-variant-numeric: tabular-nums;

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }

  @media (max-width: 480px) {
    font-size: 3rem;
    margin: 1.5rem 0;
  }
`

const HistoryLink = styled(Link)`
  color: #3498db;
  text-decoration: none;
  display: inline-block;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #3498db;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background-color: #3498db;
    color: white;
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    width: 100%;
    text-align: center;
    margin-top: 1.5rem;
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
`

const Modal = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  h2 {
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  margin: 1rem 0;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  &:disabled {
    background-color: #f5f6fa;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin: 1rem 0;
  padding: 0.75rem;
  background: #fdf0ef;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
`

function App() {
  const [showModal, setShowModal] = useState(false)
  const [milkQuantity, setMilkQuantity] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const { 
    time, 
    isRunning, 
    isPaused, 
    start: startTimer, 
    pause: pauseTimer, 
    stop: stopTimer,
    getStartTime 
  } = useTimer()

  const audio = useAudio(config.AUDIO_FILES)

  const startSession = () => {
    const audioStarted = audio.play()
    if (audioStarted) {
      startTimer()
      setError('')
    } else {
      setError('Failed to start audio playback. Please check your audio files.')
    }
  }

  const pauseSession = () => {
    const audioControlled = isPaused ? audio.play() : audio.pause()
    if (audioControlled) {
      pauseTimer()
      setError('')
    } else {
      setError('Failed to pause/resume audio playback.')
    }
  }

  const stopSession = () => {
    const audioStopped = audio.stop()
    if (audioStopped) {
      stopTimer()
      setShowModal(true)
      setError('')
    } else {
      setError('Failed to stop the session.')
    }
  }

  const handleSubmitQuantity = async () => {
    if (!milkQuantity || isNaN(milkQuantity) || parseFloat(milkQuantity) <= 0) {
      setError('Please enter a valid milk quantity')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      await saveMilkingSession({
        start_time: getStartTime().toISOString(),
        end_time: new Date().toISOString(),
        duration: time,
        milk_quantity: parseFloat(milkQuantity)
      })
      
      setShowModal(false)
      setMilkQuantity('')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Container>
      <Title>Start New Milking Session</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!isRunning ? (
        <Button onClick={startSession}>Start Milking</Button>
      ) : (
        <div>
          <Timer>{formatTime(time)}</Timer>
          <ButtonGroup>
            <Button onClick={pauseSession}>
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button variant="stop" onClick={stopSession}>Stop</Button>
          </ButtonGroup>
        </div>
      )}

      <HistoryLink to="/history">View Milking History</HistoryLink>

      {showModal && (
        <ModalOverlay>
          <Modal>
            <h2>Enter Milk Quantity</h2>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Input
              type="number"
              step="0.1"
              value={milkQuantity}
              onChange={(e) => setMilkQuantity(e.target.value)}
              placeholder="Liters"
              disabled={isSaving}
            />
            <Button onClick={handleSubmitQuantity} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Session'}
            </Button>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  )
}

export default App
