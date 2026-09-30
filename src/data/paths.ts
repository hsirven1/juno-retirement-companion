import type { GuidedPath, GuidedStep, Theme } from '../types'

export const THEME_RYTHME = 'rythme'
export const THEME_ACTIF = 'actif'
export const THEME_TRANSMETTRE = 'transmettre'
export const THEME_SOCIAL = 'social'
export const THEME_ENVIES = 'envies'
export const THEME_FINANCES = 'finances'

export const PATH_RYTHME = 'path-rythme'
export const PATH_ACTIF = 'path-actif'
export const PATH_TRANSMETTRE = 'path-transmettre'
export const PATH_SOCIAL = 'path-social'
export const PATH_ENVIES = 'path-envies'
export const PATH_FINANCES = 'path-finances'

export const allThemes: Theme[] = [
  {
    id: THEME_RYTHME,
    title: 'Trouver mon nouveau rythme',
    shortReason: 'Trouver un équilibre entre liberté et structure.',
    personalizationReason:
      'Après une vie professionnelle bien remplie, vous cherchez un équilibre entre liberté et structure.',
    pathId: PATH_RYTHME,
  },
  {
    id: THEME_ACTIF,
    title: 'Rester actif',
    shortReason: 'Continuer à bouger régulièrement d’une façon qui vous plaît.',
    personalizationReason:
      'Vous aimez bouger et souhaitez garder une activité régulière.',
    pathId: PATH_ACTIF,
  },
  {
    id: THEME_TRANSMETTRE,
    title: 'Transmettre mon expérience',
    shortReason: 'Explorer de nouvelles façons de mettre votre expérience à profit.',
    personalizationReason:
      'Vous avez apprécié accompagner de jeunes collègues et souhaitez continuer à vous sentir utile.',
    pathId: PATH_TRANSMETTRE,
  },
  {
    id: THEME_SOCIAL,
    title: 'Ma vie sociale',
    shortReason:
      'Trouver la place que vous souhaitez donner aux rencontres, aux activités et aux personnes qui comptent pour vous.',
    personalizationReason:
      'Vous aimeriez choisir plus librement la place à donner aux autres dans votre nouvelle organisation.',
    pathId: PATH_SOCIAL,
  },
  {
    id: THEME_ENVIES,
    title: 'Cultiver mes envies',
    shortReason: 'Faire de la place à ce que vous avez envie de découvrir.',
    personalizationReason:
      'La retraite peut aussi être le moment d’essayer des choses mises de côté.',
    pathId: PATH_ENVIES,
  },
  {
    id: THEME_FINANCES,
    title: 'Aborder mes finances à la retraite',
    shortReason: 'Y voir plus clair sur ce qui change, sans pression.',
    personalizationReason:
      'Comprendre les grandes lignes peut aider à se sentir plus serein.',
    pathId: PATH_FINANCES,
  },
]

/** Themes for Harold — Ma vie sociale is the polished prototype theme */
export const haroldActiveThemeIds = [
  THEME_SOCIAL,
  THEME_RYTHME,
  THEME_ACTIF,
  THEME_TRANSMETTRE,
]

const rythmeSteps: GuidedStep[] = [
  {
    id: 'rythme-1',
    pathId: PATH_RYTHME,
    phase: 'understand',
    type: 'content',
    title: 'Ce qui change quand le travail s’arrête',
    content:
      'Le travail ne structurait pas seulement vos journées : il donnait aussi un rythme, des rendez-vous, et parfois une raison de sortir.\n\nQuand ce cadre disparaît, la liberté est réelle — et un peu déroutante. Ce n’est pas un problème à corriger. C’est simplement un nouveau terrain à explorer.',
    estimatedMinutes: 2,
    ctaLabel: 'Continuer',
  },
  {
    id: 'rythme-2',
    pathId: PATH_RYTHME,
    phase: 'understand',
    type: 'content',
    title: 'Liberté ne veut pas forcément dire absence de rythme',
    content:
      'Beaucoup de personnes découvrent qu’un peu de structure les aide à profiter davantage de leur liberté — pas moins.\n\nIl ne s’agit pas de remplir l’agenda. Il s’agit de choisir quelques repères qui vous font du bien.',
    estimatedMinutes: 2,
    ctaLabel: 'Continuer',
  },
  {
    id: 'rythme-3',
    pathId: PATH_RYTHME,
    phase: 'reflect',
    type: 'multiChoice',
    title: 'Ce que vous souhaitez garder dans vos semaines',
    content:
      'Qu’est-ce qui, dans le rythme du travail, vous manque un peu — ou vous ferait du bien de retrouver, autrement ?',
    estimatedMinutes: 3,
    options: [
      { id: 'sortie', label: 'Avoir une raison de sortir' },
      { id: 'monde', label: 'Voir du monde' },
      { id: 'horaires', label: 'Quelques horaires repères' },
      { id: 'utile', label: 'Me sentir utile' },
      { id: 'rien', label: 'Rien en particulier' },
    ],
    profileKeys: ['seeking'],
    ctaLabel: 'Continuer',
  },
  {
    id: 'rythme-4',
    pathId: PATH_RYTHME,
    phase: 'reflect',
    type: 'multiChoice',
    title: 'Ce que vous ne voulez plus',
    content:
      'La retraite est aussi l’occasion de laisser de côté ce qui vous pesait. Qu’est-ce qui ne devrait plus avoir de place dans vos semaines ?',
    estimatedMinutes: 2,
    options: [
      { id: 'agenda-plein', label: 'Un agenda trop rempli' },
      { id: 'grands-groupes', label: 'Les grands groupes organisés' },
      { id: 'pression', label: 'La pression de « produire »' },
      { id: 'matin-tot', label: 'Les matins trop chargés' },
      { id: 'autre', label: 'Autre chose' },
    ],
    profileKeys: ['preferences'],
    ctaLabel: 'Continuer',
  },
  {
    id: 'rythme-5',
    pathId: PATH_RYTHME,
    phase: 'reflect',
    type: 'singleChoice',
    title: 'Quel type de rythme pourrait vous convenir ?',
    content:
      'Sans vous engager pour toujours : quelle direction vous parle le plus, aujourd’hui ?',
    estimatedMinutes: 2,
    options: [
      { id: 'leger', label: 'Un ou deux rendez-vous réguliers, le reste libre' },
      { id: 'variable', label: 'Un rythme souple qui change selon les semaines' },
      { id: 'projet', label: 'Un projet qui structure une partie de mon temps' },
      { id: 'encore', label: 'Je ne sais pas encore — et c’est bien ainsi' },
    ],
    profileKeys: ['preferences'],
    ctaLabel: 'Continuer',
  },
  {
    id: 'rythme-6',
    pathId: PATH_RYTHME,
    phase: 'act',
    type: 'content',
    title: 'Votre première piste',
    content:
      'Vous semblez apprécier la liberté de votre nouvelle organisation, mais garder quelques rendez-vous réguliers pourrait vous convenir.\n\nLa prochaine étape : choisir une première chose simple à tester — une activité, une rencontre, un créneau — sans tout décider d’un coup.',
    estimatedMinutes: 2,
    ctaLabel: 'Voir la prochaine étape',
  },
  {
    id: 'rythme-7',
    pathId: PATH_RYTHME,
    phase: 'act',
    type: 'resourceDiscovery',
    title: 'Choisir une première chose à tester',
    content:
      'Voici des pistes près de chez vous, choisies en fonction de ce que vous aimez déjà — le vélo, les petits groupes, les activités en semaine.',
    estimatedMinutes: 4,
    resourceIds: ['lyon-cycling', 'lyon-walking', 'lyon-history'],
    discoverFilter: 'move',
    ctaLabel: 'Voir les idées',
  },
]

function placeholderSteps(
  pathId: string,
  titles: Array<{ phase: GuidedStep['phase']; title: string; type?: GuidedStep['type'] }>,
): GuidedStep[] {
  return titles.map((item, index) => ({
    id: `${pathId}-${index + 1}`,
    pathId,
    phase: item.phase,
    type: item.type ?? (item.phase === 'act' ? 'action' : 'content'),
    title: item.title,
    content:
      'Cette étape fait partie de votre parcours. Le contenu détaillé sera enrichi — pour l’instant, avancez à votre rythme.',
    estimatedMinutes: 2,
    ctaLabel: 'Continuer',
  }))
}

export const guidedPaths: GuidedPath[] = [
  {
    id: PATH_RYTHME,
    themeId: THEME_RYTHME,
    title: 'Trouver mon nouveau rythme',
    description:
      'Trouver un équilibre entre liberté et quelques repères qui vous font du bien.',
    estimatedTotalMinutes: 15,
    steps: rythmeSteps,
  },
  {
    id: PATH_ACTIF,
    themeId: THEME_ACTIF,
    title: 'Rester actif',
    description:
      'Trouver une façon de bouger régulièrement qui vous corresponde.',
    estimatedTotalMinutes: 10,
    steps: placeholderSteps(PATH_ACTIF, [
      { phase: 'understand', title: 'Pourquoi bouger compte encore' },
      { phase: 'understand', title: 'Régulier ne veut pas dire intensif' },
      { phase: 'reflect', title: 'Ce qui vous plaît déjà', type: 'multiChoice' },
      { phase: 'act', title: 'Découvrir une activité près de chez vous', type: 'resourceDiscovery' },
      { phase: 'act', title: 'Essayer une première fois', type: 'action' },
    ]).map((step, index) =>
      index === 2
        ? {
            ...step,
            content: 'Qu’est-ce qui vous attire le plus ?',
            options: [
              { id: 'velo', label: 'Vélo' },
              { id: 'marche', label: 'Marche' },
              { id: 'autre', label: 'Autre activité' },
            ],
            profileKeys: ['interests'] as const,
          }
        : index === 3
          ? {
              ...step,
              content:
                'Quelques idées autour de Lille, adaptées à vos goûts.',
              resourceIds: ['lyon-cycling', 'lyon-walking'],
              discoverFilter: 'move' as const,
              ctaLabel: 'Voir les idées',
            }
          : step,
    ),
  },
  {
    id: PATH_TRANSMETTRE,
    themeId: THEME_TRANSMETTRE,
    title: 'Transmettre mon expérience',
    description:
      'Explorer différentes façons de mettre votre expérience à profit.',
    estimatedTotalMinutes: 12,
    steps: [
      {
        id: 'transmettre-1',
        pathId: PATH_TRANSMETTRE,
        phase: 'understand',
        type: 'content',
        title: 'Les différentes façons de transmettre',
        content:
          'Mentorat, bénévolat, associations, accompagnement ponctuel… Il existe plusieurs façons de rester utile, sans reprendre un travail à temps plein.',
        estimatedMinutes: 3,
        ctaLabel: 'Continuer',
      },
      {
        id: 'transmettre-2',
        pathId: PATH_TRANSMETTRE,
        phase: 'understand',
        type: 'content',
        title: 'Bénévolat, mentorat, association',
        content:
          'Le mentorat convient souvent à ceux qui aiment accompagner de jeunes professionnels. Le bénévolat peut être plus large. L’essentiel : choisir un niveau d’engagement qui vous laisse libre.',
        estimatedMinutes: 3,
        ctaLabel: 'Continuer',
      },
      {
        id: 'transmettre-3',
        pathId: PATH_TRANSMETTRE,
        phase: 'reflect',
        type: 'singleChoice',
        title: 'À qui aimeriez-vous transmettre ?',
        content: 'Sans vous engager : quelle direction vous attire ?',
        estimatedMinutes: 2,
        options: [
          { id: 'jeunes-pro', label: 'De jeunes professionnels' },
          { id: 'entrepreneurs', label: 'De jeunes entrepreneurs' },
          { id: 'local', label: 'Des personnes près de chez moi' },
          { id: 'encore', label: 'Je ne sais pas encore' },
        ],
        profileKeys: ['interests'],
        ctaLabel: 'Continuer',
      },
      {
        id: 'transmettre-4',
        pathId: PATH_TRANSMETTRE,
        phase: 'reflect',
        type: 'singleChoice',
        title: 'Quel niveau d’engagement vous conviendrait ?',
        content: 'Choisissez ce qui vous semble réaliste pour commencer.',
        estimatedMinutes: 2,
        options: [
          { id: 'ponctuel', label: 'Quelques heures de temps en temps' },
          { id: 'mensuel', label: 'Un rendez-vous régulier chaque mois' },
          { id: 'explorer', label: 'D’abord explorer, sans m’engager' },
        ],
        profileKeys: ['preferences'],
        ctaLabel: 'Continuer',
      },
      {
        id: 'transmettre-5',
        pathId: PATH_TRANSMETTRE,
        phase: 'act',
        type: 'resourceDiscovery',
        title: 'Découvrir des possibilités près de chez vous',
        content:
          'Voici des pistes de mentorat et d’engagement sélectionnées pour vous à Lyon.',
        estimatedMinutes: 4,
        resourceIds: ['lyon-mentoring'],
        discoverFilter: 'engage',
        ctaLabel: 'Voir les ressources',
      },
      {
        id: 'transmettre-6',
        pathId: PATH_TRANSMETTRE,
        phase: 'act',
        type: 'action',
        title: 'Choisir une piste à explorer',
        content:
          'Retenez une organisation ou une forme de mentorat. Vous pourrez y revenir quand vous serez prêt.',
        estimatedMinutes: 2,
        ctaLabel: 'Terminer cette étape',
      },
    ],
  },
  {
    id: PATH_SOCIAL,
    themeId: THEME_SOCIAL,
    title: 'Ma vie sociale',
    description:
      'Construire une vie sociale qui vous ressemble.',
    estimatedTotalMinutes: 33,
    steps: [
      {
        id: 'social-step-1',
        pathId: PATH_SOCIAL,
        phase: 'understand',
        type: 'content',
        title: 'Ce que le travail apportait à votre vie sociale',
        content: '',
        estimatedMinutes: 7,
      },
      {
        id: 'social-step-2',
        pathId: PATH_SOCIAL,
        phase: 'understand',
        type: 'concepts',
        title: 'Une vie sociale peut prendre plusieurs formes',
        content: '',
        estimatedMinutes: 6,
      },
      {
        id: 'social-step-3',
        pathId: PATH_SOCIAL,
        phase: 'define',
        type: 'multiChoice',
        title: 'De quoi avez-vous envie aujourd’hui ?',
        content: '',
        estimatedMinutes: 6,
      },
      {
        id: 'social-step-4',
        pathId: PATH_SOCIAL,
        phase: 'define',
        type: 'preference',
        title: 'Quel type de rencontres vous ressemble ?',
        content: '',
        estimatedMinutes: 7,
      },
      {
        id: 'social-step-5',
        pathId: PATH_SOCIAL,
        phase: 'define',
        type: 'synthesis',
        title: 'Votre vie sociale idéale, simplement',
        content: '',
        estimatedMinutes: 6,
      },
      {
        id: 'social-step-6',
        pathId: PATH_SOCIAL,
        phase: 'act',
        type: 'recommendation',
        title: 'Trois pistes qui pourraient vous correspondre',
        content: '',
        estimatedMinutes: 6,
      },
      {
        id: 'social-step-7',
        pathId: PATH_SOCIAL,
        phase: 'act',
        type: 'resourceDiscovery',
        title: 'Explorer ce qui existe autour de vous',
        content: '',
        estimatedMinutes: 7,
      },
      {
        id: 'social-step-8',
        pathId: PATH_SOCIAL,
        phase: 'act',
        type: 'action',
        title: 'Choisir une première chose à essayer',
        content: '',
        estimatedMinutes: 5,
      },
    ],
  },
  {
    id: PATH_ENVIES,
    themeId: THEME_ENVIES,
    title: 'Cultiver mes envies',
    description: 'Faire de la place à ce que vous avez envie de découvrir.',
    estimatedTotalMinutes: 10,
    steps: placeholderSteps(PATH_ENVIES, [
      { phase: 'understand', title: 'Les envies mises de côté' },
      { phase: 'reflect', title: 'Qu’aimeriez-vous essayer ?', type: 'multiChoice' },
      { phase: 'act', title: 'Découvrir une première piste', type: 'resourceDiscovery' },
    ]),
  },
  {
    id: PATH_FINANCES,
    themeId: THEME_FINANCES,
    title: 'Aborder mes finances à la retraite',
    description:
      'Comprendre ce qui change et identifier les questions utiles — sans conseil personnalisé.',
    estimatedTotalMinutes: 12,
    steps: [
      {
        id: 'finances-1',
        pathId: PATH_FINANCES,
        phase: 'understand',
        type: 'content',
        title: 'Ce qui change quand les revenus évoluent',
        content:
          'La retraite modifie souvent la façon dont l’argent arrive et part. Comprendre les grandes catégories — revenus, dépenses, réserve — aide à y voir plus clair, sans tout décider d’un coup.',
        estimatedMinutes: 3,
        ctaLabel: 'Continuer',
      },
      {
        id: 'finances-2',
        pathId: PATH_FINANCES,
        phase: 'understand',
        type: 'content',
        title: 'Les sujets utiles à revoir',
        content:
          'Budget de vie, projets (voyage, aide familiale), et points de vigilance. De quoi structurer vos questions — sans remplacer un professionnel.',
        estimatedMinutes: 3,
        ctaLabel: 'Continuer',
      },
      {
        id: 'finances-3',
        pathId: PATH_FINANCES,
        phase: 'reflect',
        type: 'singleChoice',
        title: 'Sur quoi souhaitez-vous y voir plus clair ?',
        content: 'Choisissez ce qui vous serait le plus utile pour commencer.',
        estimatedMinutes: 2,
        options: [
          { id: 'budget', label: 'Mon budget de vie au quotidien' },
          { id: 'projets', label: 'Financer des projets qui me tiennent à cœur' },
          { id: 'documents', label: 'Savoir quels documents rassembler' },
          { id: 'pro', label: 'Savoir quand parler à un professionnel' },
        ],
        ctaLabel: 'Continuer',
      },
      {
        id: 'finances-4',
        pathId: PATH_FINANCES,
        phase: 'act',
        type: 'action',
        title: 'Identifier une première action utile',
        content:
          'Par exemple : lister vos questions, rassembler quelques documents, ou noter ce que vous souhaitez clarifier avec un conseiller. Aucun conseil financier personnalisé n’est fourni ici.',
        estimatedMinutes: 3,
        ctaLabel: 'Terminer cette étape',
      },
    ],
  },
]

export function getPathById(pathId: string): GuidedPath | undefined {
  return guidedPaths.find((path) => path.id === pathId)
}

export function getThemeById(themeId: string): Theme | undefined {
  return allThemes.find((theme) => theme.id === themeId)
}

export function getActiveThemes(themeIds: string[]): Theme[] {
  return themeIds
    .map((id) => getThemeById(id))
    .filter((theme): theme is Theme => Boolean(theme))
}

export const phaseLabels: Record<GuidedStep['phase'], string> = {
  understand: 'Comprendre',
  define: 'Définir',
  reflect: 'Réfléchir',
  act: 'Passer à l’action',
}
