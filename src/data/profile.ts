import type { RetirementProfile } from '../types'

export const profile: RetirementProfile = {
  firstName: 'Harold',
  vision:
    'Je voudrais assez de rythme pour que mes semaines aient du sens, tout en gardant la liberté de voyager et de passer plus de temps avec ma famille.',
  mapSummary:
    'Vous semblez heureux de retrouver plus de liberté, tout en cherchant encore ce qui pourrait remplacer un peu de la structure et de la stimulation que le travail vous apportait.\n\nBouger fait déjà partie de votre vie, et ça se sent. Aujourd’hui, les pistes les plus utiles sont de retrouver une activité régulière, de voir un peu plus de monde en semaine, et de continuer à transmettre votre expérience.',
  startingPoints: [
    'Retrouver une activité régulière',
    'Transmettre mon expérience',
    'Voir davantage de monde',
  ],
  learnings: [
    'Les grands groupes organisés, ce n’est vraiment pas pour moi.',
    'J’aime les activités où j’apprends quelque chose.',
    'Je veux un ou deux rendez-vous dans la semaine, pas un agenda plein.',
  ],
  interests: ['Vélo', 'Voyages', 'Ingénierie', 'Cuisine', 'Histoire'],
  seeking: [
    'Plus de rythme en semaine',
    'Rencontrer du monde',
    'Transmettre mon expérience',
  ],
  preferences: [
    'Activités en semaine',
    'Petits groupes',
    'Sans engagement trop long',
  ],
  weeklyRhythm:
    'Un ou deux rendez-vous dans la semaine, pas un agenda plein.',
  situation: {
    retiredDate: 'À la retraite depuis juin 2026',
    location: 'Lille, France',
    formerRole: 'Ancien ingénieur',
  },
}

/** English display text for the demo profile (French is the source). */
export const profileEnText: Pick<
  RetirementProfile,
  'vision' | 'learnings' | 'interests' | 'seeking' | 'preferences' | 'situation'
> = {
  vision:
    'I’d like enough rhythm for my weeks to feel meaningful, while keeping the freedom to travel and spend more time with my family.',
  learnings: [
    'Large organised groups really aren’t for me.',
    'I enjoy activities where I learn something.',
    'I want one or two fixed plans a week, not a full calendar.',
  ],
  interests: ['Cycling', 'Travel', 'Engineering', 'Cooking', 'History'],
  seeking: [
    'More rhythm during the week',
    'Meeting new people',
    'Sharing my experience',
  ],
  preferences: [
    'Weekday activities',
    'Small groups',
    'No long-term commitment',
  ],
  situation: {
    retiredDate: 'Retired since June 2026',
    location: 'Lille, France',
    formerRole: 'Former engineer',
  },
}
