import type { Locale } from '../i18n/types'
import type {
  FinancialNeed,
  PhysicalActivity,
  PhysicalGoal,
  ProjectType,
  SocialGoal,
} from '../types'

type Text = Record<Locale, string>

export const FINANCIAL_NEED_REASON: Record<FinancialNeed, Text> = {
  retirement_application: {
    fr: 'Pour préparer votre demande de retraite.',
    en: 'To help you prepare your retirement application.',
  },
  entitlements: {
    fr: 'Pour vérifier les droits et aides auxquels vous pourriez prétendre.',
    en: 'To check which entitlements and support you may be eligible for.',
  },
  pension_income: {
    fr: 'Pour mieux comprendre vos revenus à la retraite.',
    en: 'To better understand your retirement income.',
  },
  budget: {
    fr: 'Pour vous aider à organiser votre budget.',
    en: 'To help you organise your budget.',
  },
  savings: {
    fr: 'Pour y voir plus clair sur votre épargne.',
    en: 'To get a clearer view of your savings.',
  },
  investing: {
    fr: 'Pour comprendre les bases de l’investissement.',
    en: 'To understand the basics of investing.',
  },
  property: {
    fr: 'En lien avec vos questions sur le logement.',
    en: 'Related to your questions about housing.',
  },
  inheritance: {
    fr: 'Pour vous informer sur la transmission.',
    en: 'To learn more about passing on your assets.',
  },
  extra_income: {
    fr: 'Pour explorer des pistes de revenus complémentaires.',
    en: 'To explore ways of earning some extra income.',
  },
}

export const PHYSICAL_ACTIVITY_REASON: Record<PhysicalActivity, Text> = {
  walking: { fr: 'Vous aimez la marche.', en: 'You enjoy walking.' },
  swimming: { fr: 'Vous aimez nager.', en: 'You enjoy swimming.' },
  group_exercise: {
    fr: 'Vous aimez les activités en groupe.',
    en: 'You enjoy exercising in a group.',
  },
  gym: { fr: 'Vous aimez le renforcement.', en: 'You enjoy strength work.' },
  outdoor: { fr: 'Vous aimez être dehors.', en: 'You enjoy being outdoors.' },
  cycling: { fr: 'Vous aimez le vélo.', en: 'You enjoy cycling.' },
  dance: { fr: 'Vous aimez danser.', en: 'You enjoy dancing.' },
}

export const PHYSICAL_GOAL_REASON: Record<PhysicalGoal, Text> = {
  move_more: {
    fr: 'Pour bouger un peu plus, comme vous le souhaitez.',
    en: 'To move a little more, as you’d like.',
  },
  stay_active: {
    fr: 'Pour garder la forme.',
    en: 'To help you stay active.',
  },
  strength: {
    fr: 'Pour travailler votre force et votre équilibre.',
    en: 'To work on strength and balance.',
  },
  flexibility: {
    fr: 'Pour gagner en souplesse.',
    en: 'To gain flexibility.',
  },
  try_new_sport: {
    fr: 'Pour essayer une nouvelle activité.',
    en: 'To try a new activity.',
  },
}

export const SOCIAL_GOAL_REASON: Record<SocialGoal, Text> = {
  maintain_relationships: {
    fr: 'Pour entretenir vos liens.',
    en: 'To keep your connections going.',
  },
  new_friends: {
    fr: 'Pour rencontrer de nouvelles personnes.',
    en: 'To meet new people.',
  },
  group_activities: {
    fr: 'Pour partager une activité en groupe.',
    en: 'To share an activity with a group.',
  },
  outing_companions: {
    fr: 'Pour trouver des compagnons de sortie.',
    en: 'To find people to go out with.',
  },
  partner: {
    fr: 'Pour élargir vos occasions de rencontre.',
    en: 'To widen your chances of meeting someone.',
  },
  regular_occasions: {
    fr: 'Pour avoir des rendez-vous réguliers.',
    en: 'To have regular get-togethers.',
  },
}

export const PROJECT_REASON: Record<ProjectType, Text> = {
  travel: { fr: 'En lien avec votre envie de voyager.', en: 'Linked to your wish to travel.' },
  volunteering: {
    fr: 'En lien avec votre envie de vous engager.',
    en: 'Linked to your wish to get involved.',
  },
  language: {
    fr: 'Pour apprendre une langue.',
    en: 'To learn a language.',
  },
  courses: {
    fr: 'En lien avec votre envie d’apprendre.',
    en: 'Linked to your wish to learn.',
  },
  gardening: { fr: 'Vous aimez le jardinage.', en: 'You enjoy gardening.' },
  home_project: {
    fr: 'Pour vos projets maison et bricolage.',
    en: 'For your home and DIY projects.',
  },
  creative: {
    fr: 'En lien avec votre envie de créer.',
    en: 'Linked to your wish to create.',
  },
  culture: { fr: 'Vous aimez la culture.', en: 'You enjoy culture.' },
  entrepreneurship: {
    fr: 'Pour votre envie de lancer une activité.',
    en: 'For your wish to start something.',
  },
  personal_project: {
    fr: 'Pour avancer sur un projet personnel.',
    en: 'To move forward with a personal project.',
  },
  lifelong_dream: {
    fr: 'Pour réaliser un projet qui vous tient à cœur.',
    en: 'To pursue a project close to your heart.',
  },
}

export const GENERIC_REASON = {
  preRetirement: {
    fr: 'Utile à l’approche de la retraite.',
    en: 'Useful as retirement approaches.',
  },
  lowBarrier: {
    fr: 'Facile à rejoindre, même sans connaître personne.',
    en: 'Easy to join, even if you don’t know anyone.',
  },
  recurring: {
    fr: 'Un rendez-vous régulier pour rythmer la semaine.',
    en: 'A regular fixture to give your week some rhythm.',
  },
  exploratory: {
    fr: 'Pour découvrir de nouvelles choses.',
    en: 'To discover something new.',
  },
  gentle: {
    fr: 'Pour reprendre une activité à votre rythme.',
    en: 'To get moving again at your own pace.',
  },
} satisfies Record<string, Text>
