import type { ResourceMatchMeta } from '../types'

const seniorSpace: ResourceMatchMeta = {
  activityLevels: ['low', 'moderate'],
  physicalActivities: ['group_exercise'],
  physicalGoals: ['stay_active', 'flexibility'],
  socialGoals: ['new_friends', 'group_activities', 'regular_occasions'],
  projectTypes: ['courses'],
  recurring: true,
  lowBarrier: true,
}

const repairCafe: ResourceMatchMeta = {
  projectTypes: ['home_project', 'volunteering'],
  socialGoals: ['new_friends'],
  lowBarrier: true,
}

const sharedGarden: ResourceMatchMeta = {
  projectTypes: ['gardening'],
  physicalActivities: ['outdoor'],
  activityLevels: ['low', 'moderate'],
  socialGoals: ['new_friends'],
  lowBarrier: true,
}

/** Matching metadata for Lille records, keyed by resource id. */
export const LILLE_MATCH: Record<string, ResourceMatchMeta> = {
  'lille-senior-spaces-network': seniorSpace,
  'espace-seniors-lille-centre': {
    ...seniorSpace,
    projectTypes: ['courses', 'creative'],
  },
  'espace-seniors-vieux-lille': {
    ...seniorSpace,
    socialGoals: ['regular_occasions', 'group_activities'],
  },
  'espace-seniors-wazemmes': seniorSpace,
  'espace-seniors-lille-sud': seniorSpace,
  'espace-seniors-vauban': {
    ...seniorSpace,
    physicalActivities: ['dance'],
    projectTypes: ['creative'],
  },
  'espace-seniors-faubourg-bethune': seniorSpace,
  'sport-adultes-seniors-lille': {
    activityLevels: ['low', 'moderate', 'active'],
    physicalActivities: ['swimming', 'group_exercise', 'gym'],
    physicalGoals: ['move_more', 'stay_active', 'strength', 'try_new_sport'],
    socialGoals: ['group_activities'],
    recurring: true,
  },
  'digital-advisers-seniors': {
    financialNeeds: ['retirement_application', 'entitlements'],
    lowBarrier: true,
  },
  'animages-sorties': {
    socialGoals: ['outing_companions', 'new_friends'],
    physicalActivities: ['walking'],
    activityLevels: ['low', 'moderate'],
    projectTypes: ['culture'],
    exploratory: true,
    lowBarrier: true,
  },
  'animages-sejours': {
    socialGoals: ['outing_companions'],
    projectTypes: ['travel'],
    exploratory: true,
  },
  'pass-lille-moi-senior': {
    financialNeeds: ['budget'],
    lowBarrier: true,
  },
  'maison-lillages': {
    financialNeeds: ['property'],
    lowBarrier: true,
  },
  'utl-lille': {
    projectTypes: ['courses', 'language', 'culture'],
    socialGoals: ['regular_occasions', 'new_friends'],
    recurring: true,
  },
  'utl-photography-2026': {
    projectTypes: ['creative', 'courses'],
    socialGoals: ['regular_occasions'],
    recurring: true,
  },
  'utl-choir-2026': {
    projectTypes: ['creative'],
    socialGoals: ['group_activities', 'regular_occasions'],
    recurring: true,
  },
  'utl-spanish-beginner-2026': {
    projectTypes: ['language', 'courses'],
    socialGoals: ['regular_occasions'],
    recurring: true,
  },
  'utl-social-sciences-2026': {
    projectTypes: ['courses', 'culture'],
    recurring: true,
  },
  'utl-conferences-2026': {
    projectTypes: ['culture', 'courses'],
    lowBarrier: true,
    exploratory: true,
  },
  'fabrique-du-sud': {
    projectTypes: ['home_project', 'creative'],
    socialGoals: ['new_friends'],
    lowBarrier: true,
  },
  'repair-cafes-lille-network': repairCafe,
  'repair-cafe-fives-tipimi': repairCafe,
  'repair-cafe-lille-centre': repairCafe,
  'repair-cafe-lille-sud': repairCafe,
  'shared-gardens-lille-network': sharedGarden,
  'jardin-des-maguettes': sharedGarden,
  'jardin-retrouvailles': sharedGarden,
  'jardin-pre-muche': sharedGarden,
  'place-des-assos-lille': { projectTypes: ['volunteering'] },
  'forum-associations-lille-2026': {
    projectTypes: ['volunteering', 'courses'],
    socialGoals: ['new_friends'],
    exploratory: true,
    lowBarrier: true,
  },
  'france-benevolat-nord-lille': {
    projectTypes: ['volunteering'],
    lowBarrier: true,
  },
  'jeveuxaider-lille': { projectTypes: ['volunteering'] },
  'maison-associations-lille': {
    projectTypes: ['volunteering', 'entrepreneurship'],
  },
  'capv-adult-art-workshops': {
    projectTypes: ['creative', 'courses'],
    socialGoals: ['regular_occasions'],
    recurring: true,
  },
}
