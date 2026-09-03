import type { JourneyPhase, JourneyStep, ThemeJourney } from '../types'
import { PATH_SOCIAL, THEME_SOCIAL } from './paths'

export const SOCIAL_JOURNEY_ID = 'journey-social'

export const journeyPhaseLabels: Record<
  JourneyPhase['type'],
  string
> = {
  discover: 'Découvrir',
  define: 'Définir',
  act: 'Passer à l’action',
}

const WORK_DAY_TIMELINE = [
  { time: '8h45', label: 'Arriver et saluer quelques collègues' },
  { time: '10h30', label: 'Échanger quelques mots autour d’un café' },
  { time: '12h30', label: 'Déjeuner avec quelqu’un' },
  { time: '15h00', label: 'Travailler ensemble sur un problème' },
  { time: '17h30', label: 'Discuter avant de partir' },
]

const phaseDiscover: JourneyPhase = {
  id: 'social-phase-discover',
  title: 'DÉCOUVRIR',
  type: 'discover',
  steps: [
    {
      id: 'social-step-1',
      phaseId: 'social-phase-discover',
      title: 'Ce que le travail apportait à votre vie sociale',
      estimatedMinutes: 7,
      screens: [
        {
          id: 's1-intro',
          type: 'content',
          title: 'Le travail, c’était aussi du lien social',
          paragraphs: [
            'Quand on pense au travail, on pense souvent aux tâches, aux responsabilités ou au rythme.',
            'Mais une journée de travail est aussi remplie de petits contacts avec les autres.',
          ],
        },
        {
          id: 's1-timeline',
          type: 'timeline',
          title: 'Une journée ordinaire au travail',
          timeline: WORK_DAY_TIMELINE,
          paragraphs: [
            'Pris séparément, ces moments paraissent petits. Ensemble, ils créent une présence sociale régulière.',
          ],
        },
        {
          id: 's1-concepts',
          type: 'concepts',
          title: 'Différentes choses que le travail peut apporter',
          options: [
            { id: 'presence', label: 'LA PRÉSENCE' },
            { id: 'relations', label: 'LES RELATIONS' },
            { id: 'echanges', label: 'LES ÉCHANGES' },
            { id: 'collectif', label: 'LE COLLECTIF' },
          ],
          paragraphs: [
            'Être entouré, même sans forcément beaucoup parler.',
            'Retrouver régulièrement des personnes que l’on connaît.',
            'Discuter, plaisanter, partager des idées.',
            'Faire partie d’une équipe et avancer avec d’autres.',
          ],
        },
        {
          id: 's1-question',
          type: 'multiChoice',
          question: 'Et pour vous, qu’est-ce qui comptait le plus ?',
          responseKey: 'previousWorkSocialNeeds',
          options: [
            { id: 'entoure', label: 'Être entouré' },
            { id: 'colleagues', label: 'Les collègues que j’appréciais' },
            { id: 'informal', label: 'Les discussions informelles' },
            { id: 'collective', label: 'Travailler avec d’autres' },
            { id: 'team', label: 'Faire partie d’une équipe' },
            { id: 'new-people', label: 'Rencontrer régulièrement de nouvelles personnes' },
            { id: 'little', label: 'Pas grand-chose socialement' },
          ],
        },
        {
          id: 's1-insight',
          type: 'insight',
          synthesisId: 'work-reflection',
        },
        {
          id: 's1-change',
          type: 'singleChoice',
          question:
            'Depuis que votre rythme de travail a changé, ces moments sont-ils…',
          responseKey: 'workSocialChange',
          options: [
            { id: 'more', label: 'Plus nombreux' },
            { id: 'same', label: 'À peu près pareils' },
            { id: 'less', label: 'Un peu moins nombreux' },
            { id: 'much-less', label: 'Beaucoup moins nombreux' },
            { id: 'unknown', label: 'Difficile à dire' },
          ],
        },
        {
          id: 's1-synthesis',
          type: 'synthesis',
          synthesisId: 'work-social',
        },
        {
          id: 's1-complete',
          type: 'stepCompletion',
          completionId: 'social-step-1',
        },
      ],
    },
    {
      id: 'social-step-2',
      phaseId: 'social-phase-discover',
      title: 'Une vie sociale peut prendre plusieurs formes',
      estimatedMinutes: 6,
      screens: [
        {
          id: 's2-intro',
          type: 'content',
          title: 'Une vie sociale, ce n’est pas une seule chose',
          paragraphs: [
            'Quand on parle de « vie sociale », on pense parfois à une image unique : sortir souvent, avoir beaucoup d’amis, être très actif.',
            'En réalité, chacun compose sa vie sociale à sa façon — et elle peut prendre des formes très différentes.',
          ],
        },
        {
          id: 's2-concepts',
          type: 'concepts',
          options: [
            { id: 'proches', label: 'LES PROCHES' },
            { id: 'activites', label: 'LES ACTIVITÉS' },
            { id: 'nouvelles', label: 'LES NOUVELLES RENCONTRES' },
            { id: 'engager', label: 'S’ENGAGER' },
          ],
          paragraphs: [
            'Famille, amis, personnes que vous connaissez déjà.',
            'Faire quelque chose avec d’autres — sport, culture, atelier…',
            'Créer de nouveaux liens autour d’un intérêt commun.',
            'Participer à un projet, une association ou une cause.',
          ],
        },
        {
          id: 's2-examples',
          type: 'insight',
          synthesisId: 'forms-examples',
        },
        {
          id: 's2-question',
          type: 'multiChoice',
          question: 'Lesquelles vous attirent le plus aujourd’hui ?',
          responseKey: 'socialFormInterests',
          options: [
            { id: 'proches', label: 'Les proches' },
            { id: 'activites', label: 'Les activités' },
            { id: 'nouvelles', label: 'Les nouvelles rencontres' },
            { id: 'engager', label: 'S’engager' },
          ],
        },
        {
          id: 's2-reflect',
          type: 'insight',
          synthesisId: 'forms-reflection',
        },
        {
          id: 's2-synthesis',
          type: 'synthesis',
          synthesisId: 'forms-exploration',
        },
        {
          id: 's2-complete',
          type: 'stepCompletion',
          completionId: 'social-step-2',
        },
      ],
    },
  ],
}

const phaseDefine: JourneyPhase = {
  id: 'social-phase-define',
  title: 'DÉFINIR',
  type: 'define',
  steps: [
    {
      id: 'social-step-3',
      phaseId: 'social-phase-define',
      title: 'De quoi avez-vous envie aujourd’hui ?',
      estimatedMinutes: 6,
      screens: [
        {
          id: 's3-intro',
          type: 'content',
          title: 'Plus de monde n’est pas forcément mieux',
          paragraphs: [
            'Certaines personnes aiment avoir beaucoup de rendez-vous. D’autres préfèrent quelques relations régulières.',
            'L’important est de trouver ce qui vous convient — sans vous comparer aux autres.',
          ],
        },
        {
          id: 's3-profiles',
          type: 'insight',
          synthesisId: 'desires-profiles',
        },
        {
          id: 's3-goals',
          type: 'multiChoice',
          question: 'De quoi aimeriez-vous davantage ?',
          responseKey: 'goals',
          options: [
            { id: 'proches', label: 'Voir mes proches plus souvent' },
            { id: 'nouvelles', label: 'Rencontrer de nouvelles personnes' },
            { id: 'reguliers', label: 'Avoir des rendez-vous réguliers' },
            { id: 'activite', label: 'Partager une activité' },
            { id: 'projet', label: 'Participer à un projet collectif' },
            { id: 'rien', label: 'Rien de particulier pour le moment' },
          ],
        },
        {
          id: 's3-connection',
          type: 'singleChoice',
          question: 'Vous aimeriez plutôt…',
          responseKey: 'connectionPreference',
          options: [
            { id: 'existing', label: 'Approfondir les relations que j’ai déjà' },
            { id: 'new', label: 'Rencontrer de nouvelles personnes' },
            { id: 'both', label: 'Un peu des deux' },
          ],
        },
        {
          id: 's3-synthesis',
          type: 'synthesis',
          synthesisId: 'desires',
        },
        {
          id: 's3-complete',
          type: 'stepCompletion',
          completionId: 'social-step-3',
        },
      ],
    },
    {
      id: 'social-step-4',
      phaseId: 'social-phase-define',
      title: 'Quel type de rencontres vous ressemble ?',
      estimatedMinutes: 7,
      screens: [
        {
          id: 's4-intro',
          type: 'content',
          title: 'Imaginons une invitation',
          paragraphs: [
            'Plutôt que de choisir des catégories abstraites, voyons ce qui vous attire dans des situations concrètes.',
            'Il n’y a pas de bonne réponse — seulement ce qui vous semblerait agréable.',
          ],
        },
        {
          id: 's4-scenario',
          type: 'scenario',
          question: 'Samedi prochain, laquelle de ces invitations vous attire le plus ?',
          responseKey: 'scenarioInvitation',
          options: [
            {
              id: 'cafe',
              label: 'Option A',
              description: 'Un café avec deux personnes que vous connaissez peu.',
            },
            {
              id: 'atelier',
              label: 'Option B',
              description: 'Un atelier photo avec 8 personnes.',
            },
            {
              id: 'sortie',
              label: 'Option C',
              description: 'Une grande sortie organisée avec 30 personnes.',
            },
            {
              id: 'benevolat',
              label: 'Option D',
              description: 'Participer à une action bénévole avec une petite équipe.',
            },
          ],
        },
        {
          id: 's4-why',
          type: 'multiChoice',
          question: 'Qu’est-ce qui vous attire dans ce choix ?',
          responseKey: 'scenarioWhy',
          options: [
            { id: 'petit-groupe', label: 'Petit groupe' },
            { id: 'activite', label: 'Activité concrète' },
            { id: 'decouvrir', label: 'Découvrir des gens' },
            { id: 'detendu', label: 'Ambiance détendue' },
            { id: 'utile', label: 'Me sentir utile' },
            { id: 'autre', label: 'Autre' },
          ],
        },
        {
          id: 's4-reflect',
          type: 'insight',
          synthesisId: 'scenario-why-reflection',
        },
        {
          id: 's4-frequency',
          type: 'singleChoice',
          question: 'À quelle fréquence ce type de moment vous semblerait agréable ?',
          responseKey: 'preferredFrequency',
          options: [
            { id: 'occasional', label: 'De temps en temps' },
            { id: 'regular', label: 'Environ une fois par semaine' },
            { id: 'more', label: 'Plus régulièrement' },
            { id: 'unknown', label: 'Je ne sais pas encore' },
          ],
        },
        {
          id: 's4-synthesis',
          type: 'synthesis',
          synthesisId: 'meeting-style',
        },
        {
          id: 's4-complete',
          type: 'stepCompletion',
          completionId: 'social-step-4',
        },
      ],
    },
    {
      id: 'social-step-5',
      phaseId: 'social-phase-define',
      title: 'Votre vie sociale idéale, simplement',
      estimatedMinutes: 6,
      screens: [
        {
          id: 's5-intro',
          type: 'content',
          title: 'Imaginez simplement une bonne semaine',
          paragraphs: [
            'Pas besoin de décrire votre vie dans deux ans ni de tout planifier.',
            'Une semaine agréable suffit pour orienter la réflexion.',
          ],
        },
        {
          id: 's5-visual',
          type: 'synthesis',
          synthesisId: 'ideal-week-visual',
        },
        {
          id: 's5-moments',
          type: 'singleChoice',
          question:
            'Combien de moments avec d’autres vous sembleraient agréables ?',
          responseKey: 'idealWeekMoments',
          options: [
            { id: '1', label: '1' },
            { id: '2-3', label: '2-3' },
            { id: 'several', label: 'Plusieurs' },
            { id: 'varies', label: 'Ça dépend des semaines' },
          ],
        },
        {
          id: 's5-activities',
          type: 'multiChoice',
          question: 'Qu’est-ce que vous aimeriez y retrouver ?',
          responseKey: 'idealWeekActivities',
          options: [
            { id: 'dejeuner', label: 'Un déjeuner' },
            { id: 'activite', label: 'Une activité' },
            { id: 'groupe', label: 'Un groupe régulier' },
            { id: 'sport', label: 'Du sport' },
            { id: 'projet', label: 'Un projet' },
            { id: 'sortie', label: 'Une sortie' },
            { id: 'benevolat', label: 'Du bénévolat' },
            { id: 'famille', label: 'Du temps en famille' },
          ],
        },
        {
          id: 's5-synthesis',
          type: 'synthesis',
          synthesisId: 'ideal-week',
        },
        {
          id: 's5-complete',
          type: 'stepCompletion',
          completionId: 'social-step-5',
        },
      ],
    },
  ],
}

const phaseAct: JourneyPhase = {
  id: 'social-phase-act',
  title: 'PASSER À L’ACTION',
  type: 'act',
  steps: [
    {
      id: 'social-step-6',
      phaseId: 'social-phase-act',
      title: 'Trois pistes qui pourraient vous correspondre',
      estimatedMinutes: 6,
      screens: [
        {
          id: 's6-intro',
          type: 'synthesis',
          synthesisId: 'opportunity-intro',
        },
        {
          id: 's6-context',
          type: 'content',
          paragraphs: [
            'Voici trois types de possibilités — pas des adresses précises, mais des directions qui pourraient vous correspondre.',
            'Indiquez ce qui vous parle, ou pas. Cela affinera la suite.',
          ],
        },
        {
          id: 's6-types',
          type: 'recommendation',
        },
        {
          id: 's6-synthesis',
          type: 'synthesis',
          synthesisId: 'opportunity-summary',
        },
        {
          id: 's6-complete',
          type: 'stepCompletion',
          completionId: 'social-step-6',
        },
      ],
    },
    {
      id: 'social-step-7',
      phaseId: 'social-phase-act',
      title: 'Explorer ce qui existe autour de vous',
      estimatedMinutes: 7,
      screens: [
        {
          id: 's7-intro',
          type: 'synthesis',
          synthesisId: 'resources-intro',
        },
        {
          id: 's7-resources',
          type: 'resourceSelection',
          title: 'Quelques pistes près de chez vous',
          paragraphs: [
            'Exemples à Lille — trois maximum, choisis pour vous.',
          ],
        },
        {
          id: 's7-reflect',
          type: 'content',
          paragraphs: [
            'Vous n’avez pas besoin de décider maintenant.',
            'Marquer une piste comme intéressante suffit pour qu’on puisse en reparler plus tard.',
          ],
        },
        {
          id: 's7-complete',
          type: 'stepCompletion',
          completionId: 'social-step-7',
        },
      ],
    },
    {
      id: 'social-step-8',
      phaseId: 'social-phase-act',
      title: 'Choisir une première chose à essayer',
      estimatedMinutes: 5,
      screens: [
        {
          id: 's8-intro',
          type: 'synthesis',
          synthesisId: 'pick-intro',
        },
        {
          id: 's8-pick',
          type: 'resourceSelection',
          synthesisId: 'pick-first',
        },
        {
          id: 's8-confirm',
          type: 'content',
          title: 'Très bien.',
          paragraphs: [
            'Pas besoin d’en faire plus maintenant.',
            'Vous pourrez revenir à cette piste quand vous le souhaiterez.',
          ],
        },
        {
          id: 's8-complete',
          type: 'stepCompletion',
          completionId: 'social-step-8',
        },
      ],
    },
  ],
}

export const socialJourney: ThemeJourney = {
  id: SOCIAL_JOURNEY_ID,
  themeId: THEME_SOCIAL,
  pathId: PATH_SOCIAL,
  title: 'Ma vie sociale',
  description: 'Construire une vie sociale qui vous ressemble.',
  phases: [phaseDiscover, phaseDefine, phaseAct],
}

export function getAllSocialJourneySteps(): JourneyStep[] {
  return socialJourney.phases.flatMap((phase) => phase.steps)
}

export function getSocialJourneyStep(
  stepId: string,
): JourneyStep | undefined {
  return getAllSocialJourneySteps().find((step) => step.id === stepId)
}

export function getSocialPhaseForStep(stepId: string): JourneyPhase | undefined {
  return socialJourney.phases.find((phase) =>
    phase.steps.some((step) => step.id === stepId),
  )
}

export const SOCIAL_STEP_ORDER = getAllSocialJourneySteps().map((s) => s.id)
