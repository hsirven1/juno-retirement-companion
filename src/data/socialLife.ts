import type {
  ResourceRecommendation,
  SocialPreferences,
  SocialResourceMeta,
} from '../types'
import { PATH_SOCIAL, THEME_SOCIAL } from './paths'

export const SOCIAL_SCREEN = {
  intro: 'social-intro',
  forms: 'social-forms',
  transition: 'social-transition',
  goals: 'social-goals',
  style: 'social-style',
  connection: 'social-connection',
  commitment: 'social-commitment',
  synthesis: 'social-synthesis',
  types: 'social-types',
  resources: 'social-resources',
} as const

export type SocialScreenId = (typeof SOCIAL_SCREEN)[keyof typeof SOCIAL_SCREEN]

export const socialScreenOrder: SocialScreenId[] = [
  SOCIAL_SCREEN.intro,
  SOCIAL_SCREEN.forms,
  SOCIAL_SCREEN.transition,
  SOCIAL_SCREEN.goals,
  SOCIAL_SCREEN.style,
  SOCIAL_SCREEN.connection,
  SOCIAL_SCREEN.commitment,
  SOCIAL_SCREEN.synthesis,
  SOCIAL_SCREEN.types,
  SOCIAL_SCREEN.resources,
]

export const socialMilestones = [
  { id: 'discover', label: 'Découvrir ce que je recherche' },
  { id: 'explore', label: 'Explorer une première piste' },
  { id: 'try', label: 'Essayer quelque chose' },
  { id: 'review', label: 'Faire le point' },
] as const

export const socialGoalOptions = [
  { id: 'proches', label: 'Voir mes proches plus souvent' },
  { id: 'nouvelles', label: 'Rencontrer de nouvelles personnes' },
  { id: 'reguliers', label: 'Avoir des rendez-vous réguliers' },
  { id: 'activite', label: 'Partager une activité avec d’autres' },
  { id: 'utile', label: 'Me sentir utile avec d’autres' },
  { id: 'rien', label: 'Rien de particulier pour le moment' },
]

export const socialForms = [
  {
    id: 'proches',
    title: 'Les proches',
    body: 'Famille, amis, personnes que vous connaissez déjà.',
  },
  {
    id: 'reguliers',
    title: 'Des rendez-vous réguliers',
    body: 'Un groupe, une activité ou un lieu que vous retrouvez régulièrement.',
  },
  {
    id: 'nouvelles',
    title: 'De nouvelles rencontres',
    body: 'Découvrir de nouvelles personnes autour d’un intérêt commun.',
  },
  {
    id: 'contribuer',
    title: 'Contribuer avec d’autres',
    body: 'Participer à une association, aider, transmettre ou s’engager.',
  },
]

export const emptySocialPreferences = (): SocialPreferences => ({
  goals: [],
  preferredGroupSize: null,
  preferredFrequency: null,
  preferredContext: null,
  preferredContexts: [],
  connectionPreference: null,
  commitmentPreference: null,
  exploredTypeId: null,
  previousWorkSocialNeeds: [],
  workSocialChange: null,
  socialFormInterests: [],
  scenarioInvitation: null,
  scenarioWhy: [],
  idealWeekMoments: null,
  idealWeekActivities: [],
  opportunityTypeFeedback: {},
  selectedResourceId: null,
  selectedActionLabel: null,
})

export interface SocialOpportunityType {
  id: string
  title: string
  description: string
  filterTags: string[]
}

export interface LilleSocialResource extends ResourceRecommendation {
  social: SocialResourceMeta
}

export const lilleSocialResources: LilleSocialResource[] = [
  {
    id: 'lille-espace-seniors',
    category: 'social',
    categoryLabel: 'Atelier',
    discoverFilter: 'meet',
    title: 'Espace seniors Lille-Centre',
    description:
      'Des activités régulières en groupe : yoga, poterie, chorale, danse et autres ateliers.',
    homeSnippet:
      'Une piste pour rencontrer du monde autour d’une activité régulière.',
    personalizationReason:
      'Vous cherchez à rencontrer de nouvelles personnes autour d’une activité régulière.',
    location: 'Lille',
    metadata: 'Lille-Centre · Activités',
    sourceName: 'Ville de Lille',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_SOCIAL],
    social: {
      groupSize: 'medium',
      frequency: 'regular',
      context: 'activity',
      commitment: 'flexible',
      connection: 'new',
      tags: ['Régulier', 'Groupe', 'Activités variées'],
    },
  },
  {
    id: 'lille-marche-nordique',
    category: 'sport',
    categoryLabel: 'Activité',
    discoverFilter: 'move',
    title: 'Marche nordique du mardi',
    description:
      'Un petit groupe se retrouve chaque semaine pour une marche d’environ une heure dans les parcs lillois.',
    homeSnippet: 'Un rendez-vous régulier, en petit groupe, autour du mouvement.',
    personalizationReason:
      'Un format simple pour rencontrer du monde sans un engagement trop lourd.',
    location: 'Lille',
    metadata: 'Lille · Petit groupe',
    sourceName: 'Club marche Lille',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_SOCIAL],
    social: {
      groupSize: 'small',
      frequency: 'regular',
      context: 'activity',
      commitment: 'regular',
      connection: 'new',
      tags: ['Petit groupe', 'Régulier', 'Plein air'],
    },
  },
  {
    id: 'lille-association-lecture',
    category: 'culture',
    categoryLabel: 'Association',
    discoverFilter: 'learn',
    title: 'Cercle de lecture du Vieux-Lille',
    description:
      'Une fois par mois, un groupe discute d’un livre choisi ensemble. Accueil des nouveaux sans inscription annuelle.',
    homeSnippet: 'Partager un intérêt, sans se voir trop souvent.',
    personalizationReason:
      'Idéal si vous aimez les échanges autour d’une activité, à un rythme souple.',
    location: 'Lille',
    metadata: 'Vieux-Lille · Culture',
    sourceName: 'Association Lire ensemble',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_SOCIAL],
    social: {
      groupSize: 'small',
      frequency: 'occasional',
      context: 'activity',
      commitment: 'punctual',
      connection: 'new',
      tags: ['Petit groupe', 'Ponctuel', 'Culture'],
    },
  },
  {
    id: 'lille-benevolat-jardin',
    category: 'volunteering',
    categoryLabel: 'Bénévolat',
    discoverFilter: 'engage',
    title: 'Jardin partagé des Bois-Blancs',
    description:
      'Entretenir un jardin collectif et rencontrer des voisins autour d’un projet concret.',
    homeSnippet: 'Contribuer avec d’autres, autour d’un projet local.',
    personalizationReason:
      'Une façon de croiser des gens tout en participant à quelque chose d’utile.',
    location: 'Lille',
    metadata: 'Bois-Blancs · Projet',
    sourceName: 'Association Jardins partagés',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_SOCIAL],
    social: {
      groupSize: 'medium',
      frequency: 'regular',
      context: 'project',
      commitment: 'flexible',
      connection: 'both',
      tags: ['Projet', 'Utile', 'Local'],
    },
  },
  {
    id: 'lille-atelier-cuisine',
    category: 'learning',
    categoryLabel: 'Atelier',
    discoverFilter: 'learn',
    title: 'Ateliers cuisine du mercredi',
    description:
      'Cuisiner ensemble, puis partager le repas. Groupes limités à 8 personnes.',
    homeSnippet: 'Apprendre quelque chose en petit groupe.',
    personalizationReason:
      'Un cadre naturel pour rencontrer du monde autour d’une activité concrète.',
    location: 'Lille',
    metadata: 'Lille · Petit groupe',
    sourceName: 'Maison de quartier',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_SOCIAL],
    social: {
      groupSize: 'small',
      frequency: 'regular',
      context: 'activity',
      commitment: 'punctual',
      connection: 'new',
      tags: ['Petit groupe', 'Activité', 'Régulier'],
    },
  },
  {
    id: 'lille-sortie-musee',
    category: 'culture',
    categoryLabel: 'Sortie',
    discoverFilter: 'meet',
    title: 'Sorties musée du Palais des Beaux-Arts',
    description:
      'Visites commentées ponctuelles, ouvertes à tous. Idéal pour commencer sans engagement.',
    homeSnippet: 'Une première sortie collective, sans engagement.',
    personalizationReason:
      'Parfait pour essayer une rencontre légère avant de s’engager davantage.',
    location: 'Lille',
    metadata: 'Lille · Culture',
    sourceName: 'Palais des Beaux-Arts',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_SOCIAL],
    social: {
      groupSize: 'medium',
      frequency: 'occasional',
      context: 'activity',
      commitment: 'punctual',
      connection: 'new',
      tags: ['Ponctuel', 'Culture', 'Essayer'],
    },
  },
  {
    id: 'lille-cafe-rencontre',
    category: 'social',
    categoryLabel: 'Rencontre',
    discoverFilter: 'meet',
    title: 'Café-rencontre Wazemmes',
    description:
      'Un café ouvert le jeudi après-midi pour discuter librement. Sans inscription.',
    homeSnippet: 'Passer du temps ensemble, simplement.',
    personalizationReason:
      'Si vous préférez les échanges informels aux activités structurées.',
    location: 'Lille',
    metadata: 'Wazemmes · Rencontre',
    sourceName: 'Maison des associations',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_SOCIAL],
    social: {
      groupSize: 'any',
      frequency: 'occasional',
      context: 'together',
      commitment: 'punctual',
      connection: 'both',
      tags: ['Informel', 'Ponctuel', 'Ouvert'],
    },
  },
  {
    id: 'lille-chorale',
    category: 'culture',
    categoryLabel: 'Activité',
    discoverFilter: 'meet',
    title: 'Chorale amateurs de Lille-Sud',
    description:
      'Répétitions hebdomadaires. Aucune expérience requise. Ambiance conviviale.',
    homeSnippet: 'Un rendez-vous régulier autour d’une passion partagée.',
    personalizationReason:
      'Retrouver régulièrement les mêmes personnes autour d’une activité.',
    location: 'Lille',
    metadata: 'Lille-Sud · Musique',
    sourceName: 'Association Voix du Sud',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_SOCIAL],
    social: {
      groupSize: 'medium',
      frequency: 'regular',
      context: 'activity',
      commitment: 'regular',
      connection: 'new',
      tags: ['Régulier', 'Activité', 'Groupe'],
    },
  },
  {
    id: 'lille-bridge-club',
    category: 'social',
    categoryLabel: 'Club',
    discoverFilter: 'meet',
    title: 'Club de bridge du centre',
    description:
      'Parties en après-midi, en petits groupes. Possibilité de venir essayer deux séances.',
    homeSnippet: 'Un petit groupe régulier, autour d’un jeu.',
    personalizationReason:
      'Convient bien si vous aimez un cadre stable et un engagement progressif.',
    location: 'Lille',
    metadata: 'Lille · Petit groupe',
    sourceName: 'Club bridge Lille',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_SOCIAL],
    social: {
      groupSize: 'small',
      frequency: 'regular',
      context: 'activity',
      commitment: 'flexible',
      connection: 'new',
      tags: ['Petit groupe', 'Régulier', 'Essayer'],
    },
  },
  {
    id: 'lille-famille-diner',
    category: 'social',
    categoryLabel: 'Proches',
    discoverFilter: 'meet',
    title: 'Idée : un déjeuner mensuel en famille',
    description:
      'Pas une structure : une piste personnelle pour retrouver vos proches plus régulièrement.',
    homeSnippet: 'Cultiver les liens que vous avez déjà.',
    personalizationReason:
      'Si vous souhaitez surtout voir davantage les personnes que vous connaissez déjà.',
    location: 'Lille',
    metadata: 'Personnel · Proches',
    sourceName: 'Juno',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_SOCIAL],
    social: {
      groupSize: 'small',
      frequency: 'occasional',
      context: 'together',
      commitment: 'punctual',
      connection: 'existing',
      tags: ['Proches', 'Souple', 'Personnel'],
    },
  },
]

export function buildSocialSynthesis(prefs: SocialPreferences): {
  paragraphs: string[]
  tags: string[]
} {
  const tags: string[] = []
  const paragraphs: string[] = []

  const wantsNew = prefs.goals.includes('nouvelles') || prefs.connectionPreference === 'new'
  const wantsExisting =
    prefs.goals.includes('proches') || prefs.connectionPreference === 'existing'
  const wantsBoth = prefs.connectionPreference === 'both'
  const activity =
    prefs.preferredContext === 'activity' || prefs.goals.includes('activite')
  const regular =
    prefs.preferredFrequency === 'regular' || prefs.goals.includes('reguliers')
  const small = prefs.preferredGroupSize === 'small'

  if (wantsNew || wantsBoth) {
    tags.push('Nouvelles rencontres')
    if (activity) {
      paragraphs.push(
        'Vous aimeriez rencontrer de nouvelles personnes, mais plutôt dans un cadre naturel : une activité ou un projet partagé.',
      )
    } else if (prefs.preferredContext === 'together') {
      paragraphs.push(
        'Vous aimeriez croiser de nouvelles personnes, dans un cadre simple et convivial.',
      )
    } else {
      paragraphs.push(
        'Vous aimeriez élargir un peu votre cercle, à votre rythme.',
      )
    }
  } else if (wantsExisting) {
    tags.push('Proches')
    paragraphs.push(
      'Vous souhaitez surtout cultiver les liens que vous avez déjà — famille, amis, relations de confiance.',
    )
  } else {
    paragraphs.push(
      'Vous cherchez une vie sociale qui vous ressemble, sans forcément la remplir.',
    )
  }

  if (small) tags.push('Petit groupe')
  if (regular) tags.push('Régulier')
  if (activity) tags.push('Autour d’une activité')
  if (prefs.preferredContext === 'project') tags.push('Projet ou cause')
  if (prefs.commitmentPreference === 'punctual') tags.push('Ponctuel')
  if (prefs.commitmentPreference === 'try') tags.push('Essayer d’abord')

  if (small && regular) {
    paragraphs.push(
      'Un petit groupe que vous retrouvez régulièrement pourrait bien vous convenir.',
    )
  } else if (prefs.commitmentPreference === 'try' || prefs.commitmentPreference === 'punctual') {
    paragraphs.push(
      'Commencer par quelque chose de léger, pour essayer avant de vous engager davantage, semble vous convenir.',
    )
  }

  if (paragraphs.length === 0) {
    paragraphs.push(
      'Vous avancez vers une vie sociale choisie — ni trop remplie, ni imposée.',
    )
  }

  return { paragraphs, tags: [...new Set(tags)].slice(0, 5) }
}

export { PATH_SOCIAL, THEME_SOCIAL }
