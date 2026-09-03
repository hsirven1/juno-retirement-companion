import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/useApp'

/** Compatibility route: open the chat overlay without leaving the app shell. */
export function CoachPage() {
  const { openChat } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    openChat()
    navigate('/home', { replace: true })
  }, [openChat, navigate])

  return null
}
