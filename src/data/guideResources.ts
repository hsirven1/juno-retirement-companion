import type { Locale } from '../i18n/types'
import type { PillarId, ResourceKind, ResourceMatchMeta } from '../types'

type Localized = Record<Locale, string>

/**
 * National information resources (official / public-interest websites).
 * General information only — never personalised financial or medical advice.
 */
export interface GuideResource {
  id: string
  kind: Extract<ResourceKind, 'guide' | 'tool' | 'article' | 'organization'>
  pillarIds: PillarId[]
  title: Localized
  description: Localized
  whyUseful: Localized
  sourceName: string
  url: string
  /** Retirement stages, needs, activities… used for matching. */
  match: ResourceMatchMeta
  tags: string[]
}

export const guideResources: GuideResource[] = [
  {
    id: 'guide-info-retraite',
    kind: 'tool',
    pillarIds: ['financial'],
    title: {
      fr: 'Consulter votre carrière et estimer votre retraite',
      en: 'Check your career record and estimate your pension',
    },
    description: {
      fr: 'Le service public inter-régimes permet de vérifier votre relevé de carrière, d’obtenir une estimation de votre retraite et de faire votre demande en ligne.',
      en: 'The official cross-scheme service lets you check your career record, get a pension estimate and apply online.',
    },
    whyUseful: {
      fr: 'Un point de départ fiable pour vérifier votre situation avant ou juste après le départ.',
      en: 'A reliable starting point to check your situation before or just after you retire.',
    },
    sourceName: 'Info Retraite',
    url: 'https://www.info-retraite.fr',
    match: {
      financialNeeds: ['retirement_application', 'pension_income'],
      retirementStages: ['still_working', 'retiring_soon', 'recently_retired'],
    },
    tags: ['admin', 'pension'],
  },
  {
    id: 'guide-assurance-retraite',
    kind: 'guide',
    pillarIds: ['financial'],
    title: {
      fr: 'Préparer votre départ à la retraite',
      en: 'Prepare for your retirement date',
    },
    description: {
      fr: 'Les étapes clés, le calendrier et les démarches à anticiper, expliqués par l’Assurance retraite.',
      en: 'Key steps, timing and paperwork to plan ahead, explained by the national pension fund.',
    },
    whyUseful: {
      fr: 'Utile pour savoir quoi faire, et quand, dans les mois qui précèdent le départ.',
      en: 'Helpful to know what to do, and when, in the months before you retire.',
    },
    sourceName: 'L’Assurance retraite',
    url: 'https://www.lassuranceretraite.fr',
    match: {
      financialNeeds: ['retirement_application'],
      retirementStages: ['still_working', 'retiring_soon'],
    },
    tags: ['admin', 'timeline'],
  },
  {
    id: 'guide-mes-droits-sociaux',
    kind: 'tool',
    pillarIds: ['financial'],
    title: {
      fr: 'Vérifier les aides auxquelles vous pourriez avoir droit',
      en: 'Check which benefits you may be entitled to',
    },
    description: {
      fr: 'Un simulateur officiel pour repérer les prestations et aides sociales possibles selon votre situation.',
      en: 'An official simulator to spot possible benefits and social support based on your situation.',
    },
    whyUseful: {
      fr: 'Certaines aides restent peu connues : quelques minutes suffisent pour faire le point.',
      en: 'Some support is little known — a few minutes is enough to check.',
    },
    sourceName: 'Mes droits sociaux',
    url: 'https://www.mesdroitssociaux.gouv.fr',
    match: { financialNeeds: ['entitlements'] },
    tags: ['benefits', 'simulator'],
  },
  {
    id: 'guide-mes-questions-argent',
    kind: 'guide',
    pillarIds: ['financial'],
    title: {
      fr: 'Budget, épargne, placements : les bases',
      en: 'Budgeting, savings and investing: the basics',
    },
    description: {
      fr: 'Le portail public d’éducation financière pour comprendre son budget, l’épargne et les grands types de placements, sans démarchage.',
      en: 'The public financial-education portal to understand budgeting, savings and the main types of investments, with no sales pitch.',
    },
    whyUseful: {
      fr: 'Des repères neutres pour ajuster votre budget à vos nouveaux revenus.',
      en: 'Neutral pointers to adjust your budget to your new income.',
    },
    sourceName: 'Mes questions d’argent (Banque de France)',
    url: 'https://www.mesquestionsdargent.fr',
    match: { financialNeeds: ['budget', 'savings', 'investing'] },
    tags: ['budget', 'savings'],
  },
  {
    id: 'guide-service-public-retraite',
    kind: 'guide',
    pillarIds: ['financial'],
    title: {
      fr: 'Vos droits et démarches à la retraite',
      en: 'Your rights and formalities in retirement',
    },
    description: {
      fr: 'Les fiches officielles sur la retraite : cumul emploi-retraite, pension de réversion, fiscalité et démarches courantes.',
      en: 'Official guidance on retirement: working while retired, survivor’s pension, tax and common formalities.',
    },
    whyUseful: {
      fr: 'Pratique pour vérifier une règle ou une démarche précise.',
      en: 'Handy to check a specific rule or formality.',
    },
    sourceName: 'Service-Public.fr',
    url: 'https://www.service-public.fr',
    match: { financialNeeds: ['entitlements', 'pension_income', 'extra_income'] },
    tags: ['rights', 'work_in_retirement'],
  },
  {
    id: 'guide-notaires-transmission',
    kind: 'guide',
    pillarIds: ['financial'],
    title: {
      fr: 'Comprendre la transmission et la succession',
      en: 'Understand inheritance and passing on assets',
    },
    description: {
      fr: 'Donation, testament, logement : les notions essentielles expliquées par les notaires de France.',
      en: 'Gifts, wills, property: the essentials explained by French notaries.',
    },
    whyUseful: {
      fr: 'Pour vous familiariser avec le sujet avant d’en parler avec un professionnel.',
      en: 'To get familiar with the topic before discussing it with a professional.',
    },
    sourceName: 'Notaires de France',
    url: 'https://www.notaires.fr',
    match: { financialNeeds: ['inheritance', 'property'] },
    tags: ['inheritance', 'housing'],
  },
  {
    id: 'guide-manger-bouger',
    kind: 'guide',
    pillarIds: ['health'],
    title: {
      fr: 'Des idées simples pour bouger plus au quotidien',
      en: 'Simple ideas to move more every day',
    },
    description: {
      fr: 'Conseils pratiques de Santé publique France pour intégrer plus de mouvement dans vos journées, à votre rythme.',
      en: 'Practical tips from the French public health agency to fit more movement into your days, at your own pace.',
    },
    whyUseful: {
      fr: 'Des repères accessibles, sans programme sportif ni matériel.',
      en: 'Accessible pointers — no sports programme or equipment needed.',
    },
    sourceName: 'Manger Bouger (Santé publique France)',
    url: 'https://www.mangerbouger.fr',
    match: {
      activityLevels: ['low', 'moderate'],
      physicalGoals: ['move_more', 'stay_active'],
      physicalActivities: ['walking'],
    },
    tags: ['movement', 'everyday'],
  },
  {
    id: 'guide-micro-entreprise',
    kind: 'guide',
    pillarIds: ['financial', 'projects'],
    title: {
      fr: 'Lancer une petite activité en micro-entreprise',
      en: 'Start a small activity as a micro-entrepreneur',
    },
    description: {
      fr: 'Le portail officiel de l’Urssaf pour comprendre le statut de micro-entrepreneur, les démarches de création et les cotisations.',
      en: 'The official Urssaf portal explaining the micro-entrepreneur status, how to register and what contributions apply.',
    },
    whyUseful: {
      fr: 'Un cadre simple pour tester une activité et compléter vos revenus.',
      en: 'A simple framework to try out an activity and top up your income.',
    },
    sourceName: 'Urssaf — autoentrepreneur',
    url: 'https://www.autoentrepreneur.urssaf.fr',
    match: {
      financialNeeds: ['extra_income'],
      projectTypes: ['entrepreneurship'],
    },
    tags: ['work_in_retirement', 'admin'],
  },
  {
    id: 'guide-maisons-sport-sante',
    kind: 'guide',
    pillarIds: ['health'],
    title: {
      fr: 'Reprendre une activité physique avec un accompagnement',
      en: 'Get back into physical activity with support',
    },
    description: {
      fr: 'Les Maisons Sport-Santé accompagnent les personnes qui souhaitent (re)commencer une activité physique encadrée, près de chez elles.',
      en: 'Maisons Sport-Santé help people who want to start (or restart) supervised physical activity close to home.',
    },
    whyUseful: {
      fr: 'Idéal pour reprendre en douceur, avec des conseils adaptés à votre rythme.',
      en: 'Ideal for easing back in, with advice suited to your pace.',
    },
    sourceName: 'Ministère des Sports',
    url: 'https://www.sports.gouv.fr',
    match: {
      activityLevels: ['low', 'moderate'],
      physicalGoals: ['move_more', 'strength', 'flexibility'],
      physicalActivities: ['group_exercise', 'gym'],
    },
    tags: ['movement', 'fitness'],
  },
  {
    id: 'guide-ffrandonnee',
    kind: 'organization',
    pillarIds: ['health', 'social'],
    title: {
      fr: 'Trouver un club de randonnée près de chez vous',
      en: 'Find a walking club near you',
    },
    description: {
      fr: 'La Fédération française de randonnée recense les clubs et les sorties organisées partout en France, de la balade à la randonnée sportive.',
      en: 'The French hiking federation lists clubs and organised walks across France, from gentle strolls to more demanding hikes.',
    },
    whyUseful: {
      fr: 'Marcher en groupe, à votre niveau, avec des sorties régulières.',
      en: 'Walk with a group, at your level, with regular outings.',
    },
    sourceName: 'Fédération française de randonnée',
    url: 'https://www.ffrandonnee.fr',
    match: {
      activityLevels: ['low', 'moderate', 'active'],
      physicalActivities: ['walking', 'outdoor'],
      physicalGoals: ['stay_active'],
      socialGoals: ['group_activities', 'new_friends'],
      recurring: true,
    },
    tags: ['hiking', 'outdoor'],
  },
  {
    id: 'guide-ffnatation',
    kind: 'organization',
    pillarIds: ['health'],
    title: {
      fr: 'Trouver un club de natation ou d’aquaforme',
      en: 'Find a swimming or aqua fitness club',
    },
    description: {
      fr: 'La Fédération française de natation permet de trouver un club proposant natation adulte, aquagym ou nage santé.',
      en: 'The French swimming federation helps you find a club offering adult swimming, aqua fitness or wellbeing swimming.',
    },
    whyUseful: {
      fr: 'Une activité complète et douce pour les articulations, en groupe encadré.',
      en: 'A complete activity that is gentle on the joints, in a supervised group.',
    },
    sourceName: 'Fédération française de natation',
    url: 'https://www.ffnatation.fr',
    match: {
      activityLevels: ['low', 'moderate', 'active'],
      physicalActivities: ['swimming'],
      physicalGoals: ['stay_active', 'strength', 'flexibility'],
      recurring: true,
    },
    tags: ['sport', 'fitness'],
  },
]
