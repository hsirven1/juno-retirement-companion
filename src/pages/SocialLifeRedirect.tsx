import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { PATH_SOCIAL } from '../data/paths'
import { getCurrentSocialStepId } from '../lib/journeyScheduling'

/** Legacy /vie-sociale URL → open guided overlay on home. */
export function SocialLifeRedirect() {
  const navigate = useNavigate()
  const { startPath, openGuidedStep, pathProgress } = useApp()

  useEffect(() => {
    startPath(PATH_SOCIAL)
    const stepId =
      getCurrentSocialStepId(pathProgress[PATH_SOCIAL]) ?? 'social-step-1'
    openGuidedStep(stepId)
    void navigate('/home', { replace: true })
  }, [navigate, startPath, openGuidedStep, pathProgress])

  return null
}
