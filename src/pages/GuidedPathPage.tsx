import { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { GuidedPathGeneric } from './GuidedPathGeneric'
import { useApp } from '../context/useApp'
import { PATH_SOCIAL } from '../data/paths'

/** Routes social theme to the guided overlay; other paths use the generic runner. */
export function GuidedPathPage() {
  const { pathId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { startPath, openGuidedStep } = useApp()

  useEffect(() => {
    if (pathId !== PATH_SOCIAL) return
    startPath(PATH_SOCIAL)
    const stepParam = searchParams.get('step')
    openGuidedStep(stepParam ?? 'social-step-1')
    void navigate('/home', { replace: true })
  }, [pathId, navigate, startPath, openGuidedStep, searchParams])

  if (pathId === PATH_SOCIAL) return null
  return <GuidedPathGeneric />
}
