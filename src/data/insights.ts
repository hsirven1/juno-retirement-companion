import { profile } from './profile'
import { lifeAreas } from './lifeAreas'
import { getActiveThemes, haroldActiveThemeIds } from './paths'
import type { AssessmentAnswers, LifeArea, Theme } from '../types'

export function getMapContent(answers: AssessmentAnswers): {
  summary: string
  themes: Theme[]
  areas: LifeArea[]
} {
  const dreams = Array.isArray(answers.dream) ? answers.dream : []
  const moreOf = Array.isArray(answers['more-of']) ? answers['more-of'] : []
  const wantsTravel =
    dreams.includes('Faire un grand voyage') || moreOf.includes('Voyager')
  const wantsToShare = dreams.includes('Transmettre mon expérience')

  let themeIds = [...haroldActiveThemeIds]
  if (wantsTravel && !themeIds.includes('envies')) {
    themeIds = [...themeIds.slice(0, 3), 'envies']
  }

  const themes = getActiveThemes(themeIds)

  const areas = lifeAreas.map((area) => {
    if (area.id === 'experiences' && wantsTravel) {
      return {
        ...area,
        insight:
          'Voyager davantage est clairement une envie. On pourra la relier à un parcours dédié, sans tout planifier d’un coup.',
      }
    }
    if (area.id === 'purpose' && wantsToShare) {
      return {
        ...area,
        insight:
          'Transmettre ce que vous savez pourrait donner un cap stimulant à vos semaines.',
      }
    }
    return area
  })

  return {
    summary: profile.mapSummary,
    themes,
    areas,
  }
}
