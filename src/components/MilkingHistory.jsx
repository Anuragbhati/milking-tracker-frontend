import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { fetchMilkingSessions } from '../services/api'

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
`

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
`

const Table = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    border-radius: 0;
    box-shadow: none;
    background: transparent;
  }
`

const TableHeader = styled.div`
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  font-weight: 600;

  @media (max-width: 768px) {
    display: none;
  }
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    background: white;
    margin-bottom: 1rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: relative;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    }
  }
`

const Cell = styled.div`
  @media (max-width: 768px) {
    padding: 0.5rem;
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: center;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    &:before {
      content: attr(data-label);
      font-weight: 600;
      color: #2c3e50;
    }
  }
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #3498db;
  text-decoration: none;
  margin-bottom: 1rem;
  padding: 0.75rem 1.25rem;
  border: 2px solid #3498db;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background-color: #3498db;
    color: white;
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 1.5rem;
  background: #fdf0ef;
  border-radius: 8px;
  margin: 1.5rem 0;
  font-weight: 500;
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-weight: 500;
`

const NoDataMessage = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #7f8c8d;
  background: white;
  border-radius: 8px;
  margin: 1.5rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }
`

function MilkingHistory() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const { data } = await fetchMilkingSessions()
        setSessions(data)
        setError('')
      } catch (err) {
        setError('Failed to load milking sessions. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadSessions()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  if (loading) {
    return <LoadingMessage>Loading sessions...</LoadingMessage>
  }

  return (
    <Container>
      <BackLink to="/">← Back to Timer</BackLink>

      <Title>Milking History</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!error && sessions.length === 0 ? (
        <NoDataMessage>
          <p>No milking sessions recorded yet.</p>
          <p>Start your first session to see it here!</p>
        </NoDataMessage>
      ) : (
        <Table>
          <TableHeader>
            <div>Start Time</div>
            <div>End Time</div>
            <div>Duration</div>
            <div>Milk Quantity (L)</div>
          </TableHeader>
          {sessions.map((session) => (
            <TableRow key={session._id}>
              <Cell data-label="Start Time">{formatDate(session.start_time)}</Cell>
              <Cell data-label="End Time">{formatDate(session.end_time)}</Cell>
              <Cell data-label="Duration">{formatDuration(session.duration)}</Cell>
              <Cell data-label="Milk Quantity">{session.milk_quantity.toFixed(1)} L</Cell>
            </TableRow>
          ))}
        </Table>
      )}
    </Container>
  )
}

export default MilkingHistory