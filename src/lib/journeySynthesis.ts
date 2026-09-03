import type { AnswerValue, SocialPreferences } from '../types'
import { getSocialOpportunityTypes } from '../lib/socialRecommendations'

const WORK_NEED_LABELS: Record<string, string> = {
  entoure: 'être entouré',
  colleagues: 'les collègues que vous appréciez',
  informal: 'les discussions informelles',
  collective: 'travailler avec d’autres',
  team: 'faire partie d’une équipe',
  'new-people': 'rencontrer régulièrement de nouvelles personnes',
  little: 'peu de lien social au travail',
}

const WORK_TAGS: Record<string, string> = {
  entoure: 'Être entouré',
  colleagues: 'Collègues',
  informal: 'Échanges informels',
  collective: 'Travail collectif',
  team: 'Esprit d’équipe',
  'new-people': 'Nouvelles rencontres',
}

const FORM_LABELS: Record<string, string> = {
  proches: 'les proches',
  activites: 'les activités partagées',
  nouvelles: 'les nouvelles rencontres',
  engager: 's’engager dans un projet',
}

const ACTIVITY_LABELS: Record<string, string> = {
  dejeuner: 'un moment convivial',
  activite: 'une activité',
  groupe: 'un groupe régulier',
  sport: 'du sport',
  projet: 'un projet',
  sortie: 'une sortie',
  benevolat: 'du bénévolat',
  famille: 'du temps en famille',
}

type SynthesisResult = {
  title?: string
  paragraphs: string[]
  bullets?: string[]
  tags?: string[]
}

function workNeeds(
  stepResponses: Record<string, AnswerValue>,
  prefs: SocialPreferences,
): string[] {
  return (
    (stepResponses.previousWorkSocialNeeds as string[] | undefined) ??
    prefs.previousWorkSocialNeeds
  )
}

function workTags(needs: string[]): string[] {
  return needs
    .map((id) => WORK_TAGS[id])
    .filter(Boolean)
    .slice(0, 3)
}

export function getJourneySynthesis(
  synthesisId: string,
  prefs: SocialPreferences,
  stepResponses: Record<string, AnswerValue>,
): SynthesisResult {
  switch (synthesisId) {
    case 'work-reflection': {
      const needs = workNeeds(stepResponses, prefs)
      if (needs.includes('little')) {
        return {
          paragraphs: [
            'Le travail ne semblait pas apporter grand-chose à votre vie sociale — et c’est une information utile en soi.',
            'On pourra explorer d’autres sources de lien, sans supposer qu’il « manque » quelque chose.',
          ],
        }
      }
      if (needs.includes('informal') && needs.includes('entoure')) {
        return {
          paragraphs: [
            'Ce qui vous manque n’est peut-être pas forcément d’avoir beaucoup plus d’activités.',
            'Ce sont peut-être simplement ces petites occasions régulières de voir et d’échanger avec d’autres.',
          ],
        }
      }
      if (needs.includes('team') || needs.includes('collective')) {
        return {
          paragraphs: [
            'Il semble que le collectif et avancer avec d’autres aient compté dans votre quotidien.',
            'On gardera cela en tête pour imaginer des situations qui pourraient recréer ce sentiment.',
          ],
        }
      }
      return {
        paragraphs: [
          'Comprendre ce qui comptait au travail peut aider à imaginer la suite — sans chercher à tout reproduire à l’identique.',
        ],
      }
    }

    case 'work-social':
    case 'work-social-summary': {
      const needs = workNeeds(stepResponses, prefs)
      if (needs.includes('little')) {
        return {
          paragraphs: [
            'Le travail ne semblait pas apporter grand-chose à votre vie sociale.',
            'On gardera cela en tête pour la suite.',
          ],
          tags: ['Exploration'],
        }
      }
      const labels = needs.map((id) => WORK_NEED_LABELS[id]).filter(Boolean)
      const focus =
        labels.length >= 2
          ? `${labels[0]} et ${labels[1]}`
          : labels[0] ?? 'des liens qui comptaient pour vous'
      return {
        title: synthesisId === 'work-social' ? 'Voilà ce que je retiens' : undefined,
        paragraphs: [
          `${focus.charAt(0).toUpperCase() + focus.slice(1)} semble${labels.length > 1 ? 'nt' : ''} avoir compté dans votre quotidien professionnel.`,
          'Pour la suite, on pourra chercher comment retrouver ce type de moments d’une manière qui vous ressemble.',
        ],
        tags: workTags(needs),
      }
    }

    case 'forms-examples':
      return {
        paragraphs: [
          'Marie voit surtout ses proches le week-end, mais apprécie aussi une promenade hebdomadaire avec un voisin.',
          'Ahmed a rejoint un atelier de poterie : il y retrouve les mêmes personnes, sans obligation de « faire des amis ».',
          'Deux rythmes différents — les deux sont valables.',
        ],
      }

    case 'forms-reflection': {
      const picked =
        (stepResponses.socialFormInterests as string[] | undefined) ??
        prefs.socialFormInterests
      const work = workNeeds(stepResponses, prefs)
      const refs: string[] = []
      if (work.includes('informal')) {
        refs.push('Vous nous aviez dit apprécier les échanges informels au travail.')
      }
      if (picked.includes('activites') && work.includes('entoure')) {
        return {
          paragraphs: [
            refs[0] ?? 'Ce que vous recherchez semble proche de ce que le travail apportait.',
            'Une activité régulière pourrait recréer à la fois du lien et une présence sociale, sans surcharge.',
          ],
        }
      }
      if (picked.length > 0) {
        const labels = picked.map((id) => FORM_LABELS[id]).filter(Boolean)
        return {
          paragraphs: [
            refs[0] ?? '',
            `Vous semblez attiré par ${labels.join(' et ')} — c’est un bon point de départ pour la suite.`,
          ].filter(Boolean),
        }
      }
      return {
        paragraphs: [
          'Vous explorez ce qui pourrait vous convenir — sans précipitation.',
        ],
      }
    }

    case 'forms-exploration':
    case 'forms-summary': {
      const picked =
        (stepResponses.socialFormInterests as string[] | undefined) ??
        prefs.socialFormInterests
      if (picked.length === 0) {
        return {
          paragraphs: [
            'Vous prenez le temps d’explorer — c’est une bonne façon de commencer.',
          ],
          tags: ['Exploration'],
        }
      }
      const labels = picked.map((id) => FORM_LABELS[id]).filter(Boolean)
      return {
        paragraphs: [
          `Vous êtes attiré par ${labels.join(', ')}.`,
          'On pourra affiner cela au fil des prochaines étapes.',
        ],
        tags: labels.map((l) => l.charAt(0).toUpperCase() + l.slice(1)),
      }
    }

    case 'desires-profiles':
      return {
        paragraphs: [
          'Certaines personnes aiment une semaine avec plusieurs rendez-vous. D’autres préfèrent un ou deux moments bien choisis.',
          'Il n’y a pas de « bonne » réponse — seulement ce qui vous conviendrait.',
        ],
      }

    case 'desires':
    case 'desires-summary': {
      const work = workNeeds(stepResponses, prefs)
      const intro = work.includes('informal')
        ? 'Vous nous aviez dit apprécier les échanges informels — '
        : ''
      const wantsNew =
        prefs.goals.includes('nouvelles') ||
        prefs.connectionPreference === 'new'
      const wantsExisting =
        prefs.goals.includes('proches') ||
        prefs.connectionPreference === 'existing'
      if (wantsNew && wantsExisting) {
        return {
          paragraphs: [
            `${intro}vous cherchez un équilibre entre approfondir ce que vous avez déjà et élargir un peu votre cercle.`,
            'On gardera cela en tête.',
          ],
          tags: ['Équilibre', 'Proches', 'Nouvelles rencontres'],
        }
      }
      if (wantsNew) {
        return {
          paragraphs: [
            `${intro}vous aimeriez surtout rencontrer de nouvelles personnes, à votre rythme.`,
          ],
          tags: ['Nouvelles rencontres'],
        }
      }
      if (wantsExisting) {
        return {
          paragraphs: [
            `${intro}vous souhaitez surtout voir davantage les personnes que vous connaissez déjà.`,
          ],
          tags: ['Proches'],
        }
      }
      return {
        paragraphs: [
          'Vous avancez sans pression — c’est une bonne façon de clarifier ce qui vous conviendrait.',
        ],
        tags: ['Exploration'],
      }
    }

    case 'scenario-why-reflection': {
      const why =
        (stepResponses.scenarioWhy as string[] | undefined) ?? prefs.scenarioWhy
      if (why.includes('petit-groupe')) {
        return {
          paragraphs: [
            'Les petits groupes semblent vous convenir — un cadre où l’on peut vraiment échanger.',
          ],
        }
      }
      if (why.includes('utile')) {
        return {
          paragraphs: [
            'Participer à quelque chose d’utile tout en étant avec d’autres semble vous parler.',
          ],
        }
      }
      return {
        paragraphs: [
          'Vos choix nous aident à imaginer des situations qui vous ressembleraient.',
        ],
      }
    }

    case 'meeting-style':
    case 'meeting-summary': {
      const invitation = String(
        stepResponses.scenarioInvitation ?? prefs.scenarioInvitation ?? '',
      )
      const size =
        invitation === 'cafe' || invitation === 'benevolat'
          ? 'les petits groupes'
          : invitation === 'atelier'
            ? 'un groupe intermédiaire'
            : prefs.preferredGroupSize === 'small'
              ? 'les petits groupes'
              : 'différents formats'
      const freq =
        prefs.preferredFrequency === 'regular' ||
        prefs.preferredFrequency === 'more'
          ? 'des rendez-vous réguliers'
          : 'des occasions plus souples'
      return {
        paragraphs: [
          `Vous semblez préférer ${size} et ${freq}.`,
          'Cela nous aide à imaginer des pistes concrètes qui pourraient vous convenir.',
        ],
        tags: [
          size.includes('petit') ? 'Petit groupe' : 'Groupe',
          prefs.preferredContexts.includes('activity') ? 'Activité' : 'Convivialité',
        ].filter(Boolean),
      }
    }

    case 'ideal-week-visual':
      return {
        title: 'À quoi pourrait ressembler une bonne semaine',
        bullets: [
          'Un déjeuner avec des proches le mardi',
          'Une activité régulière le jeudi matin',
          'De temps en temps, une nouvelle rencontre',
        ],
        paragraphs: ['Ce n’est qu’un exemple — le vôtre sera différent.'],
      }

    case 'ideal-week':
    case 'ideal-week-summary': {
      const activities = prefs.idealWeekActivities
        .map((id) => ACTIVITY_LABELS[id])
        .filter(Boolean)
      const bullets =
        activities.length > 0
          ? activities.slice(0, 3)
          : ['quelques moments avec d’autres', 'sans surcharge']
      return {
        title: 'Votre équilibre pourrait ressembler à…',
        bullets,
        paragraphs: [
          'Ce n’est pas un programme à suivre. Juste une direction qui pourra évoluer.',
        ],
        tags: bullets.slice(0, 2),
      }
    }

    case 'opportunity-intro': {
      const work = workNeeds(stepResponses, prefs)
      const prefix = work.includes('informal')
        ? 'Vous nous aviez dit apprécier les échanges informels. '
        : ''
      const wantsNew =
        prefs.goals.includes('nouvelles') ||
        prefs.connectionPreference === 'new' ||
        prefs.connectionPreference === 'both'
      const small =
        prefs.preferredGroupSize === 'small' ||
        prefs.scenarioInvitation === 'cafe' ||
        prefs.scenarioInvitation === 'benevolat'
      const activity =
        prefs.preferredContexts.includes('activity') ||
        prefs.preferredContext === 'activity'
      if (wantsNew && small && activity) {
        return {
          paragraphs: [
            `${prefix}Vous semblez chercher surtout des occasions de retrouver régulièrement quelques personnes autour de quelque chose que vous aimez faire.`,
          ],
        }
      }
      return {
        paragraphs: [
          `${prefix}Voici quelques directions qui pourraient correspondre à ce que vous nous avez dit.`,
        ],
      }
    }

    case 'opportunity-types':
      return {
        paragraphs: [
          'Indiquez ce qui vous parle — ou pas. Cela affinera les pistes suivantes.',
        ],
      }

    case 'opportunity-summary':
      return {
        paragraphs: [
          'Merci pour ces retours. Juno en tiendra compte pour les prochaines suggestions.',
        ],
        tags: Object.entries(prefs.opportunityTypeFeedback)
          .filter(([, v]) => v === 'yes')
          .map(([id]) =>
            id === 'activite-groupe'
              ? 'Activité en groupe'
              : id === 'atelier'
                ? 'Atelier'
                : 'Association',
          )
          .slice(0, 3),
      }

    case 'resources-intro': {
      const activity = prefs.preferredContexts.includes('activity')
      return {
        paragraphs: [
          activity
            ? 'Vous préférez les rencontres autour d’une activité — voici quelques pistes à Lille qui correspondent à ce profil.'
            : 'Voici quelques exemples concrets près de chez vous, choisis en fonction de ce que vous nous avez dit.',
          'Ce ne sont pas les seules possibilités — juste un point de départ.',
        ],
      }
    }

    case 'resources-summary':
      return {
        paragraphs: [
          'Vous avez parcouru quelques pistes concrètes. Vous pourrez y revenir quand vous le souhaiterez.',
        ],
        tags: ['Lille', 'Exploration'],
      }

    case 'pick-intro':
      return {
        paragraphs: [
          'Parmi les pistes qui vous intéressent, laquelle aimeriez-vous explorer en premier ?',
          'Une seule suffit pour commencer.',
        ],
      }

    case 'pick-first':
      return {
        paragraphs: ['Par laquelle aimeriez-vous commencer ?'],
      }

    case 'pick-summary':
      return {
        paragraphs: prefs.selectedActionLabel
          ? [`Prochaine action : ${prefs.selectedActionLabel}`]
          : ['Vous avez choisi une première piste à explorer.'],
        tags: ['Première étape'],
      }

    default:
      return {
        paragraphs: ['Voilà pour cette étape.'],
      }
  }
}

export function getOpportunityTypesForStep(prefs: SocialPreferences) {
  return getSocialOpportunityTypes({
    ...prefs,
    preferredContext:
      prefs.preferredContexts[0] ?? prefs.preferredContext ?? null,
  })
}

export function buildSocialProfileSummary(
  prefs: SocialPreferences,
): string[] {
  const lines: string[] = []

  if (prefs.previousWorkSocialNeeds.includes('informal')) {
    lines.push('Vous appréciez les échanges informels et réguliers.')
  }
  if (prefs.preferredGroupSize === 'small') {
    lines.push('Vous appréciez plutôt les petits groupes.')
  }
  if (
    prefs.preferredContexts.includes('activity') ||
    prefs.preferredContext === 'activity'
  ) {
    lines.push('Les rencontres autour d’une activité vous conviennent bien.')
  }
  if (
    prefs.goals.includes('nouvelles') ||
    prefs.connectionPreference === 'new'
  ) {
    lines.push('Vous aimeriez rencontrer de nouvelles personnes régulièrement.')
  }
  if (prefs.goals.includes('proches') || prefs.connectionPreference === 'existing') {
    lines.push('Vous souhaitez surtout voir davantage vos proches.')
  }
  if (
    prefs.preferredFrequency === 'regular' ||
    prefs.preferredFrequency === 'more'
  ) {
    lines.push('Un rythme régulier vous semble important.')
  }

  return lines.length > 0
    ? lines
    : ['Juno apprend encore ce qui vous conviendrait le mieux.']
}
