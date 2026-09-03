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
          title: 'Ce qui ressort pour l’instant',
          paragraphs: [
            'Pour l’instant, le travail ne semble pas avoir été une grande source de lien social — et c’est une information utile.',
            'On pourra explorer d’autres sources de présence, sans supposer qu’il « manque » quelque chose.',
          ],
        }
      }
      if (needs.includes('informal') && needs.includes('entoure')) {
        return {
          title: 'Ce qui ressort pour l’instant',
          paragraphs: [
            'Ce qui semble compter, ce n’est pas forcément d’avoir **beaucoup plus d’activités**.',
            'Ce sont plutôt ces **petites occasions régulières** de voir et d’échanger avec d’autres.',
          ],
        }
      }
      if (needs.includes('team') || needs.includes('collective')) {
        return {
          title: 'Ce qui ressort pour l’instant',
          paragraphs: [
            'Vous semblez avoir apprécié **avancer avec d’autres** — le collectif dans le quotidien.',
            'On gardera cela en tête pour imaginer des situations qui pourraient recréer ce sentiment.',
          ],
        }
      }
      const labels = needs.map((id) => WORK_NEED_LABELS[id]).filter(Boolean)
      if (labels.length > 0) {
        return {
          title: 'Ce qui ressort pour l’instant',
          paragraphs: [
            `Ce qui semble avoir compté : **${labels.slice(0, 2).join('** et **')}**.`,
            'On pourra chercher comment retrouver ce type de moments, sans tout reproduire à l’identique.',
          ],
        }
      }
      return {
        title: 'Ce qui ressort pour l’instant',
        paragraphs: [
          'Comprendre ce qui comptait au travail peut aider à imaginer la suite — sans chercher à tout reproduire.',
        ],
      }
    }

    case 'work-social':
    case 'work-social-summary': {
      const needs = workNeeds(stepResponses, prefs)
      if (needs.includes('little')) {
        return {
          paragraphs: [
            'Pour l’instant, le travail ne semble pas avoir apporté grand-chose à votre vie sociale.',
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
          `Vous semblez avoir tenu à **${focus}** dans votre quotidien professionnel.`,
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
        refs.push(
          'Vous aviez mentionné apprécier les **échanges informels** au travail.',
        )
      }
      if (picked.includes('activites') && work.includes('entoure')) {
        return {
          title: 'Ce qui ressort pour l’instant',
          paragraphs: [
            refs[0] ??
              'Ce que vous recherchez semble proche de ce que le travail apportait.',
            'Une **activité régulière** pourrait recréer à la fois du lien et une présence sociale, sans surcharge.',
          ],
        }
      }
      if (picked.length > 0) {
        const labels = picked.map((id) => FORM_LABELS[id]).filter(Boolean)
        return {
          title: 'Ce qui ressort pour l’instant',
          paragraphs: [
            ...(refs[0] ? [refs[0]] : []),
            `Vous semblez attiré par **${labels.join('** et **')}** — un bon point de départ pour la suite.`,
          ],
        }
      }
      return {
        title: 'Ce qui ressort pour l’instant',
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
            'Pour l’instant, vous prenez le temps d’explorer — c’est une bonne façon de commencer.',
          ],
          tags: ['Exploration'],
        }
      }
      const labels = picked.map((id) => FORM_LABELS[id]).filter(Boolean)
      return {
        paragraphs: [
          `Vous semblez attiré par **${labels.join(', ')}**.`,
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
      const goals =
        (stepResponses.goals as string[] | undefined) ?? prefs.goals
      const connection =
        (stepResponses.connectionPreference as string | undefined) ??
        prefs.connectionPreference
      const intro = work.includes('informal')
        ? 'Vous aviez mentionné apprécier les échanges informels — '
        : ''
      const wantsNew =
        goals.includes('nouvelles') || connection === 'new'
      const wantsExisting =
        goals.includes('proches') || connection === 'existing'
      const wantsActivity = goals.includes('activite')
      if (wantsNew && wantsActivity) {
        return {
          paragraphs: [
            `${intro}vous semblez préférer rencontrer de **nouvelles personnes** autour d’une **activité concrète**, plutôt que dans de grands groupes.`,
          ],
          tags: ['Nouvelles rencontres', 'Activité'],
        }
      }
      if (wantsNew && wantsExisting) {
        return {
          paragraphs: [
            `${intro}pour l’instant, vous cherchez un **équilibre** entre approfondir ce que vous avez déjà et élargir un peu votre cercle.`,
          ],
          tags: ['Équilibre', 'Proches', 'Nouvelles rencontres'],
        }
      }
      if (wantsNew) {
        return {
          paragraphs: [
            `${intro}vous semblez vouloir surtout **rencontrer de nouvelles personnes**, à votre rythme.`,
          ],
          tags: ['Nouvelles rencontres'],
        }
      }
      if (wantsExisting) {
        return {
          paragraphs: [
            `${intro}vous semblez vouloir surtout voir davantage les **personnes que vous connaissez déjà**.`,
          ],
          tags: ['Proches'],
        }
      }
      return {
        paragraphs: [
          'Pour l’instant, vous avancez sans pression — une bonne façon de clarifier ce qui vous conviendrait.',
        ],
        tags: ['Exploration'],
      }
    }

    case 'scenario-why-reflection': {
      const why =
        (stepResponses.scenarioWhy as string[] | undefined) ?? prefs.scenarioWhy
      const invitation = String(
        stepResponses.scenarioInvitation ?? prefs.scenarioInvitation ?? '',
      )
      const whyLabels: Record<string, string> = {
        'petit-groupe': 'un petit groupe',
        activite: 'une activité concrète',
        decouvrir: 'découvrir des gens',
        detendu: 'une ambiance détendue',
        utile: 'vous sentir utile',
      }
      const reasons = why
        .map((id) => whyLabels[id])
        .filter(Boolean)
        .slice(0, 2)
      if (reasons.length > 0) {
        return {
          title: 'Ce qui ressort pour l’instant',
          paragraphs: [
            `Ce qui semble vous attirer : **${reasons.join('** et **')}**.`,
            invitation === 'cafe' || invitation === 'benevolat'
              ? 'Plutôt qu’un grand groupe, vous semblez préférer un cadre où l’on peut vraiment échanger.'
              : 'On gardera cela en tête pour imaginer des situations qui vous ressemblent.',
          ],
        }
      }
      return {
        title: 'Ce qui ressort pour l’instant',
        paragraphs: [
          'Vos choix aident à imaginer des situations qui pourraient vous ressembler.',
        ],
      }
    }

    case 'meeting-style':
    case 'meeting-summary': {
      const invitation = String(
        stepResponses.scenarioInvitation ?? prefs.scenarioInvitation ?? '',
      )
      const why =
        (stepResponses.scenarioWhy as string[] | undefined) ?? prefs.scenarioWhy
      const frequency =
        (stepResponses.preferredFrequency as string | undefined) ??
        prefs.preferredFrequency
      const size =
        invitation === 'cafe' || invitation === 'benevolat'
          ? 'les petits groupes'
          : invitation === 'atelier'
            ? 'un groupe intermédiaire'
            : prefs.preferredGroupSize === 'small'
              ? 'les petits groupes'
              : 'différents formats'
      const freq =
        frequency === 'regular' || frequency === 'more'
          ? 'des rendez-vous réguliers'
          : 'des occasions plus souples'
      const activityLed =
        why.includes('activite') ||
        prefs.preferredContexts.includes('activity') ||
        invitation === 'atelier'
      const newPeople = why.includes('decouvrir')
      let main = `Vous semblez préférer **${size}** et **${freq}**.`
      if (activityLed && newPeople) {
        main =
          'Vous semblez préférer rencontrer de **nouvelles personnes** autour d’une **activité concrète**, plutôt que dans de grands groupes.'
      } else if (activityLed) {
        main = `Vous semblez préférer **${size}** autour d’une **activité concrète**, avec **${freq}**.`
      }
      return {
        paragraphs: [
          main,
          'Cela aide à imaginer des pistes concrètes qui pourraient vous convenir.',
        ],
        tags: [
          size.includes('petit') ? 'Petit groupe' : 'Groupe',
          activityLed ? 'Activité' : 'Convivialité',
          ...(newPeople ? ['Nouvelles rencontres'] : []),
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
      const activityIds =
        (stepResponses.idealWeekActivities as string[] | undefined) ??
        prefs.idealWeekActivities
      const activities = activityIds
        .map((id) => ACTIVITY_LABELS[id])
        .filter(Boolean)
      const bullets =
        activities.length > 0
          ? activities.slice(0, 3)
          : ['quelques moments avec d’autres', 'sans surcharge']
      return {
        title: 'Votre équilibre pourrait ressembler à…',
        bullets,
        paragraphs:
          activities.length > 0
            ? [
                `Pour l’instant, ce qui ressort : **${activities.slice(0, 2).join('** et **')}**.`,
                'Ce n’est pas un programme à suivre — juste une direction qui pourra évoluer.',
              ]
            : [
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
