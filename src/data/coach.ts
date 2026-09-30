import type { ChatAction, ChatMessage, PlanSuggestion } from '../types'
import { PATH_TRANSMETTRE, THEME_TRANSMETTRE } from './paths'

const mentoringSuggestion: PlanSuggestion = {
  id: 'explore-mentoring',
  title: 'Explorer le mentorat',
  description:
    'Essayez une piste de mentorat, sans vous engager sur la durée.',
  taskLabel: 'Explorer une possibilité de mentorat',
  priorityId: PATH_TRANSMETTRE,
}

export interface CoachReply {
  content: string
  suggestion?: PlanSuggestion
  action?: ChatAction
}

export interface SuggestionPill {
  label: string
  message: string
}

export const suggestionPills: SuggestionPill[] = [
  {
    label: 'Trouver une activité régulière',
    message: 'J’aimerais trouver une activité régulière.',
  },
  {
    label: 'Explorer le mentorat',
    message: 'J’aimerais explorer le mentorat.',
  },
  {
    label: 'Rencontrer davantage de monde',
    message: 'J’aimerais rencontrer davantage de monde.',
  },
  {
    label: 'Trouver une association',
    message: 'J’aimerais trouver une association près de chez moi.',
  },
  {
    label: 'Voir mes prochaines étapes',
    message: 'Quelles sont mes prochaines étapes ?',
  },
]

const replies: Record<string, CoachReply> = {
  'j’aimerais trouver une activité régulière.': {
    content:
      'Bien sûr. Vous m’avez dit aimer le vélo, préférer les petits groupes et vouloir sortir davantage en semaine.\n\nJ’ai quelques pistes qui pourraient vous correspondre — et votre parcours « Rester actif » peut vous y accompagner.',
    action: {
      label: 'Voir les activités recommandées',
      to: '/discover',
    },
  },
  'j’aimerais explorer le mentorat.': {
    content:
      'Vous m’avez dit aimer transmettre votre expérience. Je peux vous montrer quelques façons de faire du mentorat, et les associations sélectionnées près de Lyon.',
    suggestion: mentoringSuggestion,
    action: {
      label: 'Voir les ressources',
      to: '/discover',
    },
  },
  'j’aimerais rencontrer davantage de monde.': {
    content:
      'Vous avez déjà des liens solides. Ce qui manque, c’est un peu plus de compagnie en semaine — pas un agenda social chargé.\n\nVotre parcours « Cultiver ma vie sociale » peut vous y aider, étape par étape.',
    action: {
      label: 'Explorer les rencontres',
      to: '/discover',
    },
  },
  'j’aimerais trouver une association près de chez moi.': {
    content:
      'D’accord. Autour de Lille, plusieurs associations correspondent à vos envies — mentorat, activité, rencontres.\n\nVous les trouverez dans Explorer.',
    action: {
      label: 'Ouvrir Découvrir',
      to: '/discover',
    },
  },
  'quelles sont mes prochaines étapes ?': {
    content:
      'Cette semaine, vos prochaines étapes viennent de vos parcours actifs — notamment votre rythme et la transmission de votre expérience.\n\nElles sont sur votre Accueil. On peut en choisir une ensemble.',
    action: {
      label: 'Retour à mon Accueil',
      to: '/home',
    },
  },
}

const defaultReply: CoachReply = {
  content:
    'Ça mérite qu’on s’y arrête. D’après votre bilan, vous avancez surtout sur votre rythme, le fait de rester actif, et la transmission de votre expérience.\n\nQu’est-ce qui vous serait le plus utile, là, maintenant ?',
}

function normalize(text: string) {
  return text.trim().toLowerCase().replace(/['’]/g, "'")
}

const repliesByKey: Record<string, CoachReply> = Object.fromEntries(
  Object.entries(replies).map(([prompt, reply]) => [normalize(prompt), reply]),
)

export function getCoachReply(userText: string): CoachReply {
  return repliesByKey[normalize(userText)] ?? defaultReply
}

export function createMessage(
  role: ChatMessage['role'],
  content: string,
  suggestion?: PlanSuggestion,
  action?: ChatAction,
): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    suggestion,
    suggestionStatus: suggestion ? 'pending' : undefined,
    action,
  }
}

export function getContextualGreeting(options?: {
  initialContext?: string
  relatedPriorityId?: string
  relatedPathId?: string
  greeting?: string
  firstName?: string
}): string {
  if (options?.greeting) return options.greeting

  if (
    options?.relatedPathId === 'path-social' ||
    options?.initialContext === 'social'
  ) {
    return 'Vous hésitez sur le type de vie sociale qui vous conviendrait ? On peut y réfléchir ensemble.'
  }

  if (
    options?.relatedPathId === 'path-rythme' ||
    options?.initialContext === 'rythme'
  ) {
    return 'Vous voulez qu’on réfléchisse ensemble à ce qui pourrait donner un peu de structure à vos semaines ?'
  }

  if (
    options?.relatedPathId === PATH_TRANSMETTRE ||
    options?.relatedPriorityId === THEME_TRANSMETTRE ||
    options?.initialContext === 'mentoring' ||
    options?.initialContext === 'transmettre'
  ) {
    return 'Vous voulez parler des possibilités de mentorat ?'
  }

  if (
    options?.initialContext === 'activity' ||
    options?.relatedPathId === 'path-actif'
  ) {
    return 'Vous voulez avancer sur une activité régulière ?'
  }

  const name = options?.firstName ?? 'Harold'
  return `Bonjour ${name}. Sur quoi voulez-vous avancer aujourd’hui ?`
}
