import type { Mentor } from '../types'

/**
 * Prototype / demo mentors only — fictional personas for matching tests.
 * Never present as real people.
 */
export const DEMO_MENTORS_DISCLAIMER = {
  fr: 'Profils de démonstration — personas fictifs pour tester le matching.',
  en: 'Demo profiles — fictional personas for testing matching.',
} as const

export const mentors: Mentor[] = [
  {
    id: 'mentor-claire',
    firstName: 'Claire',
    age: 64,
    city: 'Lille',
    yearsRetired: 2,
    languages: ['fr', 'en'],
    photoUrl: '/mentors/claire.png',
    careerFamily: 'engineering',
    livingSituation: 'with_partner',
    familySituation: 'children_far',
    socialStyle: 'reserved',
    adventureLevel: 'moderate',
    interests: ['learning', 'outdoors', 'culture', 'cooking'],
    challengesFaced: ['loss_of_structure', 'joining_alone', 'identity_shift'],
    topicsTheyCanHelpWith: ['structure', 'activities_alone', 'learning', 'social'],
    personalityTraits: ['curious', 'steady', 'practical'],
    copy: {
      fr: {
        formerCareer: 'Ingénieure informatique',
        formerIndustry: 'Technologie',
        familySituationLabel: 'Enfants loin',
        livingSituationLabel: 'Vit avec son conjoint',
        interestLabels: ['Apprendre', 'Nature', 'Culture', 'Cuisine'],
        challengeLabels: [
          'Perte de rythme',
          'Rejoindre une activité seule',
          'Changement d’identité',
        ],
        helpTopicLabels: [
          'Retrouver une structure',
          'Essayer des activités en solo',
          'Apprendre',
          'Vie sociale douce',
        ],
        personalityTraitLabels: ['Curieuse', 'Posée', 'Pratique'],
        availability: 'En semaine, en journée',
        shortBio:
          'Après 30 ans dans la tech, Claire a mis du temps à accepter qu’elle n’avait plus besoin d’un emploi pour avoir une place.',
        retirementStory:
          'Les premiers mois, elle a trop planifié. Puis elle a appris à garder un ou deux rendez-vous fixes, et à oser y aller seule.',
        quote:
          'Ce n’est pas d’avoir un agenda plein qui m’a manqué. C’est de savoir où j’allais le mardi matin.',
      },
      en: {
        formerCareer: 'Software engineer',
        formerIndustry: 'Technology',
        familySituationLabel: 'Children live far away',
        livingSituationLabel: 'Lives with her partner',
        interestLabels: ['Learning', 'Outdoors', 'Culture', 'Cooking'],
        challengeLabels: [
          'Loss of structure',
          'Joining activities alone',
          'Identity shift',
        ],
        helpTopicLabels: [
          'Finding structure',
          'Trying things alone',
          'Learning',
          'Gentle social life',
        ],
        personalityTraitLabels: ['Curious', 'Steady', 'Practical'],
        availability: 'Weekdays, daytime',
        shortBio:
          'After 30 years in tech, Claire needed time to accept that she no longer needed a job to feel she belonged.',
        retirementStory:
          'At first she over-planned. Then she kept one or two fixed appointments and learned to show up alone.',
        quote:
          'I didn’t miss a packed calendar. I missed knowing where I was going on Tuesday morning.',
      },
    },
  },
  {
    id: 'mentor-marc',
    firstName: 'Marc',
    age: 67,
    city: 'Roubaix',
    yearsRetired: 4,
    languages: ['fr'],
    careerFamily: 'education',
    livingSituation: 'alone',
    familySituation: 'children_nearby',
    socialStyle: 'outgoing',
    adventureLevel: 'moderate',
    interests: ['community', 'learning', 'culture', 'volunteering'],
    challengesFaced: ['isolation', 'finding_purpose'],
    topicsTheyCanHelpWith: ['social', 'volunteering', 'learning', 'transmitting'],
    personalityTraits: ['warm', 'talkative', 'encouraging'],
    copy: {
      fr: {
        formerCareer: 'Professeur d’histoire',
        formerIndustry: 'Éducation',
        familySituationLabel: 'Enfants à proximité',
        livingSituationLabel: 'Vit seul',
        interestLabels: ['Lien social', 'Apprendre', 'Culture', 'Bénévolat'],
        challengeLabels: ['Isolement', 'Sentiment d’utilité'],
        helpTopicLabels: [
          'Retrouver du lien',
          'Bénévolat',
          'Apprendre',
          'Transmettre',
        ],
        personalityTraitLabels: ['Chaleureux', 'Bavard', 'Encourageant'],
        availability: 'Matins et débuts d’après-midi',
        shortBio:
          'Marc pensait que la retraite serait surtout du temps libre. Il a découvert qu’il avait besoin d’être utile auprès d’autres.',
        retirementStory:
          'Après une période trop calme, il a rejoint une association de lecture et accompagne occasionnellement des jeunes.',
        quote:
          'J’avais besoin d’être attendu quelque part. Pas tous les jours — juste assez.',
      },
      en: {
        formerCareer: 'History teacher',
        formerIndustry: 'Education',
        familySituationLabel: 'Children nearby',
        livingSituationLabel: 'Lives alone',
        interestLabels: ['Community', 'Learning', 'Culture', 'Volunteering'],
        challengeLabels: ['Isolation', 'Sense of purpose'],
        helpTopicLabels: [
          'Rebuilding connection',
          'Volunteering',
          'Learning',
          'Passing on experience',
        ],
        personalityTraitLabels: ['Warm', 'Talkative', 'Encouraging'],
        availability: 'Mornings and early afternoons',
        shortBio:
          'Marc thought retirement would mostly mean free time. He discovered he still needed to feel useful to others.',
        retirementStory:
          'After a too-quiet stretch, he joined a reading association and occasionally mentors younger people.',
        quote:
          'I needed somewhere I was expected. Not every day — just enough.',
      },
    },
  },
  {
    id: 'mentor-sophie',
    firstName: 'Sophie',
    age: 62,
    city: 'Lille',
    yearsRetired: 1,
    languages: ['fr', 'en'],
    photoUrl: '/mentors/sophie.png',
    careerFamily: 'management',
    livingSituation: 'with_partner',
    familySituation: 'children_nearby',
    socialStyle: 'balanced',
    adventureLevel: 'low',
    interests: ['culture', 'travel', 'cooking', 'learning'],
    challengesFaced: ['loss_of_structure', 'overcommitted', 'identity_shift'],
    topicsTheyCanHelpWith: ['structure', 'personal_project', 'travel', 'social'],
    personalityTraits: ['organized', 'reflective', 'direct'],
    copy: {
      fr: {
        formerCareer: 'Directrice marketing',
        formerIndustry: 'Industrie',
        familySituationLabel: 'Enfants à proximité',
        livingSituationLabel: 'Vit avec son conjoint',
        interestLabels: ['Culture', 'Voyage', 'Cuisine', 'Apprendre'],
        challengeLabels: [
          'Perte de structure',
          'Trop d’engagements',
          'Changement d’identité',
        ],
        helpTopicLabels: [
          'Rythme réaliste',
          'Projet perso',
          'Voyage',
          'Vie sociale',
        ],
        personalityTraitLabels: ['Organisée', 'Réfléchie', 'Directe'],
        availability: 'Deux créneaux par semaine',
        shortBio:
          'Sophie a quitté un poste très structurant. Elle apprend à ne pas remplir sa retraite comme un planning professionnel.',
        retirementStory:
          'Elle a dit oui à trop de choses au début. Aujourd’hui elle protège des plages vides et un projet photo.',
        quote:
          'Je savais manager des équipes. Je savais moins manager mon propre temps.',
      },
      en: {
        formerCareer: 'Marketing director',
        formerIndustry: 'Industry',
        familySituationLabel: 'Children nearby',
        livingSituationLabel: 'Lives with her partner',
        interestLabels: ['Culture', 'Travel', 'Cooking', 'Learning'],
        challengeLabels: [
          'Loss of structure',
          'Overcommitting',
          'Identity shift',
        ],
        helpTopicLabels: [
          'Realistic rhythm',
          'Personal project',
          'Travel',
          'Social life',
        ],
        personalityTraitLabels: ['Organized', 'Reflective', 'Direct'],
        availability: 'Two slots a week',
        shortBio:
          'Sophie left a highly structured role. She is learning not to fill retirement like a work calendar.',
        retirementStory:
          'She said yes to too much at first. Now she protects empty time and a photography project.',
        quote:
          'I knew how to manage teams. I knew less how to manage my own time.',
      },
    },
  },
  {
    id: 'mentor-paul',
    firstName: 'Paul',
    age: 69,
    city: 'Tourcoing',
    yearsRetired: 5,
    languages: ['fr'],
    careerFamily: 'entrepreneurship',
    livingSituation: 'with_partner',
    familySituation: 'children_far',
    socialStyle: 'outgoing',
    adventureLevel: 'high',
    interests: ['business', 'travel', 'community', 'sport'],
    challengesFaced: ['finding_purpose', 'energy_or_health'],
    topicsTheyCanHelpWith: [
      'personal_project',
      'travel',
      'transmitting',
      'structure',
    ],
    personalityTraits: ['energetic', 'pragmatic', 'optimistic'],
    copy: {
      fr: {
        formerCareer: 'Entrepreneur',
        formerIndustry: 'Commerce',
        familySituationLabel: 'Enfants loin',
        livingSituationLabel: 'Vit avec sa conjointe',
        interestLabels: ['Projets', 'Voyage', 'Réseau', 'Sport'],
        challengeLabels: ['Sentiment d’utilité', 'Énergie'],
        helpTopicLabels: [
          'Lancer un projet',
          'Petite activité',
          'Voyage',
          'Transmettre',
        ],
        personalityTraitLabels: ['Énergique', 'Pragmatique', 'Optimiste'],
        availability: 'Flexible, plutôt le matin',
        shortBio:
          'Paul a vendu son entreprise et a lancé une petite activité de conseil ponctuel, sans reprendre un rythme de dirigeant.',
        retirementStory:
          'Il a d’abord trop voyagé pour fuir le vide, puis a trouvé un équilibre entre projets courts et vraie disponibilité.',
        quote:
          'Je n’avais pas besoin d’une deuxième carrière. Juste d’un fil conducteur.',
      },
      en: {
        formerCareer: 'Entrepreneur',
        formerIndustry: 'Retail',
        familySituationLabel: 'Children live far away',
        livingSituationLabel: 'Lives with his partner',
        interestLabels: ['Projects', 'Travel', 'Community', 'Sport'],
        challengeLabels: ['Sense of purpose', 'Energy'],
        helpTopicLabels: [
          'Starting a project',
          'Small business activity',
          'Travel',
          'Passing on experience',
        ],
        personalityTraitLabels: ['Energetic', 'Pragmatic', 'Optimistic'],
        availability: 'Flexible, mostly mornings',
        shortBio:
          'Paul sold his company and started occasional consulting — without returning to a founder’s pace.',
        retirementStory:
          'He traveled too much at first to escape the void, then found a balance between short projects and real availability.',
        quote:
          'I didn’t need a second career. Just a thread to follow.',
      },
    },
  },
  {
    id: 'mentor-nathalie',
    firstName: 'Nathalie',
    age: 63,
    city: 'Lille',
    yearsRetired: 3,
    languages: ['fr'],
    photoUrl: '/mentors/nathalie.png',
    careerFamily: 'healthcare',
    livingSituation: 'alone',
    familySituation: 'no_children',
    socialStyle: 'balanced',
    adventureLevel: 'moderate',
    interests: ['outdoors', 'volunteering', 'music', 'gardening'],
    challengesFaced: ['isolation', 'joining_alone', 'energy_or_health'],
    topicsTheyCanHelpWith: [
      'activities_alone',
      'social',
      'volunteering',
      'structure',
    ],
    personalityTraits: ['calm', 'attentive', 'grounded'],
    copy: {
      fr: {
        formerCareer: 'Infirmière',
        formerIndustry: 'Santé',
        familySituationLabel: 'Sans enfants',
        livingSituationLabel: 'Vit seule',
        interestLabels: ['Nature', 'Bénévolat', 'Musique', 'Jardin'],
        challengeLabels: [
          'Isolement',
          'Rejoindre une activité seule',
          'Énergie',
        ],
        helpTopicLabels: [
          'Essayer en solo',
          'Lien social',
          'Bénévolat',
          'Rythme doux',
        ],
        personalityTraitLabels: ['Calme', 'Attentive', 'Ancrée'],
        availability: 'Fin de matinée et après-midi',
        shortBio:
          'Nathalie a passé sa vie à prendre soin des autres. À la retraite, elle a dû apprendre à prendre soin de son propre rythme.',
        retirementStory:
          'Elle a commencé par marcher seule, puis a rejoint une chorale — le format lui a convenu sans pression.',
        quote:
          'Aller seule la première fois, c’est le plus dur. Après, le lieu devient familier.',
      },
      en: {
        formerCareer: 'Nurse',
        formerIndustry: 'Healthcare',
        familySituationLabel: 'No children',
        livingSituationLabel: 'Lives alone',
        interestLabels: ['Outdoors', 'Volunteering', 'Music', 'Gardening'],
        challengeLabels: [
          'Isolation',
          'Joining activities alone',
          'Energy',
        ],
        helpTopicLabels: [
          'Trying things alone',
          'Social connection',
          'Volunteering',
          'Gentle rhythm',
        ],
        personalityTraitLabels: ['Calm', 'Attentive', 'Grounded'],
        availability: 'Late mornings and afternoons',
        shortBio:
          'Nathalie spent her life caring for others. In retirement she had to learn to care for her own pace.',
        retirementStory:
          'She started by walking alone, then joined a choir — a format that suited her without pressure.',
        quote:
          'Going alone the first time is the hardest part. After that, the place becomes familiar.',
      },
    },
  },
  {
    id: 'mentor-jean',
    firstName: 'Jean',
    age: 66,
    city: 'Villeneuve-d’Ascq',
    yearsRetired: 2,
    languages: ['fr'],
    careerFamily: 'public_sector',
    livingSituation: 'with_partner',
    familySituation: 'children_nearby',
    socialStyle: 'reserved',
    adventureLevel: 'low',
    interests: ['gardening', 'learning', 'community', 'craft'],
    challengesFaced: ['loss_of_structure', 'identity_shift'],
    topicsTheyCanHelpWith: ['structure', 'volunteering', 'learning', 'social'],
    personalityTraits: ['discreet', 'reliable', 'thoughtful'],
    copy: {
      fr: {
        formerCareer: 'Cadre de la fonction publique',
        formerIndustry: 'Service public',
        familySituationLabel: 'Enfants à proximité',
        livingSituationLabel: 'Vit avec sa conjointe',
        interestLabels: ['Jardin', 'Apprendre', 'Quartier', 'Bricolage'],
        challengeLabels: ['Perte de structure', 'Changement d’identité'],
        helpTopicLabels: [
          'Structure',
          'Engagement local',
          'Apprendre',
          'Vie sociale',
        ],
        personalityTraitLabels: ['Discret', 'Fiable', 'Réfléchi'],
        availability: 'Mardi et jeudi matin',
        shortBio:
          'Jean a travaillé dans un environnement très cadré. Il a mis du temps à accepter une semaine moins prévisible.',
        retirementStory:
          'Un atelier régulier et un engagement municipal léger lui ont redonné des repères sans le surcharger.',
        quote:
          'J’avais besoin de quelques points fixes — pas d’un emploi déguisé.',
      },
      en: {
        formerCareer: 'Public-sector manager',
        formerIndustry: 'Public service',
        familySituationLabel: 'Children nearby',
        livingSituationLabel: 'Lives with his partner',
        interestLabels: ['Gardening', 'Learning', 'Local community', 'Craft'],
        challengeLabels: ['Loss of structure', 'Identity shift'],
        helpTopicLabels: [
          'Structure',
          'Local engagement',
          'Learning',
          'Social life',
        ],
        personalityTraitLabels: ['Discreet', 'Reliable', 'Thoughtful'],
        availability: 'Tuesday and Thursday mornings',
        shortBio:
          'Jean worked in a highly structured environment. It took time to accept a less predictable week.',
        retirementStory:
          'A regular workshop and light municipal volunteering gave him landmarks without overload.',
        quote:
          'I needed a few fixed points — not a disguised job.',
      },
    },
  },
  {
    id: 'mentor-anne',
    firstName: 'Anne',
    age: 61,
    city: 'Lille',
    yearsRetired: 3,
    languages: ['fr', 'en'],
    careerFamily: 'unpaid_care',
    livingSituation: 'with_family',
    familySituation: 'children_nearby',
    socialStyle: 'balanced',
    adventureLevel: 'moderate',
    interests: ['culture', 'volunteering', 'cooking', 'community'],
    challengesFaced: ['identity_shift', 'finding_purpose', 'joining_alone'],
    topicsTheyCanHelpWith: [
      'personal_project',
      'social',
      'activities_alone',
      'volunteering',
    ],
    personalityTraits: ['empathetic', 'creative', 'patient'],
    copy: {
      fr: {
        formerCareer: 'Aidante familiale à temps plein',
        formerIndustry: 'Hors emploi salarié',
        familySituationLabel: 'Enfants à proximité',
        livingSituationLabel: 'Vit avec sa famille',
        interestLabels: ['Culture', 'Bénévolat', 'Cuisine', 'Quartier'],
        challengeLabels: [
          'Changement d’identité',
          'Sentiment d’utilité',
          'Oser y aller seule',
        ],
        helpTopicLabels: [
          'Projet perso',
          'Vie sociale',
          'Essayer en solo',
          'Bénévolat',
        ],
        personalityTraitLabels: ['Empathique', 'Créative', 'Patiente'],
        availability: 'Après-midi en semaine',
        shortBio:
          'Anne n’a pas « quitté un poste ». Elle a quitté des années d’aide quotidienne et a dû reconstruire une place pour elle.',
        retirementStory:
          'Un atelier d’écriture et des sorties culturelles régulières l’ont aidée à se définir autrement que par le rôle d’aidante.',
        quote:
          'On m’a souvent demandé ce que je faisais « avant ». La vraie question, c’était ce que je voulais maintenant.',
      },
      en: {
        formerCareer: 'Full-time family caregiver',
        formerIndustry: 'Outside paid employment',
        familySituationLabel: 'Children nearby',
        livingSituationLabel: 'Lives with family',
        interestLabels: ['Culture', 'Volunteering', 'Cooking', 'Community'],
        challengeLabels: [
          'Identity shift',
          'Sense of purpose',
          'Going alone',
        ],
        helpTopicLabels: [
          'Personal project',
          'Social life',
          'Trying things alone',
          'Volunteering',
        ],
        personalityTraitLabels: ['Empathetic', 'Creative', 'Patient'],
        availability: 'Weekday afternoons',
        shortBio:
          'Anne did not “leave a job”. She left years of daily caregiving and had to rebuild a place for herself.',
        retirementStory:
          'A writing workshop and regular cultural outings helped her define herself beyond the caregiver role.',
        quote:
          'People often asked what I did “before”. The real question was what I wanted now.',
      },
    },
  },
  {
    id: 'mentor-luc',
    firstName: 'Luc',
    age: 68,
    city: 'Lille',
    yearsRetired: 6,
    languages: ['fr'],
    careerFamily: 'engineering',
    livingSituation: 'with_partner',
    familySituation: 'children_far',
    socialStyle: 'outgoing',
    adventureLevel: 'high',
    interests: ['volunteering', 'sport', 'community', 'outdoors'],
    challengesFaced: ['finding_purpose', 'overcommitted'],
    topicsTheyCanHelpWith: [
      'volunteering',
      'social',
      'structure',
      'transmitting',
    ],
    personalityTraits: ['active', 'sociable', 'straightforward'],
    copy: {
      fr: {
        formerCareer: 'Ingénieur travaux publics',
        formerIndustry: 'BTP',
        familySituationLabel: 'Enfants loin',
        livingSituationLabel: 'Vit avec sa conjointe',
        interestLabels: ['Bénévolat', 'Sport', 'Collectif', 'Plein air'],
        challengeLabels: ['Sentiment d’utilité', 'Trop d’engagements'],
        helpTopicLabels: [
          'Bénévolat',
          'Vie sociale',
          'Structure',
          'Transmettre',
        ],
        personalityTraitLabels: ['Actif', 'Sociable', 'Direct'],
        availability: 'Trois matins par semaine',
        shortBio:
          'Luc s’est beaucoup investi dans le bénévolat. Il aide ceux qui cherchent un engagement concret sans se perdre dedans.',
        retirementStory:
          'Il a commencé trop large, puis a choisi une association locale où il retrouve des collègues de cause chaque semaine.',
        quote:
          'Le bénévolat m’a sauvé — à condition de ne pas en faire un second métier.',
      },
      en: {
        formerCareer: 'Civil engineer',
        formerIndustry: 'Construction',
        familySituationLabel: 'Children live far away',
        livingSituationLabel: 'Lives with his partner',
        interestLabels: ['Volunteering', 'Sport', 'Community', 'Outdoors'],
        challengeLabels: ['Sense of purpose', 'Overcommitting'],
        helpTopicLabels: [
          'Volunteering',
          'Social life',
          'Structure',
          'Passing on experience',
        ],
        personalityTraitLabels: ['Active', 'Sociable', 'Straightforward'],
        availability: 'Three mornings a week',
        shortBio:
          'Luc invested heavily in volunteering. He helps people find concrete commitment without disappearing into it.',
        retirementStory:
          'He started too broadly, then chose one local association where he meets the same people each week.',
        quote:
          'Volunteering saved me — as long as I didn’t turn it into a second job.',
      },
    },
  },
  {
    id: 'mentor-isabelle',
    firstName: 'Isabelle',
    age: 65,
    city: 'Lambersart',
    yearsRetired: 4,
    languages: ['fr', 'en'],
    careerFamily: 'education',
    livingSituation: 'alone',
    familySituation: 'children_far',
    socialStyle: 'outgoing',
    adventureLevel: 'high',
    interests: ['travel', 'culture', 'learning', 'outdoors'],
    challengesFaced: ['isolation', 'joining_alone'],
    topicsTheyCanHelpWith: ['travel', 'activities_alone', 'social', 'learning'],
    personalityTraits: ['adventurous', 'independent', 'open'],
    copy: {
      fr: {
        formerCareer: 'Enseignante de langues',
        formerIndustry: 'Éducation',
        familySituationLabel: 'Enfants loin',
        livingSituationLabel: 'Vit seule',
        interestLabels: ['Voyage', 'Culture', 'Apprendre', 'Nature'],
        challengeLabels: ['Isolement', 'Rejoindre une activité seule'],
        helpTopicLabels: [
          'Voyage',
          'Essayer en solo',
          'Vie sociale',
          'Apprendre',
        ],
        personalityTraitLabels: ['Aventurière', 'Indépendante', 'Ouverte'],
        availability: 'Hors périodes de voyage',
        shortBio:
          'Isabelle voyage souvent seule et aide ceux qui hésitent à franchir la porte d’un groupe ou d’un départ.',
        retirementStory:
          'Elle a commencé par des séjours courts, puis des cercles culturels locaux entre deux voyages.',
        quote:
          'Partir seule m’a appris que je pouvais aussi entrer dans une salle pleine d’inconnus.',
      },
      en: {
        formerCareer: 'Language teacher',
        formerIndustry: 'Education',
        familySituationLabel: 'Children live far away',
        livingSituationLabel: 'Lives alone',
        interestLabels: ['Travel', 'Culture', 'Learning', 'Outdoors'],
        challengeLabels: ['Isolation', 'Joining activities alone'],
        helpTopicLabels: [
          'Travel',
          'Trying things alone',
          'Social life',
          'Learning',
        ],
        personalityTraitLabels: ['Adventurous', 'Independent', 'Open'],
        availability: 'Outside travel periods',
        shortBio:
          'Isabelle often travels alone and helps people who hesitate to walk into a group or leave on a trip.',
        retirementStory:
          'She started with short trips, then local cultural circles between journeys.',
        quote:
          'Traveling alone taught me I could also walk into a room full of strangers.',
      },
    },
  },
  {
    id: 'mentor-henri',
    firstName: 'Henri',
    age: 70,
    city: 'Lille',
    yearsRetired: 7,
    languages: ['fr'],
    careerFamily: 'management',
    livingSituation: 'with_partner',
    familySituation: 'children_nearby',
    socialStyle: 'balanced',
    adventureLevel: 'moderate',
    interests: ['business', 'learning', 'culture', 'craft'],
    challengesFaced: ['identity_shift', 'finding_purpose'],
    topicsTheyCanHelpWith: [
      'personal_project',
      'transmitting',
      'structure',
      'learning',
    ],
    personalityTraits: ['mentoring', 'measured', 'curious'],
    copy: {
      fr: {
        formerCareer: 'Dirigeant d’entreprise',
        formerIndustry: 'Industrie',
        familySituationLabel: 'Enfants à proximité',
        livingSituationLabel: 'Vit avec sa conjointe',
        interestLabels: ['Projets', 'Apprendre', 'Culture', 'Atelier'],
        challengeLabels: ['Changement d’identité', 'Sentiment d’utilité'],
        helpTopicLabels: [
          'Projet perso',
          'Petite activité',
          'Transmettre',
          'Structure',
        ],
        personalityTraitLabels: ['Mentor', 'Mesuré', 'Curieux'],
        availability: 'Un à deux échanges par semaine',
        shortBio:
          'Henri a créé une micro-activité artisanale après la retraite — assez pour rester engagé, pas assez pour s’épuiser.',
        retirementStory:
          'Il a d’abord cherché à « remplacer » son rôle. Puis il a accepté un projet plus petit, mais plus libre.',
        quote:
          'Le bon format, pour moi, c’était plus petit que mon ego le voulait.',
      },
      en: {
        formerCareer: 'Company executive',
        formerIndustry: 'Industry',
        familySituationLabel: 'Children nearby',
        livingSituationLabel: 'Lives with his partner',
        interestLabels: ['Projects', 'Learning', 'Culture', 'Workshop craft'],
        challengeLabels: ['Identity shift', 'Sense of purpose'],
        helpTopicLabels: [
          'Personal project',
          'Small business activity',
          'Passing on experience',
          'Structure',
        ],
        personalityTraitLabels: ['Mentoring', 'Measured', 'Curious'],
        availability: 'One or two conversations a week',
        shortBio:
          'Henri started a small craft activity after retiring — enough to stay engaged, not enough to burn out.',
        retirementStory:
          'At first he tried to “replace” his role. Then he accepted a smaller, freer project.',
        quote:
          'The right format for me was smaller than my ego wanted.',
      },
    },
  },
]

export function getMentorById(id: string): Mentor | undefined {
  return mentors.find((mentor) => mentor.id === id)
}

export function getAllMentors(): Mentor[] {
  return mentors
}
