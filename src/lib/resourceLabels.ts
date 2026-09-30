import type { Locale } from '../i18n/types'
import type { LilleResource, ResourceType } from '../data/lilleResources'
import type { Messages } from '../i18n/messages'

export function getResourceTypeLabel(
  type: ResourceType,
  copy: Messages,
): string {
  return copy.resources.types[type] ?? type
}

export function getCommitmentLabel(
  resource: LilleResource,
  copy: Messages,
): string {
  const level = resource.commitment.level
  const cadence = resource.commitment.cadence
  const byLevel = copy.resources.commitmentLevels
  if (level in byLevel) {
    return byLevel[level as keyof typeof byLevel]
  }
  if (cadence.includes('weekly')) return copy.resources.commitmentLevels.weekly
  if (cadence.includes('monthly')) return copy.resources.commitmentLevels.monthly
  if (cadence.includes('flexible')) return copy.resources.commitmentLevels.flexible
  return copy.resources.commitmentLevels.low
}

const TAG_LABELS: Record<string, Record<Locale, string>> = {
  free: { fr: 'Gratuit', en: 'Free' },
  outdoor: { fr: 'En plein air', en: 'Outdoors' },
  creative: { fr: 'Créatif', en: 'Creative' },
  learning: { fr: 'Apprendre', en: 'Learning' },
  low_commitment: { fr: 'Sans engagement', en: 'No commitment' },
  low_barrier: { fr: 'Accès facile', en: 'Easy access' },
  one_off: { fr: 'Ponctuel', en: 'One-off' },
  volunteering: { fr: 'Bénévolat', en: 'Volunteering' },
  garden: { fr: 'Jardinage', en: 'Gardening' },
  gardening: { fr: 'Jardinage', en: 'Gardening' },
  fitness: { fr: 'Remise en forme', en: 'Fitness' },
  gentle_activity: { fr: 'Activité douce', en: 'Gentle activity' },
  sport: { fr: 'Sport', en: 'Sport' },
  hiking: { fr: 'Randonnée', en: 'Hiking' },
  dance: { fr: 'Danse', en: 'Dance' },
  language: { fr: 'Langues', en: 'Languages' },
  spanish: { fr: 'Espagnol', en: 'Spanish' },
  small_group: { fr: 'Petit groupe', en: 'Small group' },
  small_group_possible: { fr: 'Petit groupe', en: 'Small group' },
  repair: { fr: 'Réparation', en: 'Repair' },
  intergenerational: { fr: 'Intergénérationnel', en: 'Intergenerational' },
  games: { fr: 'Jeux', en: 'Games' },
  digital: { fr: 'Numérique', en: 'Digital' },
  digital_support: { fr: 'Aide numérique', en: 'Digital help' },
  discount: { fr: 'Réductions', en: 'Discounts' },
  culture: { fr: 'Culture', en: 'Culture' },
  photography: { fr: 'Photo', en: 'Photography' },
  choir: { fr: 'Chorale', en: 'Choir' },
  music: { fr: 'Musique', en: 'Music' },
  art: { fr: 'Arts', en: 'Arts' },
  conferences: { fr: 'Conférences', en: 'Talks' },
  conference: { fr: 'Conférences', en: 'Talks' },
  travel: { fr: 'Voyage', en: 'Travel' },
  group_travel: { fr: 'Voyage en groupe', en: 'Group travel' },
  outings: { fr: 'Sorties', en: 'Outings' },
  workshops: { fr: 'Ateliers', en: 'Workshops' },
  community: { fr: 'Vie de quartier', en: 'Community' },
  associations: { fr: 'Associations', en: 'Associations' },
  regular: { fr: 'Régulier', en: 'Regular' },
  monthly: { fr: 'Mensuel', en: 'Monthly' },
  training: { fr: 'Formation', en: 'Training' },
  home: { fr: 'Logement', en: 'Home' },
  autonomy: { fr: 'Autonomie', en: 'Independence' },
  admin: { fr: 'Démarches', en: 'Paperwork' },
  pension: { fr: 'Retraite', en: 'Pension' },
  benefits: { fr: 'Aides', en: 'Benefits' },
  simulator: { fr: 'Simulateur', en: 'Simulator' },
  timeline: { fr: 'Calendrier', en: 'Timeline' },
  budget: { fr: 'Budget', en: 'Budget' },
  savings: { fr: 'Épargne', en: 'Savings' },
  rights: { fr: 'Droits', en: 'Rights' },
  work_in_retirement: { fr: 'Cumul emploi-retraite', en: 'Working in retirement' },
  inheritance: { fr: 'Transmission', en: 'Inheritance' },
  housing: { fr: 'Logement', en: 'Housing' },
  movement: { fr: 'Mouvement', en: 'Movement' },
  everyday: { fr: 'Au quotidien', en: 'Everyday' },
}

/** Localised, user-facing tags only — internal identifiers are skipped. */
export function displayTags(
  tags: string[] | undefined,
  locale: Locale,
  max = 2,
): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const tag of tags ?? []) {
    const label = TAG_LABELS[tag]?.[locale]
    if (!label || seen.has(label)) continue
    seen.add(label)
    out.push(label)
    if (out.length >= max) break
  }
  return out
}

export function makeResourceLabelFns(copy: Messages, _locale: Locale) {
  return {
    typeLabel: (resource: LilleResource) =>
      getResourceTypeLabel(resource.resourceType, copy),
    commitmentLabel: (resource: LilleResource) =>
      getCommitmentLabel(resource, copy),
  }
}
