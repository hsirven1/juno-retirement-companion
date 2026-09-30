import type { AssessmentAnswers, AssessmentOption, AssessmentQuestion } from '../types'

export const OTHER_INTEREST_ID = 'other'
export const OTHER_INTEREST_TEXT_KEY = 'interestsOther'

function opt(id: string, fr: string, en: string): AssessmentOption {
  return { id, label: { fr, en } }
}

function t(fr: string, en: string) {
  return { fr, en }
}

/** Shown only when joining alone is not easy. */
export function shouldAskJoiningEasier(answers: AssessmentAnswers): boolean {
  const comfort = answers.aloneComfort
  return typeof comfort === 'string' && comfort !== 'go_easily'
}

/**
 * Happy Retraite bilan — grouped by pillar, ~18 short questions (one branch).
 * Stored answers use option ids (language-neutral). No amounts, no medical
 * questions.
 */
export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'retirementStage',
    section: t('Votre situation', 'Your situation'),
    prompt: t(
      'Où en êtes-vous dans votre parcours vers la retraite ?',
      'Where are you in your path toward retirement?',
    ),
    type: 'single',
    layout: 'list',
    advance: 'continue',
    options: [
      opt('still_working', 'Je travaille encore', 'I am still working'),
      opt(
        'retiring_soon',
        'Je pars à la retraite bientôt',
        'I am retiring soon',
      ),
      opt(
        'recently_retired',
        'Je suis à la retraite depuis moins de 2 ans',
        'I retired less than 2 years ago',
      ),
      opt(
        'retired_years',
        'Je suis à la retraite depuis plusieurs années',
        'I have been retired for several years',
      ),
    ],
  },
  {
    id: 'location',
    section: t('Votre situation', 'Your situation'),
    prompt: t('Où habitez-vous ?', 'Where do you live?'),
    helper: t(
      'Votre ville ou votre code postal, pour vous proposer des activités près de chez vous.',
      'Your town or postcode, so we can suggest activities near you.',
    ),
    type: 'text',
  },
  {
    id: 'careerFamily',
    section: t('Votre situation', 'Your situation'),
    prompt: t(
      'Dans quel univers professionnel évoluez-vous ou évoluiez-vous surtout ?',
      'Which professional world do you (or did you) mainly work in?',
    ),
    helper: t(
      'Pas besoin d’un CV — une grande famille de métiers suffit.',
      'No CV needed — a broad field is enough.',
    ),
    type: 'single',
    layout: 'grid',
    advance: 'continue',
    options: [
      opt('engineering', 'Technique / ingénierie', 'Technical / engineering'),
      opt('management', 'Management / direction', 'Management / leadership'),
      opt('education', 'Éducation / formation', 'Education / training'),
      opt('healthcare', 'Santé / soin', 'Healthcare / care'),
      opt('public_sector', 'Fonction publique', 'Public sector'),
      opt('entrepreneurship', 'Entrepreneuriat / commerce', 'Entrepreneurship / business'),
      opt('creative', 'Création / communication', 'Creative / communication'),
      opt('unpaid_care', 'Aidant·e / responsabilités familiales', 'Caregiving / family responsibilities'),
      opt('other', 'Autre', 'Other'),
    ],
  },
  {
    id: 'livingSituation',
    section: t('Votre situation', 'Your situation'),
    prompt: t(
      'Aujourd’hui, vous vivez plutôt…',
      'Today, you mostly live…',
    ),
    type: 'single',
    layout: 'list',
    options: [
      opt('alone', 'Seul·e', 'Alone'),
      opt('with_partner', 'Avec un·e partenaire', 'With a partner'),
      opt('with_family', 'Avec de la famille / d’autres personnes', 'With family / others'),
      opt('other', 'Autre situation', 'Another situation'),
    ],
  },
  {
    id: 'familySituation',
    section: t('Votre situation', 'Your situation'),
    prompt: t(
      'Concernant vos enfants, si cela s’applique…',
      'About children, if it applies…',
    ),
    helper: t(
      'Vous pouvez passer si ce n’est pas pertinent.',
      'You can skip this if it is not relevant.',
    ),
    type: 'single',
    layout: 'list',
    advance: 'continue',
    options: [
      opt('children_nearby', 'Des enfants près de moi', 'Children nearby'),
      opt('children_far', 'Des enfants plus loin', 'Children farther away'),
      opt('no_children', 'Pas d’enfants / pas concerné·e', 'No children / not relevant'),
      opt('other', 'Autre', 'Other'),
    ],
  },
  {
    id: 'financialConfidence',
    section: t('Finances', 'Finances'),
    prompt: t(
      'Face aux questions d’argent et de démarches liées à la retraite, vous vous sentez plutôt…',
      'When it comes to money and retirement paperwork, you feel…',
    ),
    helper: t(
      'Aucun montant ne vous sera demandé.',
      'We will never ask you for any amounts.',
    ),
    type: 'single',
    layout: 'list',
    options: [
      opt('low', 'Un peu perdu·e, j’aimerais être guidé·e', 'A bit lost — I’d like some guidance'),
      opt('medium', 'Je m’en sors, mais certains points restent flous', 'I manage, but some things are unclear'),
      opt('high', 'À l’aise avec ces sujets', 'Comfortable with these topics'),
    ],
  },
  {
    id: 'financialTopics',
    section: t('Finances', 'Finances'),
    prompt: t(
      'Sur quels sujets aimeriez-vous y voir plus clair ?',
      'Which topics would you like more clarity on?',
    ),
    stagePrompts: {
      pre: t(
        'Pour préparer votre départ, sur quels sujets aimeriez-vous y voir plus clair ?',
        'To prepare for retirement, which topics would you like more clarity on?',
      ),
      retired: t(
        'Côté finances, sur quels sujets aimeriez-vous y voir plus clair ?',
        'On the money side, which topics would you like more clarity on?',
      ),
    },
    type: 'multiple',
    layout: 'grid',
    exclusiveOption: 'nothing_particular',
    options: [
      opt('retirement_application', 'Les démarches pour demander ma retraite', 'How to apply for my pension'),
      opt('entitlements', 'Toucher tout ce à quoi j’ai droit', 'Getting everything I’m entitled to'),
      opt('pension_income', 'Comprendre ma pension', 'Understanding my pension income'),
      opt('budget', 'Organiser mon budget', 'Organising my budget'),
      opt('savings', 'Que faire de mon épargne', 'What to do with my savings'),
      opt('investing', 'Investir', 'Investing'),
      opt('property', 'Mon logement / l’immobilier', 'My home / property'),
      opt('inheritance', 'La transmission / la succession', 'Passing on / inheritance'),
      opt('extra_income', 'Avoir un complément de revenus', 'Earning some extra income'),
      opt('nothing_particular', 'Rien de particulier', 'Nothing in particular'),
    ],
  },
  {
    id: 'activityLevel',
    section: t('Santé & forme', 'Health & fitness'),
    prompt: t(
      'En ce moment, vous bougez plutôt…',
      'At the moment, how much do you move?',
    ),
    type: 'single',
    layout: 'list',
    options: [
      opt('low', 'Assez peu', 'Not much'),
      opt('moderate', 'Un peu, sans trop de régularité', 'A bit, not very regularly'),
      opt('active', 'Régulièrement, je suis plutôt actif·ve', 'Regularly — I’m fairly active'),
    ],
  },
  {
    id: 'physicalPreferences',
    section: t('Santé & forme', 'Health & fitness'),
    prompt: t(
      'Qu’est-ce qui vous donnerait envie de bouger ?',
      'What would make you want to move?',
    ),
    helper: t(
      'Objectifs ou activités : choisissez ce qui vous parle.',
      'Goals or activities — pick whatever speaks to you.',
    ),
    type: 'multiple',
    layout: 'chips',
    exclusiveOption: 'nothing_particular',
    options: [
      opt('move_more', 'Bouger davantage', 'Moving more'),
      opt('stay_active', 'Garder la forme', 'Staying in shape'),
      opt('strength', 'Me renforcer', 'Getting stronger'),
      opt('flexibility', 'Gagner en souplesse', 'Improving flexibility'),
      opt('try_new_sport', 'Essayer un nouveau sport', 'Trying a new sport'),
      opt('walking', 'Marche / randonnée', 'Walking / hiking'),
      opt('swimming', 'Natation / aquagym', 'Swimming / aqua fitness'),
      opt('group_exercise', 'Cours collectifs (gym douce, yoga…)', 'Group classes (gentle gym, yoga…)'),
      opt('gym', 'Salle de sport', 'Gym'),
      opt('outdoor', 'Activités en plein air', 'Outdoor activities'),
      opt('cycling', 'Vélo', 'Cycling'),
      opt('dance', 'Danse', 'Dance'),
      opt('nothing_particular', 'Rien de particulier pour l’instant', 'Nothing in particular for now'),
    ],
  },
  {
    id: 'socialNetwork',
    section: t('Vie sociale', 'Social life'),
    prompt: t(
      'Aujourd’hui, votre vie sociale ressemble plutôt à…',
      'Today, your social life feels more like…',
    ),
    type: 'single',
    layout: 'list',
    options: [
      opt('regular', 'Je vois des gens régulièrement', 'I see people regularly'),
      opt(
        'close_few',
        'J’ai quelques personnes proches, mais peu de rendez-vous réguliers',
        'I have a few close people, but not many regular plans',
      ),
      opt(
        'rare',
        'Je connais des gens, mais je les vois rarement',
        'I know people but see them rarely',
      ),
      opt(
        'few_around',
        'J’ai relativement peu de personnes autour de moi',
        'I have relatively few people around me',
      ),
      opt(
        'often_alone',
        'Je me retrouve souvent seul·e',
        'I often find myself alone',
      ),
    ],
  },
  {
    id: 'socialGoals',
    section: t('Vie sociale', 'Social life'),
    prompt: t(
      'Côté vie sociale, qu’est-ce qui vous ferait du bien ?',
      'On the social side, what would do you good?',
    ),
    type: 'multiple',
    layout: 'grid',
    exclusiveOption: 'nothing_particular',
    options: [
      opt('maintain_relationships', 'Garder le lien avec mes proches', 'Keeping in touch with my loved ones'),
      opt('new_friends', 'Me faire de nouveaux amis', 'Making new friends'),
      opt('group_activities', 'Faire plus d’activités en groupe', 'Doing more group activities'),
      opt('outing_companions', 'Trouver des personnes pour sortir ou voyager', 'Finding people for outings or trips'),
      opt('partner', 'Faire une rencontre amoureuse', 'Meeting a partner'),
      opt('regular_occasions', 'Avoir plus d’occasions régulières de voir du monde', 'More regular chances to see people'),
      opt('nothing_particular', 'Rien de particulier, ma vie sociale me convient', 'Nothing in particular — my social life suits me'),
    ],
  },
  {
    id: 'aloneComfort',
    section: t('Vie sociale', 'Social life'),
    prompt: t(
      'Si une activité vous intéressait mais que vous n’y connaissiez personne, comment vous sentiriez-vous ?',
      'If you were interested in a new activity but knew nobody there, how would you feel?',
    ),
    type: 'single',
    layout: 'list',
    options: [
      opt('go_easily', 'J’y irais facilement', 'I’d go easily'),
      opt(
        'a_bit_apprehensive',
        'J’y irais, mais avec un peu d’appréhension',
        'I’d go, but I’d feel a little apprehensive',
      ),
      opt(
        'prefer_known',
        'Je préférerais vraiment connaître quelqu’un sur place',
        'I’d really prefer to know someone there',
      ),
      opt(
        'might_give_up',
        'Je pourrais renoncer si je devais y aller seul·e',
        'I might give up if I had to go alone',
      ),
    ],
  },
  {
    id: 'joiningEasier',
    section: t('Vie sociale', 'Social life'),
    prompt: t(
      'Qu’est-ce qui rendrait plus facile de rejoindre une activité ?',
      'What would make joining an activity easier?',
    ),
    type: 'multiple',
    layout: 'chips',
    showIf: shouldAskJoiningEasier,
    options: [
      opt('small_group', 'Un petit groupe', 'A small group'),
      opt(
        'others_alone',
        'Savoir que d’autres viennent aussi seul·e·s',
        'Knowing others also come alone',
      ),
      opt('welcomed', 'Être accueilli·e par quelqu’un', 'Being welcomed by someone'),
      opt(
        'speak_organizer',
        'Parler d’abord à l’organisateur·rice',
        'Speaking with the organizer first',
      ),
      opt(
        'clear_activity',
        'Avoir une activité claire à faire',
        'Having a clear activity to do',
      ),
      opt('go_with_someone', 'Y aller avec quelqu’un', 'Going with someone'),
      opt(
        'know_what_to_expect',
        'Savoir exactement à quoi s’attendre',
        'Knowing exactly what to expect',
      ),
    ],
  },
  {
    id: 'interests',
    section: t('Projets & loisirs', 'Projects & leisure'),
    prompt: t(
      'Quelles choses vous intéressent, même si vous ne les pratiquez pas aujourd’hui ?',
      'What interests you, even if you don’t do it today?',
    ),
    helper: t(
      'Choisissez librement — ce n’est pas une liste de ce que vous faites déjà.',
      'Choose freely — this is not a list of what you already do.',
    ),
    type: 'multiple',
    layout: 'chips',
    allowOther: true,
    otherOptionId: OTHER_INTEREST_ID,
    otherLabel: t('Autre', 'Other'),
    options: [
      opt('travel', 'Voyage', 'Travel'),
      opt('culture', 'Culture', 'Culture'),
      opt('photography', 'Photographie', 'Photography'),
      opt('music', 'Musique', 'Music'),
      opt('reading', 'Lecture', 'Reading'),
      opt('gardening', 'Jardinage', 'Gardening'),
      opt('cooking', 'Cuisine', 'Cooking'),
      opt('sport', 'Sport', 'Sport'),
      opt('walking', 'Marche', 'Walking'),
      opt('nature', 'Nature', 'Nature'),
      opt('diy', 'Bricolage / projets maison', 'DIY / home projects'),
      opt('technology', 'Technologie', 'Technology'),
      opt('languages', 'Langues', 'Languages'),
      opt('courses', 'Cours et ateliers', 'Courses and workshops'),
      opt('history', 'Histoire', 'History'),
      opt('volunteering', 'Bénévolat', 'Volunteering'),
      opt('entrepreneurship', 'Entrepreneuriat', 'Entrepreneurship'),
      opt('property', 'Immobilier / investissement', 'Property / investing'),
      opt('crafts', 'Artisanat', 'Crafts'),
      opt('games', 'Jeux', 'Games'),
      opt('social_activities', 'Activités sociales', 'Social activities'),
    ],
  },
  {
    id: 'ambitions',
    section: t('Projets & loisirs', 'Projects & leisure'),
    prompt: t(
      'Y a-t-il des choses que vous aimeriez construire ou explorer dans cette prochaine étape ?',
      'Are there things you’d like to build or explore in this next phase?',
    ),
    type: 'multiple',
    layout: 'grid',
    exclusiveOption: 'not_sure',
    options: [
      opt('volunteer', 'Faire du bénévolat', 'Volunteer'),
      opt('small_business', 'Lancer une petite activité', 'Start a small business'),
      opt('travel_more', 'Voyager davantage', 'Travel more'),
      opt('learn_something', 'Apprendre quelque chose', 'Learn something'),
      opt('learn_language', 'Apprendre une langue', 'Learn a language'),
      opt('take_up_sport', 'Prendre un sport', 'Take up a sport'),
      opt('join_group', 'Rejoindre un groupe', 'Join a group'),
      opt('creative_project', 'Un projet créatif', 'A creative project'),
      opt('home_project', 'Un projet pour la maison ou le jardin', 'A home or garden project'),
      opt('lifelong_dream', 'Réaliser un projet de longue date', 'Fulfil a long-held dream'),
      opt('family_time', 'Passer plus de temps en famille', 'Spend more time with family'),
      opt('meet_people', 'Rencontrer de nouvelles personnes', 'Meet new people'),
      opt('not_sure', 'Je ne sais pas encore', 'Not sure yet'),
    ],
  },
  {
    id: 'emptyDays',
    section: t('Votre rythme', 'Your pace'),
    prompt: t(
      'Imaginez plusieurs jours sans rien de prévu. Comment cela vous fait-il vous sentir ?',
      'Imagine several days with nothing planned. How does that feel?',
    ),
    type: 'single',
    layout: 'list',
    options: [
      opt('relaxing', 'Reposant', 'Relaxing'),
      opt('fine_sometimes', 'Bien parfois', 'Fine sometimes'),
      opt('bored_quickly', 'Je m’ennuie vite', 'I get bored quickly'),
      opt(
        'prefer_planned',
        'Je préfère avoir des choses prévues',
        'I prefer having things planned',
      ),
      opt(
        'uneasy_empty',
        'Ne rien avoir à faire me met mal à l’aise',
        'Having nothing to do makes me uneasy',
      ),
    ],
  },
  {
    id: 'novelty',
    section: t('Votre rythme', 'Your pace'),
    prompt: t(
      'Quand une nouvelle opportunité se présente, vous êtes plutôt…',
      'When a new opportunity comes up, you’re more…',
    ),
    type: 'single',
    layout: 'list',
    options: [
      opt(
        'try_freely',
        'J’aime essayer sans trop réfléchir',
        'I like trying things without overthinking',
      ),
      opt(
        'curious_prepared',
        'Curieux·se, mais j’aime savoir à quoi m’attendre',
        'Curious, but I like knowing what to expect',
      ),
      opt(
        'need_reassurance',
        'J’ai besoin d’être un peu rassuré·e d’abord',
        'I need some reassurance first',
      ),
      opt(
        'prefer_familiar',
        'Je préfère en général le familier',
        'I generally prefer familiar things',
      ),
    ],
  },
  {
    id: 'challenges',
    section: t('Votre rythme', 'Your pace'),
    prompt: t(
      'Qu’est-ce qui peut être un peu difficile en ce moment ?',
      'What can feel a bit difficult right now?',
    ),
    helper: t(
      'Il n’y a pas de bonne ou de mauvaise réponse.',
      'There are no right or wrong answers.',
    ),
    type: 'multiple',
    layout: 'grid',
    exclusiveOption: 'nothing_particular',
    options: [
      opt('loss_of_structure', 'Perdre la structure du travail', 'Losing work structure'),
      opt('empty_time', 'Avoir trop de temps vide', 'Having too much empty time'),
      opt('meeting_people', 'Rencontrer des gens', 'Meeting people'),
      opt('doing_things_alone', 'Faire des choses seul·e', 'Doing things alone'),
      opt('knowing_what_i_want', 'Savoir ce que je veux', 'Knowing what I want'),
      opt('feeling_useful', 'Me sentir utile', 'Feeling useful'),
      opt(
        'leaving_identity',
        'Laisser derrière mon identité professionnelle',
        'Leaving my professional identity behind',
      ),
      opt(
        'finding_activities',
        'Trouver des activités qui me conviennent',
        'Finding activities that suit me',
      ),
      opt('staying_active', 'Rester actif·ve', 'Staying active'),
      opt('nothing_particular', 'Rien de particulier', 'Nothing in particular'),
    ],
  },
  {
    id: 'helpTopics',
    section: t('Votre rythme', 'Your pace'),
    prompt: t(
      'Pour commencer, sur quoi aimeriez-vous être aidé·e en priorité ?',
      'To start with, what would you most like help with?',
    ),
    type: 'multiple',
    layout: 'grid',
    exclusiveOption: 'not_sure',
    options: [
      opt('structure', 'Construire une nouvelle routine', 'Building a new routine'),
      opt('social', 'Retrouver une vie sociale', 'Rebuilding social life'),
      opt('finding_activities', 'Trouver des activités', 'Finding activities'),
      opt('activities_alone', 'Essayer des choses seul·e', 'Trying things alone'),
      opt('personal_project', 'Lancer un projet', 'Starting a project'),
      opt('volunteering', 'Le bénévolat', 'Volunteering'),
      opt('travel', 'Voyager', 'Travel'),
      opt('staying_active', 'Rester actif·ve', 'Staying active'),
      opt('learning', 'Apprendre', 'Learning'),
      opt(
        'practical_transition',
        'Mes démarches et mes finances',
        'My paperwork and finances',
      ),
      opt('not_sure', 'Je ne sais pas encore', 'I’m not sure yet'),
    ],
  },
]

/** @deprecated kept for any leftover imports during transition */
export const OTHER_DREAM = OTHER_INTEREST_ID
export const UNKNOWN_DREAM = 'not_sure'
