import type { ResourceRecommendation } from '../types'
import {
  THEME_ACTIF,
  THEME_ENVIES,
  THEME_SOCIAL,
  THEME_TRANSMETTRE,
} from './paths'

export const initialResources: ResourceRecommendation[] = [
  {
    id: 'lyon-mentoring',
    category: 'volunteering',
    categoryLabel: 'S’engager',
    discoverFilter: 'engage',
    title: 'Mentorat de jeunes entrepreneurs',
    description:
      'Cette association met en relation des professionnels expérimentés avec de jeunes porteurs de projets, sans engagement de longue durée.',
    homeSnippet:
      'Une piste pour continuer à transmettre votre expérience.',
    personalizationReason:
      'Vous nous avez dit aimer transmettre votre expérience et accompagner de jeunes collègues.',
    location: 'Lyon',
    metadata: 'Lyon · Bénévolat',
    sourceName: 'Réseau mentorat Lyon',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_TRANSMETTRE],
  },
  {
    id: 'lyon-cycling',
    category: 'sport',
    categoryLabel: 'Bouger',
    discoverFilter: 'move',
    title: 'Sorties vélo en semaine',
    description:
      'Un groupe organise des sorties tranquilles le jeudi matin. Le rythme est souple : on peut venir une semaine, pas la suivante.',
    homeSnippet:
      'Un petit groupe régulier qui correspond à votre intérêt pour le vélo.',
    personalizationReason:
      'Vous aimez déjà le vélo et cherchez une activité régulière en semaine, en petit groupe.',
    location: 'Lyon',
    metadata: 'Lyon · Activité',
    sourceName: 'Club cyclo Lyon 6e',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_ACTIF, THEME_SOCIAL],
  },
  {
    id: 'lyon-walking',
    category: 'sport',
    categoryLabel: 'Bouger',
    discoverFilter: 'move',
    title: 'Marches commentées autour de Lyon',
    description:
      'Des balades guidées en semaine, sur le patrimoine et les quartiers. Environ deux heures, petit groupe.',
    homeSnippet:
      'Bouger et apprendre quelque chose, en petit groupe.',
    personalizationReason:
      'Une façon de bouger et d’apprendre quelque chose — deux choses que vous appréciez.',
    location: 'Lyon',
    metadata: 'Lyon · Marche',
    sourceName: 'Balades lyonnaises',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_ACTIF],
  },
  {
    id: 'lyon-cafe',
    category: 'social',
    categoryLabel: 'Rencontrer',
    discoverFilter: 'meet',
    title: 'Café des anciens de l’industrie',
    description:
      'Une table le mercredi, sans inscription. Des gens qui aiment parler de ce qu’ils ont fait — et de ce qu’ils font maintenant.',
    homeSnippet:
      'Une rencontre légère pour voir un peu plus de monde en semaine.',
    personalizationReason:
      'Une rencontre légère, sans grand groupe organisé, pour voir un peu plus de monde.',
    location: 'Lyon 2e',
    metadata: 'Lyon · Rencontre',
    sourceName: 'Café industrie',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_SOCIAL],
  },
  {
    id: 'lyon-history',
    category: 'learning',
    categoryLabel: 'Apprendre',
    discoverFilter: 'learn',
    title: 'Cycle de conférences d’histoire',
    description:
      'Un petit cycle en semaine sur l’histoire de Lyon et de la région. Pas besoin de s’engager pour toute l’année.',
    homeSnippet:
      'Apprendre quelque chose, sans les grands groupes.',
    personalizationReason:
      'Vous aimez apprendre, et les activités où l’on découvre quelque chose vous conviennent mieux que les grands groupes.',
    location: 'Lyon',
    metadata: 'Lyon · Culture',
    sourceName: 'Université populaire',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_SOCIAL, THEME_ENVIES],
  },
  {
    id: 'travel-group',
    category: 'travel',
    categoryLabel: 'Voyager',
    discoverFilter: 'travel',
    title: 'Voyages en petit groupe pour seniors actifs',
    description:
      'Des séjours organisés en petits groupes, avec un rythme confortable. Une piste si vous souhaitez voyager davantage sans tout organiser seul.',
    homeSnippet:
      'Voyager davantage, sans tout organiser seul.',
    personalizationReason:
      'Vous avez envie de voyager davantage, sans forcément planifier chaque détail vous-même.',
    location: 'France / Europe',
    metadata: 'Voyage · Petit groupe',
    sourceName: 'Voyages Compagnons',
    externalUrl: '#',
    saved: false,
    addedToPlan: false,
    themeIds: [THEME_ENVIES],
  },
]
