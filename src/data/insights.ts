import type { Locale } from '../i18n/types'
import type { PillarId, RetirementPersonalizationProfile } from '../types'
import type { PillarPriority } from '../lib/pillarRecommendations'

type P = RetirementPersonalizationProfile

function t(fr: string, en: string, locale: Locale): string {
  return locale === 'en' ? en : fr
}

const isPre = (p: P) =>
  p.retirementStage === 'still_working' || p.retirementStage === 'retiring_soon'

const weakNetwork = (p: P) =>
  p.socialNetworkStrength === 'rare' ||
  p.socialNetworkStrength === 'few_around' ||
  p.socialNetworkStrength === 'often_alone'

/** What the person wants in each pillar, as a short verb phrase. */
function wish(pillar: PillarId, p: P, locale: Locale): string {
  switch (pillar) {
    case 'financial':
      return isPre(p)
        ? t('y voir clair sur vos démarches et vos revenus', 'get clear on your paperwork and income', locale)
        : t('mieux maîtriser vos finances', 'feel more in control of your finances', locale)
    case 'health':
      return p.activityLevel === 'active'
        ? t('rester actif·ve', 'stay active', locale)
        : t('bouger davantage', 'move more', locale)
    case 'social':
      return weakNetwork(p) || p.livingSituation === 'alone'
        ? t('voir du monde plus souvent', 'see people more often', locale)
        : t('garder une vie sociale régulière', 'keep a regular social life', locale)
    case 'projects':
      if (p.travelInterest) {
        return t('voyager et découvrir de nouvelles choses', 'travel and discover new things', locale)
      }
      if (p.learningGoals.length > 0) {
        return t('apprendre de nouvelles choses', 'learn new things', locale)
      }
      return t('faire avancer vos projets', 'move your projects forward', locale)
  }
}

const elide = (phrase: string) => (/^[aeiouyhéè]/i.test(phrase) ? `d’${phrase}` : `de ${phrase}`)

function joinList(items: string[], locale: Locale): string {
  if (items.length <= 1) return items[0] ?? ''
  const and = locale === 'en' ? ' and ' : ' et '
  return `${items.slice(0, -1).join(', ')}${and}${items[items.length - 1]}`
}

/** One concise sentence summarising the person, from their top pillars. */
export function buildBilanSummary(p: P, priority: PillarPriority, locale: Locale): string {
  const wishes = priority.highlighted.slice(0, 3).map((pillar) => wish(pillar, p, locale))

  if (locale === 'en') {
    const opening =
      isPre(p)
        ? 'You’re preparing for retirement, wanting to '
        : p.retirementStage === 'retired_years'
          ? 'You’re enjoying your retirement and would like to '
          : 'You’re starting a new chapter, wanting to '
    return `${opening}${joinList(wishes, locale)}.`
  }

  const opening = isPre(p)
    ? 'Vous préparez votre retraite avec l’envie '
    : p.retirementStage === 'retired_years'
      ? 'Vous profitez de votre retraite avec l’envie '
      : 'Vous entrez dans une nouvelle étape avec l’envie '
  return `${opening}${joinList(wishes.map(elide), locale)}.`
}

/** One short, personal line per pillar for the Bilan result. */
export function buildPillarInsights(p: P, locale: Locale): Record<PillarId, string> {
  return {
    financial: financialInsight(p, locale),
    health: healthInsight(p, locale),
    social: socialInsight(p, locale),
    projects: projectsInsight(p, locale),
  }
}

function financialInsight(p: P, locale: Locale): string {
  if (isPre(p)) {
    return t('Préparer sereinement vos démarches et vos futurs revenus.', 'Prepare your paperwork and future income calmly.', locale)
  }
  if (p.retirementAdminNeeds.length > 0) {
    return t('Y voir clair sur vos droits et vos démarches.', 'Get clear on your entitlements and paperwork.', locale)
  }
  if (p.extraIncomeInterest) {
    return t('Explorer des pistes de revenus complémentaires.', 'Explore ways to earn some extra income.', locale)
  }
  if (p.financialNeeds.includes('budget') || p.financialConfidence === 'low') {
    return t('Clarifier votre budget et mieux comprendre vos options.', 'Clarify your budget and understand your options.', locale)
  }
  if (p.investmentInterest || p.propertyInterest) {
    return t('Mieux comprendre votre épargne et votre patrimoine.', 'Better understand your savings and assets.', locale)
  }
  return t('Garder un œil serein sur vos finances.', 'Keep a calm eye on your finances.', locale)
}

function healthInsight(p: P, locale: Locale): string {
  const a = p.preferredPhysicalActivities
  if (a.includes('swimming') && a.includes('walking')) {
    return t('Nager, marcher et garder la forme.', 'Swim, walk and stay fit.', locale)
  }
  if (a.includes('swimming')) return t('Nager et garder la forme.', 'Swim and stay fit.', locale)
  if (a.includes('walking') || a.includes('outdoor')) {
    return t('Marcher et profiter du grand air.', 'Walk and enjoy the outdoors.', locale)
  }
  if (p.physicalGoals.includes('move_more') || p.activityLevel === 'low') {
    return t('Bouger un peu plus, à votre rythme.', 'Move a little more, at your own pace.', locale)
  }
  if (p.physicalGoals.includes('try_new_sport')) {
    return t('Essayer une nouvelle activité.', 'Try a new activity.', locale)
  }
  if (p.activityLevel === 'active') {
    return t('Continuer à bouger régulièrement.', 'Keep moving regularly.', locale)
  }
  return t('Prendre soin de votre forme au quotidien.', 'Look after your fitness day to day.', locale)
}

function socialInsight(p: P, locale: Locale): string {
  if (weakNetwork(p)) {
    return t('Créer davantage d’occasions de voir du monde.', 'Create more chances to see people.', locale)
  }
  if (p.aloneComfort === 'low') {
    return t('Trouver des activités faciles à rejoindre.', 'Find activities that are easy to join.', locale)
  }
  if (p.socialGoals.includes('new_friends') || p.socialGoals.includes('partner')) {
    return t('Rencontrer de nouvelles personnes.', 'Meet new people.', locale)
  }
  if (p.socialGoals.includes('outing_companions')) {
    return t('Trouver des compagnons de sortie.', 'Find people to go out with.', locale)
  }
  if (p.socialGoals.includes('regular_occasions') || p.socialGoals.includes('group_activities')) {
    return t('Retrouver des rendez-vous réguliers.', 'Enjoy regular get-togethers.', locale)
  }
  if (p.socialGoals.includes('maintain_relationships')) {
    return t('Entretenir vos liens avec vos proches.', 'Keep in touch with the people you love.', locale)
  }
  return t('Partager de bons moments avec d’autres.', 'Share good times with others.', locale)
}

function projectsInsight(p: P, locale: Locale): string {
  const has = (x: string) => p.projects.includes(x as P['projects'][number])
  if (p.travelInterest && p.learningGoals.length > 0) {
    return t('Voyager et continuer à apprendre.', 'Travel and keep learning.', locale)
  }
  if (p.travelInterest) return t('Voyager et découvrir de nouveaux horizons.', 'Travel and discover new horizons.', locale)
  if (p.learningGoals.length > 0) return t('Apprendre de nouvelles choses.', 'Learn new things.', locale)
  if (p.volunteeringInterest) {
    return t('Vous engager pour une cause qui compte.', 'Get involved in a cause that matters.', locale)
  }
  if (has('creative') || has('culture')) return t('Créer et vous faire plaisir.', 'Create and enjoy yourself.', locale)
  if (has('entrepreneurship')) return t('Lancer une petite activité.', 'Start a small activity.', locale)
  if (has('gardening') || has('home_project')) {
    return t('Jardiner, bricoler, embellir votre quotidien.', 'Garden, make and brighten your days.', locale)
  }
  return t('Découvrir ce qui vous fait envie.', 'Discover what you’d love to do.', locale)
}
