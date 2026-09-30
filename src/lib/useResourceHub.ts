import { useMemo } from 'react'
import { useApp } from '../context/useApp'
import { useCopy, useLocale } from '../i18n'
import {
  buildMentorMatchingProfile,
  toBilanResourceSignals,
} from './mentorMatching'
import { buildPersonalizationProfile } from './personalizationProfile'
import { buildResourceHub } from './pillarRecommendations'
import { makeResourceLabelFns } from './resourceLabels'

export function usePersonalizationProfile() {
  const { answers, profile, socialPreferences } = useApp()
  return useMemo(
    () => buildPersonalizationProfile({ answers, profile, socialPreferences }),
    [answers, profile, socialPreferences],
  )
}

export function useResourceHub(options?: {
  recommendedLimit?: number
  localLimit?: number
}) {
  const { answers, profile, socialPreferences, socialFeedback } = useApp()
  const copy = useCopy()
  const { locale } = useLocale()
  const recommendedLimit = options?.recommendedLimit
  const localLimit = options?.localLimit

  const personalization = usePersonalizationProfile()
  const bilanSignals = useMemo(
    () =>
      toBilanResourceSignals(
        buildMentorMatchingProfile({ answers, profile, socialPreferences }),
      ),
    [answers, profile, socialPreferences],
  )

  return useMemo(() => {
    const labels = makeResourceLabelFns(copy, locale)
    return buildResourceHub(
      {
        locale,
        personalization,
        socialPreferences,
        socialFeedback,
        bilanSignals,
        typeLabel: labels.typeLabel,
        commitmentLabel: labels.commitmentLabel,
        kindLabel: (kind) => copy.resources.kinds[kind],
      },
      { recommendedLimit, localLimit },
    )
  }, [
    copy,
    locale,
    personalization,
    socialPreferences,
    socialFeedback,
    bilanSignals,
    recommendedLimit,
    localLimit,
  ])
}
