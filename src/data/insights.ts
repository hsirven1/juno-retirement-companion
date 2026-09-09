import { emptySocialPreferences } from './socialLife'
import { buildMentorMatchingProfile } from '../lib/mentorMatching'
import { profile } from './profile'
import type { AssessmentAnswers, MentorMatchingProfile } from '../types'
import type { Locale } from '../i18n/types'

function t(fr: string, en: string, locale: Locale): string {
  return locale === 'en' ? en : fr
}

function matchingFromAnswers(answers: AssessmentAnswers): MentorMatchingProfile {
  return buildMentorMatchingProfile({
    answers,
    profile,
    socialPreferences: emptySocialPreferences(),
  })
}

/**
 * Compact 2–3 sentence synthesis for the post-Bilan page.
 * Cautious, human wording — not a diagnostic report.
 */
export function buildBilanSynthesis(
  answers: AssessmentAnswers,
  locale: Locale,
): string {
  const matching = matchingFromAnswers(answers)
  const sentences: string[] = []

  const wantsSocial =
    matching.wantMoreOf.includes('social_contact') ||
    matching.ambitions.includes('meet_people') ||
    matching.helpTopics.includes('social') ||
    matching.socialNetworkStrength === 'few_around' ||
    matching.socialNetworkStrength === 'often_alone'

  const wantsTravel =
    matching.interests.includes('travel') ||
    matching.wantMoreOf.includes('travel') ||
    matching.ambitions.includes('travel_more') ||
    matching.wantMoreOf.includes('new_experiences')

  const wantsUseful =
    matching.wantMoreOf.includes('usefulness') ||
    matching.ambitions.includes('volunteer') ||
    matching.helpTopics.includes('volunteering')

  const wantsProjects =
    matching.wantMoreOf.includes('personal_projects') ||
    matching.wantMoreOf.includes('starting_something') ||
    matching.ambitions.includes('small_business') ||
    matching.ambitions.includes('creative_project')

  // Sentence 1 — overall direction
  if (matching.needForStructure === 'high' && wantsSocial && wantsTravel) {
    sentences.push(
      t(
        'Vous cherchez une retraite active et assez structurée, avec davantage de contacts sociaux et de nouvelles choses à découvrir.',
        'You’re looking for an active, fairly structured retirement, with more social contact and new things to explore.',
        locale,
      ),
    )
  } else if (matching.needForStructure === 'high' && wantsSocial) {
    sentences.push(
      t(
        'Vous semblez chercher un rythme assez structuré, avec davantage de contacts sociaux dans vos semaines.',
        'You seem to be looking for a fairly structured rhythm, with more social contact in your weeks.',
        locale,
      ),
    )
  } else if (matching.needForStructure === 'high') {
    sentences.push(
      t(
        'Vous semblez chercher un nouveau rythme assez structuré, qui donne un cap à vos journées.',
        'You seem to be looking for a fairly structured new rhythm that gives your days a sense of direction.',
        locale,
      ),
    )
  } else if (matching.needForStructure === 'low' && wantsTravel) {
    sentences.push(
      t(
        'Vous semblez à l’aise avec des journées plus ouvertes, et attiré·e par les voyages et les découvertes.',
        'You seem comfortable with more open days, and drawn to travel and discovery.',
        locale,
      ),
    )
  } else if (wantsSocial) {
    sentences.push(
      t(
        'Retrouver davantage de contacts sociaux semble particulièrement important pour vous dans cette nouvelle étape.',
        'Rebuilding more social contact seems especially important for you in this next chapter.',
        locale,
      ),
    )
  } else if (wantsUseful) {
    sentences.push(
      t(
        'Continuer à vous sentir utile et à contribuer semble compter beaucoup pour vous.',
        'Continuing to feel useful and to contribute seems to matter a lot to you.',
        locale,
      ),
    )
  } else {
    sentences.push(
      t(
        'Vous cherchez ce qui pourrait donner du sens et du goût à cette nouvelle étape.',
        'You’re looking for what could give meaning and shape to this next chapter.',
        locale,
      ),
    )
  }

  // Sentence 2 — how they approach novelty / projects
  if (matching.adventureLevel === 'moderate' || matching.comfortDoingThingsAlone === 'low') {
    sentences.push(
      t(
        'Vous aimez avoir des projets, mais vous préférez savoir à quoi vous attendre avant de vous lancer.',
        'You like having projects, but you prefer knowing what to expect before you jump in.',
        locale,
      ),
    )
  } else if (matching.adventureLevel === 'high' && wantsProjects) {
    sentences.push(
      t(
        'Vous semblez ouvert·e à explorer de nouveaux projets et à essayer des choses sans trop attendre.',
        'You seem open to exploring new projects and trying things without waiting too long.',
        locale,
      ),
    )
  } else if (matching.adventureLevel === 'low') {
    sentences.push(
      t(
        'Vous préférez souvent avancer à partir de cadres familiers et rassurants.',
        'You often prefer to move forward from familiar, reassuring settings.',
        locale,
      ),
    )
  } else if (wantsProjects || wantsUseful) {
    sentences.push(
      t(
        'Des projets concrets et le sentiment d’avancer à votre rythme semblent bien vous convenir.',
        'Concrete projects and a sense of progressing at your own pace seem to suit you well.',
        locale,
      ),
    )
  } else if (wantsTravel || matching.interests.includes('learning')) {
    sentences.push(
      t(
        'Apprendre, découvrir et garder de la curiosité semblent faire partie de ce que vous recherchez.',
        'Learning, discovering, and staying curious seem part of what you’re looking for.',
        locale,
      ),
    )
  }

  // Optional third sentence — only if we have a distinct remaining signal
  if (
    sentences.length < 3 &&
    matching.comfortDoingThingsAlone === 'low' &&
    !sentences.some((s) => /savoir à quoi|knowing what to expect/i.test(s))
  ) {
    sentences.push(
      t(
        'Rejoindre seul un groupe nouveau peut être un frein — un accompagnement plus doux pourrait aider.',
        'Joining a new group alone can feel like a barrier — gentler support could help.',
        locale,
      ),
    )
  }

  return sentences.slice(0, 3).join(' ')
}

export type BilanPriority = { id: string; label: string }

/**
 * 3–4 short priorities for the post-Bilan page (no scores, no diagnosis).
 */
export function buildBilanPriorities(
  answers: AssessmentAnswers,
  locale: Locale,
): BilanPriority[] {
  const matching = matchingFromAnswers(answers)
  const priorities: Array<{ id: string; label: string; weight: number }> = []

  const add = (id: string, fr: string, en: string, weight: number) => {
    if (priorities.some((p) => p.id === id)) return
    priorities.push({ id, label: t(fr, en, locale), weight })
  }

  if (
    matching.wantMoreOf.includes('social_contact') ||
    matching.ambitions.includes('meet_people') ||
    matching.helpTopics.includes('social') ||
    matching.socialNetworkStrength === 'few_around' ||
    matching.socialNetworkStrength === 'often_alone'
  ) {
    add(
      'social',
      'Retrouver davantage de vie sociale',
      'Rebuild more social life',
      10,
    )
  }

  if (
    matching.needForStructure === 'high' ||
    matching.wantMoreOf.includes('structure') ||
    matching.helpTopics.includes('structure')
  ) {
    add(
      'structure',
      'Garder un rythme assez structuré',
      'Keep a fairly structured rhythm',
      9,
    )
  }

  if (
    matching.interests.includes('travel') ||
    matching.wantMoreOf.includes('travel') ||
    matching.ambitions.includes('travel_more') ||
    matching.wantMoreOf.includes('new_experiences')
  ) {
    add(
      'travel',
      'Voyager et découvrir',
      'Travel and discover',
      8,
    )
  }

  if (
    matching.wantMoreOf.includes('usefulness') ||
    matching.ambitions.includes('volunteer') ||
    matching.helpTopics.includes('volunteering') ||
    matching.helpTopics.includes('transmitting')
  ) {
    add(
      'useful',
      'Continuer à vous sentir utile',
      'Keep feeling useful',
      7,
    )
  }

  if (
    matching.wantMoreOf.includes('learning') ||
    matching.interests.includes('learning') ||
    matching.ambitions.includes('learn_something') ||
    matching.helpTopics.includes('learning')
  ) {
    add('learn', 'Apprendre de nouvelles choses', 'Learn new things', 6)
  }

  if (
    matching.wantMoreOf.includes('activity') ||
    matching.interests.includes('sport') ||
    matching.ambitions.includes('take_up_sport')
  ) {
    add('active', 'Rester actif·ve au quotidien', 'Stay active day to day', 5)
  }

  if (
    matching.wantMoreOf.includes('personal_projects') ||
    matching.wantMoreOf.includes('starting_something') ||
    matching.ambitions.includes('small_business') ||
    matching.ambitions.includes('creative_project')
  ) {
    add(
      'projects',
      'Construire un projet personnel',
      'Build a personal project',
      5,
    )
  }

  if (matching.comfortDoingThingsAlone === 'low') {
    add(
      'alone',
      'Essayer des activités sans vous sentir seul·e',
      'Try activities without feeling alone',
      4,
    )
  }

  if (priorities.length === 0) {
    add(
      'pace',
      'Avancer à votre rythme',
      'Move forward at your own pace',
      1,
    )
    add(
      'explore',
      'Découvrir ce qui vous attire vraiment',
      'Discover what truly draws you in',
      1,
    )
    add(
      'support',
      'Être accompagné·e dans cette transition',
      'Feel supported through this transition',
      1,
    )
  }

  return priorities
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4)
    .map(({ id, label }) => ({ id, label }))
}

/** @deprecated Prefer buildBilanSynthesis / buildBilanPriorities for the map page. */
export function buildBilanSignals(
  answers: AssessmentAnswers,
  locale: Locale,
): string[] {
  const synthesis = buildBilanSynthesis(answers, locale)
  return synthesis ? [synthesis] : []
}

/** Kept for any legacy callers — themes/areas no longer shown on the map page. */
export function getMapContent(
  answers: AssessmentAnswers,
  locale: Locale = 'fr',
): {
  summary: string
  signals: string[]
  priorities: BilanPriority[]
  synthesis: string
} {
  const synthesis = buildBilanSynthesis(answers, locale)
  const priorities = buildBilanPriorities(answers, locale)
  return {
    summary: synthesis,
    signals: synthesis ? [synthesis] : [],
    priorities,
    synthesis,
  }
}
