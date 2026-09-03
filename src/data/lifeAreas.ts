import type { LifeArea } from '../types'

export const lifeAreas: LifeArea[] = [
  {
    id: 'purpose',
    name: 'Projets & sens',
    landingDescription:
      'Un cap qui n’est pas un rendez-vous dans l’agenda. Quelque chose qui s’appuie sur ce que vous savez, et qui vous laisse encore de la place pour avancer.',
    status: 'needs-attention',
    statusLabel: 'À travailler',
    insight:
      'Vous aimeriez quelque chose de stimulant, qui donne une raison de se lever le matin.',
  },
  {
    id: 'people',
    name: 'Entourage',
    landingDescription:
      'La famille, les amis, et les rencontres du quotidien qui rendent une semaine plus vivante.',
    status: 'worth-exploring',
    statusLabel: 'À explorer',
    insight:
      'Vous avez des relations solides, mais vous aimeriez voir un peu plus de monde dans la semaine, de façon régulière.',
  },
  {
    id: 'health',
    name: 'Forme & bien-être',
    landingDescription:
      'L’énergie, le mouvement, et le soin de ce corps qui va vous accompagner dans cette étape.',
    status: 'going-well',
    statusLabel: 'Ça se passe bien',
    insight: 'Rester actif fait déjà partie de votre quotidien.',
  },
  {
    id: 'money',
    name: 'Finances',
    landingDescription:
      'Pas seulement la sécurité — la confiance de dépenser pour ce qui rend vraiment ce temps précieux.',
    status: 'feeling-confident',
    statusLabel: 'Vous êtes serein',
    insight:
      'Votre question n’est pas celle du quotidien. C’est plutôt : jusqu’où puis-je me faire plaisir sans m’inquiéter ?',
  },
  {
    id: 'experiences',
    name: 'Envies & découvertes',
    landingDescription:
      'Les voyages, la curiosité, et tout ce que vous remettiez à plus tard. Plus tard, c’est maintenant.',
    status: 'a-priority',
    statusLabel: 'Une priorité',
    insight: 'Voyager est l’une des choses qui vous font le plus envie.',
  },
]
