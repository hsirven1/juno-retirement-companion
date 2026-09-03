import type { GuidedPath, GuidedStep, PathPhase, Theme } from '../../types'
import type { Locale } from '../types'
import {
  allThemes,
  guidedPaths,
  phaseLabels as phaseLabelsFr,
} from '../../data/paths'
import { pathCopyEn, phaseLabelsEn, stepCopyEn, themeCopyEn } from './paths.en'

function localizeStep(step: GuidedStep, locale: Locale): GuidedStep {
  if (locale !== 'en') return step

  const copy = stepCopyEn[step.id]
  if (!copy) return step

  return {
    ...step,
    title: copy.title,
    content: copy.content,
    ctaLabel: copy.ctaLabel ?? step.ctaLabel,
    options: step.options
      ? step.options.map((option) => ({
          ...option,
          label:
            copy.options?.find((item) => item.id === option.id)?.label ??
            option.label,
        }))
      : step.options,
  }
}

function localizeTheme(theme: Theme, locale: Locale): Theme {
  if (locale !== 'en') return theme

  const copy = themeCopyEn[theme.id]
  if (!copy) return theme

  return {
    ...theme,
    title: copy.title,
    shortReason: copy.shortReason,
    personalizationReason: copy.personalizationReason,
  }
}

function localizePath(path: GuidedPath, locale: Locale): GuidedPath {
  if (locale !== 'en') return path

  const copy = pathCopyEn[path.id]

  return {
    ...path,
    title: copy?.title ?? path.title,
    description: copy?.description ?? path.description,
    steps: path.steps.map((step) => localizeStep(step, locale)),
  }
}

export function getLocalizedTheme(
  themeId: string,
  locale: Locale,
): Theme | undefined {
  const theme = allThemes.find((item) => item.id === themeId)
  return theme ? localizeTheme(theme, locale) : undefined
}

export function getLocalizedThemes(locale: Locale): Theme[] {
  return allThemes.map((theme) => localizeTheme(theme, locale))
}

export function getLocalizedThemeTitle(themeId: string, locale: Locale): string {
  return getLocalizedTheme(themeId, locale)?.title ?? themeId
}

export function getLocalizedActiveThemes(
  themeIds: string[],
  locale: Locale,
): Theme[] {
  return themeIds
    .map((id) => getLocalizedTheme(id, locale))
    .filter((theme): theme is Theme => Boolean(theme))
}

export function getLocalizedGuidedPath(
  pathId: string,
  locale: Locale,
): GuidedPath | undefined {
  const path = guidedPaths.find((item) => item.id === pathId)
  return path ? localizePath(path, locale) : undefined
}

export function getLocalizedGuidedPaths(locale: Locale): GuidedPath[] {
  return guidedPaths.map((path) => localizePath(path, locale))
}

export function getLocalizedStep(
  stepId: string,
  locale: Locale,
): GuidedStep | undefined {
  for (const path of guidedPaths) {
    const step = path.steps.find((item) => item.id === stepId)
    if (step) return localizeStep(step, locale)
  }
  return undefined
}

export function getLocalizedStepTitle(stepId: string, locale: Locale): string {
  if (locale === 'en') {
    const copy = stepCopyEn[stepId]
    if (copy) return copy.title
  }
  return getLocalizedStep(stepId, locale)?.title ?? stepId
}

export function getLocalizedPhaseLabel(phase: PathPhase, locale: Locale): string {
  return locale === 'en' ? phaseLabelsEn[phase] : phaseLabelsFr[phase]
}
