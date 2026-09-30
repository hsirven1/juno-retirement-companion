export type Locale = "fr" | "en";

export type ThemeId =
  | "social"
  | "new_rhythm"
  | "active"
  | "contribute"
  | "learn"
  | "digital"
  | "travel"
  | "autonomy";

export type JourneyRole = "explore" | "act" | "support";

export type ResourceType =
  | "organization"
  | "place"
  | "program"
  | "activity"
  | "service"
  | "benefit"
  | "event";

export type LocalizedText = {
  fr: string;
  en: string;
};

export interface LilleResource {
  id: string;
  name: string;
  resourceType: ResourceType;
  themeIds: ThemeId[];
  journeyRoles: JourneyRole[];

  seniorSpecific: boolean;
  audience: string[];

  location: {
    city: string;
    neighborhood: string | null;
    address: string | null;
  };

  commitment: {
    level: string;
    cadence: string;
  };

  socialFormat: string[];
  interactionStyle: string[];
  environment: string[];

  cost: {
    type: string;
    label: LocalizedText;
  };

  eligibility: LocalizedText;
  description: LocalizedText;
  whyUseful: LocalizedText;

  tags: string[];

  source: {
    name: string;
    url: string;
    lastChecked: string;
  };

  timeSensitive: boolean;
}

export const lilleResources: LilleResource[] = [
  {
    "id": "lille-senior-spaces-network",
    "name": "Réseau des Espaces seniors de Lille",
    "resourceType": "program",
    "themeIds": ["social", "new_rhythm", "active", "learn"],
    "journeyRoles": ["explore", "act"],
    "seniorSpecific": true,
    "audience": ["seniors"],
    "location": {
      "city": "Lille",
      "neighborhood": null,
      "address": null
    },
    "commitment": {
      "level": "low",
      "cadence": "flexible"
    },
    "socialFormat": ["group", "drop_in"],
    "interactionStyle": ["activity_based", "conversation", "learning"],
    "environment": ["indoor", "mixed"],
    "cost": {
      "type": "varies",
      "label": {
        "fr": "Selon l’activité",
        "en": "Varies by activity"
      }
    },
    "eligibility": {
      "fr": "Destiné aux seniors ; certaines activités ou sorties ont leurs propres conditions.",
      "en": "Designed for seniors; some activities or outings have their own eligibility rules."
    },
    "description": {
      "fr": "Un réseau municipal de 10 espaces de quartier proposant des activités sportives, culturelles et créatives, ainsi que des lieux de rencontre.",
      "en": "A municipal network of 10 neighborhood senior spaces offering sports, cultural and creative activities, as well as places to meet others."
    },
    "whyUseful": {
      "fr": "Un bon point de départ si vous voulez plus de rythme, bouger ou voir du monde, sans avoir encore choisi d’activité précise.",
      "en": "A good starting point if you want more structure, activity or company but haven’t picked a specific activity yet."
    },
    "tags": ["municipal", "senior", "multi_activity", "social", "regular_activity"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Senior2/Avantages-et-loisirs/Les-espaces-seniors",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "espace-seniors-lille-centre",
    "name": "Espace seniors Lille-Centre",
    "resourceType": "place",
    "themeIds": ["social", "active", "learn", "new_rhythm"],
    "journeyRoles": ["act"],
    "seniorSpecific": true,
    "audience": ["seniors"],
    "location": {
      "city": "Lille",
      "neighborhood": "Lille-Centre",
      "address": "97 rue Saint-Sauveur, 59000 Lille"
    },
    "commitment": {
      "level": "low",
      "cadence": "weekly_or_flexible"
    },
    "socialFormat": ["group", "drop_in"],
    "interactionStyle": ["activity_based", "learning", "conversation"],
    "environment": ["indoor"],
    "cost": {
      "type": "varies",
      "label": {
        "fr": "Selon l’activité",
        "en": "Varies by activity"
      }
    },
    "eligibility": {
      "fr": "Espace municipal destiné aux seniors.",
      "en": "Municipal space designed for seniors."
    },
    "description": {
      "fr": "Propose notamment gym adaptée, Pilates, qi gong, salsa, bachata, yoga, peinture, poterie, chorale, couture et autres activités.",
      "en": "Offers activities including adapted exercise, Pilates, qi gong, salsa, bachata, yoga, painting, pottery, choir, sewing and more."
    },
    "whyUseful": {
      "fr": "Idéal pour essayer plusieurs activités de groupe avant de choisir celle qui vous plaît.",
      "en": "Ideal for trying several group activities before choosing the one you enjoy."
    },
    "tags": ["senior", "multi_activity", "small_group_possible", "creative", "fitness", "dance"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/lille-centre/Decouvrir-le-quartier/Senior-solidarite-et-sante/Espace-seniors-Centre",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "espace-seniors-vieux-lille",
    "name": "Espace seniors Vieux-Lille",
    "resourceType": "place",
    "themeIds": ["social", "active", "new_rhythm"],
    "journeyRoles": ["act"],
    "seniorSpecific": true,
    "audience": ["seniors"],
    "location": {
      "city": "Lille",
      "neighborhood": "Vieux-Lille",
      "address": "13 rue du Pont à Raisnes, 59000 Lille"
    },
    "commitment": {
      "level": "low",
      "cadence": "weekly_or_flexible"
    },
    "socialFormat": ["group", "drop_in"],
    "interactionStyle": ["activity_based", "conversation"],
    "environment": ["indoor", "outdoor"],
    "cost": {
      "type": "varies",
      "label": {
        "fr": "Selon l’activité",
        "en": "Varies by activity"
      }
    },
    "eligibility": {
      "fr": "Espace municipal destiné aux seniors.",
      "en": "Municipal space designed for seniors."
    },
    "description": {
      "fr": "Lieu de rencontre ouvert l’après-midi avec sophrologie, gymnastique douce, tai-chi, randonnée/course d’orientation et sports de pleine nature.",
      "en": "An afternoon social space offering sophrology, gentle exercise, tai chi, hiking/orienteering and outdoor activities."
    },
    "whyUseful": {
      "fr": "Pour rester actif tout en retrouvant régulièrement les mêmes visages.",
      "en": "Stay active while seeing familiar faces regularly."
    },
    "tags": ["senior", "outdoor", "gentle_activity", "hiking", "regular"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Nos-equipements/Espace-seniors-Vieux-Lille",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "espace-seniors-wazemmes",
    "name": "Espace seniors Wazemmes",
    "resourceType": "place",
    "themeIds": ["social", "active", "learn", "new_rhythm"],
    "journeyRoles": ["act"],
    "seniorSpecific": true,
    "audience": ["seniors"],
    "location": {
      "city": "Lille",
      "neighborhood": "Wazemmes",
      "address": "48 rue des Meuniers, 59000 Lille"
    },
    "commitment": {
      "level": "low",
      "cadence": "weekly_or_flexible"
    },
    "socialFormat": ["group", "drop_in"],
    "interactionStyle": ["activity_based", "learning", "conversation"],
    "environment": ["indoor"],
    "cost": {
      "type": "varies",
      "label": {
        "fr": "Selon l’activité",
        "en": "Varies by activity"
      }
    },
    "eligibility": {
      "fr": "Espace municipal destiné aux seniors.",
      "en": "Municipal space designed for seniors."
    },
    "description": {
      "fr": "Propose gymnastique douce, sophrologie, eutonie, espagnol et mini-conférences, dans un lieu de quartier ouvert en semaine.",
      "en": "Offers gentle exercise, sophrology, eutony, Spanish and mini-conferences in a neighborhood space open during the week."
    },
    "whyUseful": {
      "fr": "Une activité douce, un rendez-vous régulier et un cadre convivial, au même endroit.",
      "en": "Gentle activity, a regular slot and a friendly setting, all in one place."
    },
    "tags": ["senior", "gentle_activity", "language", "learning", "regular"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Wazemmes/Decouvrir-le-quartier/Senior-solidarite-et-sante/Espace-seniors-Wazemmes",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "espace-seniors-lille-sud",
    "name": "Espace seniors Lille-Sud",
    "resourceType": "place",
    "themeIds": ["social", "active", "learn", "digital", "new_rhythm"],
    "journeyRoles": ["act", "support"],
    "seniorSpecific": true,
    "audience": ["seniors"],
    "location": {
      "city": "Lille",
      "neighborhood": "Lille-Sud",
      "address": "250 rue Richard Wagner, 59000 Lille"
    },
    "commitment": {
      "level": "low",
      "cadence": "weekly_or_flexible"
    },
    "socialFormat": ["group", "drop_in"],
    "interactionStyle": ["activity_based", "learning", "conversation"],
    "environment": ["indoor", "mixed"],
    "cost": {
      "type": "varies",
      "label": {
        "fr": "Selon l’activité",
        "en": "Varies by activity"
      }
    },
    "eligibility": {
      "fr": "Espace municipal destiné aux seniors.",
      "en": "Municipal space designed for seniors."
    },
    "description": {
      "fr": "Propose gym douce, aquabike, activité physique adaptée, théâtre, couture, peinture, activités intergénérationnelles et permanence informatique.",
      "en": "Offers gentle exercise, aquabike, adapted physical activity, theatre, sewing, painting, intergenerational activities and digital support."
    },
    "whyUseful": {
      "fr": "Un lieu polyvalent : vous pouvez explorer plusieurs envies sans devoir choisir tout de suite.",
      "en": "A versatile place: explore several interests without having to choose right away."
    },
    "tags": ["senior", "fitness", "creative", "intergenerational", "digital_support"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/lille-sud/Decouvrir-le-quartier/Senior-solidarite-et-sante/Espace-seniors-Lille-Sud",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "espace-seniors-vauban",
    "name": "Espace seniors Vauban-Esquermes",
    "resourceType": "place",
    "themeIds": ["social", "active", "learn"],
    "journeyRoles": ["act"],
    "seniorSpecific": true,
    "audience": ["seniors"],
    "location": {
      "city": "Lille",
      "neighborhood": "Vauban-Esquermes",
      "address": "8 rue de Toul, 59000 Lille"
    },
    "commitment": {
      "level": "low",
      "cadence": "weekly_or_flexible"
    },
    "socialFormat": ["group", "drop_in"],
    "interactionStyle": ["activity_based", "learning"],
    "environment": ["indoor"],
    "cost": {
      "type": "varies",
      "label": {
        "fr": "Selon l’activité",
        "en": "Varies by activity"
      }
    },
    "eligibility": {
      "fr": "Espace municipal destiné aux seniors.",
      "en": "Municipal space designed for seniors."
    },
    "description": {
      "fr": "Propose gym douce, plusieurs niveaux de rock, peinture et Scrabble en duplicate.",
      "en": "Offers gentle exercise, several levels of rock dancing, painting and duplicate Scrabble."
    },
    "whyUseful": {
      "fr": "De la danse, des jeux ou de la création dans un cadre structuré et chaleureux.",
      "en": "Dance, games or creative activities in a structured, welcoming setting."
    },
    "tags": ["senior", "dance", "creative", "games", "regular"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Nos-equipements/Espace-seniors-Vauban-Esquermes",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "espace-seniors-faubourg-bethune",
    "name": "Espace seniors Faubourg de Béthune",
    "resourceType": "place",
    "themeIds": ["social", "active", "learn", "digital"],
    "journeyRoles": ["act", "support"],
    "seniorSpecific": true,
    "audience": ["seniors"],
    "location": {
      "city": "Lille",
      "neighborhood": "Faubourg de Béthune",
      "address": "Square Verhaeren, 59000 Lille"
    },
    "commitment": {
      "level": "low",
      "cadence": "weekly_or_flexible"
    },
    "socialFormat": ["group", "drop_in"],
    "interactionStyle": ["activity_based", "learning"],
    "environment": ["indoor"],
    "cost": {
      "type": "varies",
      "label": {
        "fr": "Selon l’activité",
        "en": "Varies by activity"
      }
    },
    "eligibility": {
      "fr": "Espace municipal destiné aux seniors.",
      "en": "Municipal space designed for seniors."
    },
    "description": {
      "fr": "Propose gym douce, tai-chi, mosaïque, atelier mémoire, découverte de l’e-sport et une permanence informatique gratuite.",
      "en": "Offers gentle exercise, tai chi, mosaics, a memory workshop, e-sports discovery and free digital support."
    },
    "whyUseful": {
      "fr": "Activités, découvertes et aide au numérique, près de chez vous.",
      "en": "Activities, discovery and digital help, close to home."
    },
    "tags": ["senior", "gentle_activity", "creative", "digital_support", "regular"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Nos-equipements/Espace-seniors-Faubourg-de-Bethune",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "sport-adultes-seniors-lille",
    "name": "Sport pour adultes et seniors - Ville de Lille",
    "resourceType": "program",
    "themeIds": ["active", "social", "new_rhythm"],
    "journeyRoles": ["explore", "act"],
    "seniorSpecific": false,
    "audience": ["adults", "seniors"],
    "location": {
      "city": "Lille",
      "neighborhood": null,
      "address": null
    },
    "commitment": {
      "level": "low",
      "cadence": "varies"
    },
    "socialFormat": ["group", "mixed"],
    "interactionStyle": ["activity_based"],
    "environment": ["indoor", "outdoor", "mixed"],
    "cost": {
      "type": "varies",
      "label": {
        "fr": "Selon l’activité",
        "en": "Varies by activity"
      }
    },
    "eligibility": {
      "fr": "Programme municipal pour adultes et seniors ; les modalités dépendent de l’activité.",
      "en": "Municipal program for adults and seniors; requirements vary by activity."
    },
    "description": {
      "fr": "Programme municipal regroupant notamment aquadouce, ateliers sportifs en espaces seniors et orientation vers les clubs lillois.",
      "en": "Municipal program including aquadouce, sports sessions in senior spaces and links to Lille sports clubs."
    },
    "whyUseful": {
      "fr": "Un large choix d’activités sportives encadrées, bien plus varié qu’une simple salle de sport.",
      "en": "A wide choice of supervised sports, far more varied than a regular gym."
    },
    "tags": ["municipal", "fitness", "sport", "group", "multi_activity"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Que-faire-a-Lille/Envie-de-sport/Actions-Sportives-Municipales/Le-Sport-pour-les-Adultes-et-les-Seniors",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": true
  },
  {
    "id": "digital-advisers-seniors",
    "name": "Conseillers numériques pour les seniors",
    "resourceType": "service",
    "themeIds": ["digital", "social", "autonomy"],
    "journeyRoles": ["support", "act"],
    "seniorSpecific": true,
    "audience": ["seniors"],
    "location": {
      "city": "Lille",
      "neighborhood": "Multiple neighborhoods",
      "address": null
    },
    "commitment": {
      "level": "very_low",
      "cadence": "appointment_or_drop_in"
    },
    "socialFormat": ["one_to_one", "small_group_possible"],
    "interactionStyle": ["learning", "support"],
    "environment": ["indoor"],
    "cost": {
      "type": "free",
      "label": {
        "fr": "Gratuit",
        "en": "Free"
      }
    },
    "eligibility": {
      "fr": "Disponible dans le réseau des Espaces seniors.",
      "en": "Available through Lille's senior-space network."
    },
    "description": {
      "fr": "Aide à l’utilisation du smartphone, de l’ordinateur, d’Internet, des applications, des achats en ligne et des outils de communication.",
      "en": "Help with smartphones, computers, the internet, apps, online purchases and communication tools."
    },
    "whyUseful": {
      "fr": "Une aide concrète pour être plus à l’aise avec vos démarches en ligne et garder le lien avec vos proches.",
      "en": "Practical help to feel more at ease with online paperwork and staying in touch with loved ones."
    },
    "tags": ["senior", "digital", "support", "free", "practical"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Senior2/Accompagnement-numerique-des-seniors",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "animages-sorties",
    "name": "Sorties seniors Anim'Âges",
    "resourceType": "program",
    "themeIds": ["social", "learn", "active", "travel"],
    "journeyRoles": ["explore", "act"],
    "seniorSpecific": true,
    "audience": ["seniors"],
    "location": {
      "city": "Lille",
      "neighborhood": null,
      "address": null
    },
    "commitment": {
      "level": "very_low",
      "cadence": "one_off"
    },
    "socialFormat": ["group"],
    "interactionStyle": ["activity_based", "conversation", "learning"],
    "environment": ["mixed"],
    "cost": {
      "type": "paid",
      "label": {
        "fr": "Tarifs selon la sortie + adhésion Anim'Âges",
        "en": "Price varies by outing + Anim'Âges membership"
      }
    },
    "eligibility": {
      "fr": "Conditions liées au Pass Lille & moi / Pass senior et à l’adhésion Anim'Âges.",
      "en": "Eligibility is linked to the Pass Lille & moi / senior pass and Anim'Âges membership."
    },
    "description": {
      "fr": "Programme trimestriel d’excursions, visites guidées, randonnées et fêtes, pensé aussi comme occasion de faire de nouvelles connaissances.",
      "en": "Quarterly program of excursions, guided visits, hikes and celebrations, also presented as a way to meet new people."
    },
    "whyUseful": {
      "fr": "Pour voir du monde et sortir, sans vous engager chaque semaine.",
      "en": "Get out and meet people without committing every week."
    },
    "tags": ["senior", "one_off", "outings", "social", "low_commitment"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Senior2/Avantages-et-loisirs/Les-sorties",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": true
  },
  {
    "id": "animages-sejours",
    "name": "Séjours Anim'Âges",
    "resourceType": "program",
    "themeIds": ["travel", "social"],
    "journeyRoles": ["explore", "act"],
    "seniorSpecific": true,
    "audience": ["seniors_60_plus"],
    "location": {
      "city": "Lille",
      "neighborhood": null,
      "address": "97 rue Saint-Sauveur, 59000 Lille"
    },
    "commitment": {
      "level": "medium",
      "cadence": "multi_day"
    },
    "socialFormat": ["group"],
    "interactionStyle": ["activity_based", "conversation"],
    "environment": ["mixed"],
    "cost": {
      "type": "paid",
      "label": {
        "fr": "Forfait selon séjour et situation",
        "en": "Package price varies by trip and circumstances"
      }
    },
    "eligibility": {
      "fr": "60 ans ou plus, Pass Lille & moi - Pass senior, résidence à Lille/Lomme/Hellemmes et adhésion Anim'Âges.",
      "en": "Age 60+, Pass Lille & moi senior pass, resident of Lille/Lomme/Hellemmes and Anim'Âges membership."
    },
    "description": {
      "fr": "Séjours de quelques jours à une semaine en France, en groupe et avec accompagnateur, transport, pension complète, animations et visites.",
      "en": "Group trips in France lasting a few days to one week, with a trip leader, transport, full board, activities and guided visits."
    },
    "whyUseful": {
      "fr": "Voyager en groupe sans avoir à tout organiser vous-même.",
      "en": "Travel with a group without organising everything yourself."
    },
    "tags": ["senior", "travel", "group_travel", "multi_day"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Senior2/Avantages-et-loisirs/Les-sejours",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": true
  },
  {
    "id": "pass-lille-moi-senior",
    "name": "Pass Lille & moi - avantages seniors",
    "resourceType": "benefit",
    "themeIds": ["active", "social", "learn", "travel", "autonomy"],
    "journeyRoles": ["support"],
    "seniorSpecific": true,
    "audience": ["seniors_60_plus"],
    "location": {
      "city": "Lille",
      "neighborhood": "Lille, Hellemmes, Lomme",
      "address": null
    },
    "commitment": {
      "level": "very_low",
      "cadence": "one_off_registration"
    },
    "socialFormat": ["not_applicable"],
    "interactionStyle": ["support"],
    "environment": ["not_applicable"],
    "cost": {
      "type": "free",
      "label": {
        "fr": "Carte gratuite",
        "en": "Free card"
      }
    },
    "eligibility": {
      "fr": "Réservé aux habitants de Lille, Hellemmes ou Lomme ; avantages seniors à partir de 60 ans.",
      "en": "For residents of Lille, Hellemmes or Lomme; senior benefits apply from age 60."
    },
    "description": {
      "fr": "Carte municipale donnant notamment accès à des avantages seniors, bibliothèques, musées le dimanche, zoo et tarifs réduits sur certains équipements.",
      "en": "Municipal card providing senior benefits plus access to libraries, Sunday museum entry, the zoo and reduced prices at selected facilities."
    },
    "whyUseful": {
      "fr": "Des réductions et un accès facilité à de nombreuses activités de la Ville.",
      "en": "Discounts and easier access to many city activities."
    },
    "tags": ["senior", "benefit", "municipal", "access", "discount"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Senior2/Avantages-et-loisirs/Le-Pass-Lille-moi",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "maison-lillages",
    "name": "Maison Lill'Âges",
    "resourceType": "service",
    "themeIds": ["autonomy", "new_rhythm"],
    "journeyRoles": ["support", "act"],
    "seniorSpecific": true,
    "audience": ["seniors", "people_with_disabilities", "caregivers"],
    "location": {
      "city": "Lille",
      "neighborhood": "Moulins",
      "address": "108 rue des Meuniers, 59000 Lille"
    },
    "commitment": {
      "level": "very_low",
      "cadence": "one_off_or_workshop"
    },
    "socialFormat": ["one_to_one", "group"],
    "interactionStyle": ["support", "learning"],
    "environment": ["indoor"],
    "cost": {
      "type": "free",
      "label": {
        "fr": "Gratuit sur réservation",
        "en": "Free with reservation"
      }
    },
    "eligibility": {
      "fr": "Ouvert aux seniors, personnes en situation de handicap, proches et professionnels.",
      "en": "Open to seniors, people with disabilities, relatives and professionals."
    },
    "description": {
      "fr": "Lieu de démonstration et de conseil sur l’aménagement du logement, les aides techniques et l’autonomie, avec visites et ateliers.",
      "en": "Demonstration and advice center focused on home adaptation, assistive solutions and autonomy, with visits and workshops."
    },
    "whyUseful": {
      "fr": "Des conseils concrets et gratuits pour adapter votre logement et préserver votre autonomie.",
      "en": "Free, practical advice to adapt your home and stay independent."
    },
    "tags": ["senior", "home", "autonomy", "free", "occupational_therapy"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Senior2/Maison-Lill-Ages",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "utl-lille",
    "name": "Université du Temps Libre de Lille",
    "resourceType": "organization",
    "themeIds": ["learn", "social", "new_rhythm"],
    "journeyRoles": ["explore", "act"],
    "seniorSpecific": false,
    "audience": ["adults", "retirees"],
    "location": {
      "city": "Lille",
      "neighborhood": "Centre",
      "address": "27 rue Jean Bart, 59000 Lille"
    },
    "commitment": {
      "level": "low",
      "cadence": "varies"
    },
    "socialFormat": ["group", "small_group"],
    "interactionStyle": ["learning", "activity_based", "conversation"],
    "environment": ["indoor", "mixed"],
    "cost": {
      "type": "paid_or_free",
      "label": {
        "fr": "Selon l’activité ; certaines conférences gratuites",
        "en": "Varies by activity; some conferences are free"
      }
    },
    "eligibility": {
      "fr": "Certaines activités sont réservées aux adhérents.",
      "en": "Some activities are reserved for members."
    },
    "description": {
      "fr": "Programme 2026-2027 de conférences, ateliers et sorties culturelles autour de la découverte, de la transmission des savoirs et des échanges.",
      "en": "2026-27 program of conferences, workshops and cultural outings focused on discovery, knowledge-sharing and interaction."
    },
    "whyUseful": {
      "fr": "Apprendre, rythmer votre semaine et rencontrer des personnes qui partagent vos centres d’intérêt.",
      "en": "Learn, add rhythm to your week and meet people who share your interests."
    },
    "tags": ["learning", "social", "workshops", "conferences", "culture"],
    "source": {
      "name": "UTL Lille",
      "url": "https://utllille.fr/activites",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": true
  },
  {
    "id": "utl-photography-2026",
    "name": "UTL Lille - Atelier Photographie 2026-2027",
    "resourceType": "activity",
    "themeIds": ["learn", "social"],
    "journeyRoles": ["act"],
    "seniorSpecific": false,
    "audience": ["utl_members"],
    "location": {
      "city": "Lille",
      "neighborhood": "Centre",
      "address": "Maison des associations, 27 rue Jean Bart, Lille"
    },
    "commitment": {
      "level": "medium",
      "cadence": "multi_session"
    },
    "socialFormat": ["small_group"],
    "interactionStyle": ["learning", "activity_based"],
    "environment": ["indoor", "mixed"],
    "cost": {
      "type": "paid",
      "label": {
        "fr": "100 € (tarif affiché au 2 septembre 2026)",
        "en": "€100 (listed price on Sep 2, 2026)"
      }
    },
    "eligibility": {
      "fr": "Activité réservée aux adhérents UTL.",
      "en": "Reserved for UTL members."
    },
    "description": {
      "fr": "Atelier photographie programmé d’octobre 2026 à janvier 2027, en petit groupe.",
      "en": "Photography workshop scheduled from October 2026 to January 2027 in a small group."
    },
    "whyUseful": {
      "fr": "Un rendez-vous régulier et convivial autour de la photographie.",
      "en": "A regular, friendly group built around photography."
    },
    "tags": ["photography", "creative", "small_group", "regular"],
    "source": {
      "name": "UTL Lille",
      "url": "https://utllille.fr/activites?type=atelier",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": true
  },
  {
    "id": "utl-choir-2026",
    "name": "UTL Lille - Chant choral Session 1",
    "resourceType": "activity",
    "themeIds": ["social", "learn"],
    "journeyRoles": ["act"],
    "seniorSpecific": false,
    "audience": ["utl_members"],
    "location": {
      "city": "Lille",
      "neighborhood": "Centre",
      "address": "École de musique Lille Centre"
    },
    "commitment": {
      "level": "medium",
      "cadence": "multi_session"
    },
    "socialFormat": ["group"],
    "interactionStyle": ["activity_based", "learning"],
    "environment": ["indoor"],
    "cost": {
      "type": "paid",
      "label": {
        "fr": "96 € (tarif affiché au 2 septembre 2026)",
        "en": "€96 (listed price on Sep 2, 2026)"
      }
    },
    "eligibility": {
      "fr": "Activité réservée aux adhérents UTL.",
      "en": "Reserved for UTL members."
    },
    "description": {
      "fr": "Session de chant choral d’octobre 2026 à janvier 2027.",
      "en": "Choir session running from October 2026 to January 2027."
    },
    "whyUseful": {
      "fr": "Chanter en groupe régulièrement, sans pression de faire la conversation.",
      "en": "Sing with a group regularly, with no pressure to make small talk."
    },
    "tags": ["choir", "music", "group", "regular"],
    "source": {
      "name": "UTL Lille",
      "url": "https://utllille.fr/activites?type=atelier",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": true
  },
  {
    "id": "utl-spanish-beginner-2026",
    "name": "UTL Lille - Espagnol Débutants Session 1",
    "resourceType": "activity",
    "themeIds": ["learn", "social"],
    "journeyRoles": ["act"],
    "seniorSpecific": false,
    "audience": ["utl_members"],
    "location": {
      "city": "Lille",
      "neighborhood": "Centre",
      "address": "Centre social La Busette, Lille"
    },
    "commitment": {
      "level": "medium",
      "cadence": "multi_session"
    },
    "socialFormat": ["small_group"],
    "interactionStyle": ["learning", "conversation"],
    "environment": ["indoor"],
    "cost": {
      "type": "paid",
      "label": {
        "fr": "96 € (tarif affiché au 2 septembre 2026)",
        "en": "€96 (listed price on Sep 2, 2026)"
      }
    },
    "eligibility": {
      "fr": "Activité réservée aux adhérents UTL.",
      "en": "Reserved for UTL members."
    },
    "description": {
      "fr": "Cours d’espagnol débutant en petit groupe, prévu d’octobre 2026 à janvier 2027.",
      "en": "Beginner Spanish course in a small group, scheduled from October 2026 to January 2027."
    },
    "whyUseful": {
      "fr": "Apprendre l’espagnol en petit groupe, à un rythme régulier.",
      "en": "Learn Spanish in a small group, at a regular pace."
    },
    "tags": ["language", "spanish", "small_group", "regular"],
    "source": {
      "name": "UTL Lille",
      "url": "https://utllille.fr/activites?type=atelier",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": true
  },
  {
    "id": "utl-social-sciences-2026",
    "name": "UTL Lille - Atelier Sciences sociales",
    "resourceType": "activity",
    "themeIds": ["learn", "social"],
    "journeyRoles": ["act"],
    "seniorSpecific": false,
    "audience": ["utl_members"],
    "location": {
      "city": "Lille",
      "neighborhood": "Centre",
      "address": "Maison des associations, 27 rue Jean Bart, Lille"
    },
    "commitment": {
      "level": "medium",
      "cadence": "multi_session"
    },
    "socialFormat": ["group"],
    "interactionStyle": ["learning", "conversation"],
    "environment": ["indoor"],
    "cost": {
      "type": "paid",
      "label": {
        "fr": "80 € (tarif affiché au 2 septembre 2026)",
        "en": "€80 (listed price on Sep 2, 2026)"
      }
    },
    "eligibility": {
      "fr": "Activité réservée aux adhérents UTL.",
      "en": "Reserved for UTL members."
    },
    "description": {
      "fr": "Atelier de sciences sociales prévu d’octobre 2026 à avril 2027.",
      "en": "Social sciences workshop scheduled from October 2026 to April 2027."
    },
    "whyUseful": {
      "fr": "Pour retrouver de la stimulation intellectuelle en groupe.",
      "en": "For intellectual stimulation in a group setting."
    },
    "tags": ["social_sciences", "learning", "group", "long_term"],
    "source": {
      "name": "UTL Lille",
      "url": "https://utllille.fr/activites?page=2",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": true
  },
  {
    "id": "utl-conferences-2026",
    "name": "Conférences UTL Lille 2026-2027",
    "resourceType": "program",
    "themeIds": ["learn", "social"],
    "journeyRoles": ["explore", "act"],
    "seniorSpecific": false,
    "audience": ["adults", "retirees"],
    "location": {
      "city": "Lille",
      "neighborhood": "Multiple venues",
      "address": null
    },
    "commitment": {
      "level": "very_low",
      "cadence": "one_off_or_series"
    },
    "socialFormat": ["group"],
    "interactionStyle": ["learning"],
    "environment": ["indoor"],
    "cost": {
      "type": "paid_or_free",
      "label": {
        "fr": "Selon la conférence ; certaines sont gratuites",
        "en": "Varies by conference; some are free"
      }
    },
    "eligibility": {
      "fr": "Certaines conférences sont ouvertes aux non-adhérents.",
      "en": "Some conferences are open to non-members."
    },
    "description": {
      "fr": "Programme annuel de conférences sur l’histoire, la société, la littérature et de nombreux autres sujets.",
      "en": "Annual conference program covering history, society, literature and many other topics."
    },
    "whyUseful": {
      "fr": "Une façon simple de sortir, apprendre et découvrir l’UTL avant de vous inscrire à un atelier.",
      "en": "An easy way to get out, learn and try the UTL before signing up for a workshop."
    },
    "tags": ["conference", "learning", "one_off", "low_commitment"],
    "source": {
      "name": "UTL Lille",
      "url": "https://utllille.fr/activites?type=conference",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": true
  },
  {
    "id": "fabrique-du-sud",
    "name": "La Fabrique du Sud",
    "resourceType": "place",
    "themeIds": ["social", "learn", "active", "contribute"],
    "journeyRoles": ["explore", "act"],
    "seniorSpecific": false,
    "audience": ["all_ages"],
    "location": {
      "city": "Lille",
      "neighborhood": "Lille-Sud",
      "address": "7 bis rue de l'Asie, Lille"
    },
    "commitment": {
      "level": "very_low",
      "cadence": "flexible"
    },
    "socialFormat": ["group", "drop_in"],
    "interactionStyle": ["activity_based", "learning", "conversation", "volunteering"],
    "environment": ["indoor", "mixed"],
    "cost": {
      "type": "varies",
      "label": {
        "fr": "Nombreuses activités ouvertes à tous ; vérifier le programme",
        "en": "Many activities are open to all; check the current program"
      }
    },
    "eligibility": {
      "fr": "De nombreuses activités sont ouvertes à tous.",
      "en": "Many activities are open to everyone."
    },
    "description": {
      "fr": "Lieu de quartier proposant chaque semaine Repair Café, couture, ameublement, anglais, vélo, Pilates, Zumba, solidarité et autres ateliers.",
      "en": "Neighborhood hub offering weekly Repair Café, sewing, furniture workshops, English, cycling, Pilates, Zumba, solidarity activities and more."
    },
    "whyUseful": {
      "fr": "Un lieu ouvert à tous les âges pour bouger, apprendre et rencontrer du monde naturellement.",
      "en": "A place open to all ages to stay active, learn and meet people naturally."
    },
    "tags": ["all_ages", "community", "multi_activity", "low_barrier"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Lille-Sud/La-Fabrique-du-Sud",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": true
  },
  {
    "id": "repair-cafes-lille-network",
    "name": "Réseau des Repair Cafés de Lille",
    "resourceType": "program",
    "themeIds": ["social", "contribute", "learn"],
    "journeyRoles": ["explore", "act"],
    "seniorSpecific": false,
    "audience": ["all_ages"],
    "location": {
      "city": "Lille",
      "neighborhood": "Multiple neighborhoods",
      "address": null
    },
    "commitment": {
      "level": "very_low",
      "cadence": "mostly_monthly"
    },
    "socialFormat": ["small_group", "group", "drop_in"],
    "interactionStyle": ["activity_based", "learning", "volunteering"],
    "environment": ["indoor"],
    "cost": {
      "type": "free",
      "label": {
        "fr": "Gratuit",
        "en": "Free"
      }
    },
    "eligibility": {
      "fr": "Ouvert aux habitants quel que soit l’âge ou le niveau de compétence ; certains lieux demandent une inscription.",
      "en": "Open regardless of age or skill level; some locations require registration."
    },
    "description": {
      "fr": "Ateliers de quartier où habitants et bénévoles réparent ensemble des objets, apprennent et échangent.",
      "en": "Neighborhood workshops where residents and volunteers repair objects together, learn and socialize."
    },
    "whyUseful": {
      "fr": "Rencontrer du monde autour d’une activité concrète, apprendre ou rendre service, sans gros engagement.",
      "en": "Meet people through a hands-on activity, learn or help out, with no big commitment."
    },
    "tags": ["repair", "volunteering", "learning", "monthly", "low_commitment"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Vivre-a-Lille/Lille-Durable/Les-solutions-lilloises/Dechets-et-consommation-responsable",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "repair-cafe-fives-tipimi",
    "name": "Repair Café Lille-Fives - Tipimi",
    "resourceType": "activity",
    "themeIds": ["social", "contribute", "learn"],
    "journeyRoles": ["act"],
    "seniorSpecific": false,
    "audience": ["all_ages"],
    "location": {
      "city": "Lille",
      "neighborhood": "Fives",
      "address": "43 rue Pierre Legrand, Lille"
    },
    "commitment": {
      "level": "very_low",
      "cadence": "monthly"
    },
    "socialFormat": ["small_group", "drop_in"],
    "interactionStyle": ["activity_based", "learning", "volunteering"],
    "environment": ["indoor"],
    "cost": {
      "type": "free",
      "label": {
        "fr": "Gratuit",
        "en": "Free"
      }
    },
    "eligibility": {
      "fr": "Ouvert à tous ; vérifier le calendrier avant de venir.",
      "en": "Open to everyone; check the schedule before attending."
    },
    "description": {
      "fr": "Repair Café accueilli chez Tipimi, généralement le dernier samedi du mois, avec une équipe de bénévoles.",
      "en": "Repair Café hosted at Tipimi, generally on the last Saturday of the month, with a volunteer team."
    },
    "whyUseful": {
      "fr": "Peu d’engagement, des échanges naturels autour d’un objet à réparer : idéal pour une première fois.",
      "en": "Low commitment and easy conversation around something to fix — ideal for a first try."
    },
    "tags": ["repair", "fives", "monthly", "free", "low_commitment"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Actualites/Des-cafes-pour-reparer",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "repair-cafe-lille-centre",
    "name": "Repair Café Lille-Centre - Centre social La Busette",
    "resourceType": "activity",
    "themeIds": ["social", "contribute", "learn"],
    "journeyRoles": ["act"],
    "seniorSpecific": false,
    "audience": ["all_ages"],
    "location": {
      "city": "Lille",
      "neighborhood": "Lille-Centre",
      "address": "1 rue Lefebvre, Lille"
    },
    "commitment": {
      "level": "very_low",
      "cadence": "monthly"
    },
    "socialFormat": ["small_group", "group"],
    "interactionStyle": ["activity_based", "learning", "volunteering"],
    "environment": ["indoor"],
    "cost": {
      "type": "free",
      "label": {
        "fr": "Gratuit, sur inscription",
        "en": "Free, registration required"
      }
    },
    "eligibility": {
      "fr": "Inscription demandée ; vérifier le calendrier.",
      "en": "Registration required; check the schedule."
    },
    "description": {
      "fr": "Atelier de réparation du Centre social La Busette, organisé régulièrement en soirée.",
      "en": "Repair workshop at Centre social La Busette, held regularly in the evening."
    },
    "whyUseful": {
      "fr": "Une façon ponctuelle et concrète de rencontrer des gens du quartier tout en apprenant.",
      "en": "An occasional, hands-on way to meet neighbours while learning."
    },
    "tags": ["repair", "centre", "monthly", "free", "registration"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Vivre-a-Lille/Lille-Durable/Les-solutions-lilloises/Dechets-et-consommation-responsable",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "repair-cafe-lille-sud",
    "name": "Repair Café Lille-Sud - Fabrique du Sud",
    "resourceType": "activity",
    "themeIds": ["social", "contribute", "learn"],
    "journeyRoles": ["act"],
    "seniorSpecific": false,
    "audience": ["all_ages"],
    "location": {
      "city": "Lille",
      "neighborhood": "Lille-Sud",
      "address": "7 bis rue de l'Asie, Lille"
    },
    "commitment": {
      "level": "very_low",
      "cadence": "monthly"
    },
    "socialFormat": ["small_group", "group"],
    "interactionStyle": ["activity_based", "learning", "volunteering"],
    "environment": ["indoor"],
    "cost": {
      "type": "free",
      "label": {
        "fr": "Gratuit",
        "en": "Free"
      }
    },
    "eligibility": {
      "fr": "Vérifier le calendrier avant de venir.",
      "en": "Check the schedule before attending."
    },
    "description": {
      "fr": "Repair Café organisé à la Fabrique du Sud, généralement le deuxième jeudi du mois.",
      "en": "Repair Café at La Fabrique du Sud, generally on the second Thursday of the month."
    },
    "whyUseful": {
      "fr": "Une première expérience associative, simple et sans engagement.",
      "en": "A simple, no-commitment first taste of community volunteering."
    },
    "tags": ["repair", "lille_sud", "monthly", "free"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Vivre-a-Lille/Lille-Durable/Les-solutions-lilloises/Dechets-et-consommation-responsable",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "shared-gardens-lille-network",
    "name": "Jardins partagés de Lille",
    "resourceType": "program",
    "themeIds": ["social", "active", "learn", "contribute"],
    "journeyRoles": ["explore", "act"],
    "seniorSpecific": false,
    "audience": ["all_ages"],
    "location": {
      "city": "Lille",
      "neighborhood": "Multiple neighborhoods",
      "address": null
    },
    "commitment": {
      "level": "low",
      "cadence": "flexible_or_regular"
    },
    "socialFormat": ["small_group", "group"],
    "interactionStyle": ["activity_based", "learning", "project_based"],
    "environment": ["outdoor"],
    "cost": {
      "type": "mostly_free_or_unknown",
      "label": {
        "fr": "Selon le jardin ; souvent associatif ou participatif",
        "en": "Varies by garden; often community-based"
      }
    },
    "eligibility": {
      "fr": "Modalités variables selon le jardin ; participation ponctuelle ou régulière possible selon les lieux.",
      "en": "Rules vary by garden; some allow occasional or regular participation."
    },
    "description": {
      "fr": "Réseau de jardins collectifs de quartier mêlant jardinage, biodiversité, compost, ateliers et moments conviviaux.",
      "en": "Network of neighborhood community gardens combining gardening, biodiversity, composting, workshops and social activities."
    },
    "whyUseful": {
      "fr": "Être dehors, faire quelque chose de concret et rencontrer des gens, sans cadre formel.",
      "en": "Be outdoors, do something practical and meet people, without formality."
    },
    "tags": ["outdoor", "gardening", "community", "flexible", "social"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Nature-a-Lille/Faites-de-Lille-votre-jardin/Les-jardins-partages-et-en-bacs",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "jardin-des-maguettes",
    "name": "Jardin des Maguettes",
    "resourceType": "place",
    "themeIds": ["social", "active", "learn", "contribute"],
    "journeyRoles": ["act"],
    "seniorSpecific": false,
    "audience": ["all_ages"],
    "location": {
      "city": "Lille",
      "neighborhood": "Fives",
      "address": "Rue Dondaines / Becquerel, Lille"
    },
    "commitment": {
      "level": "low",
      "cadence": "flexible_or_regular"
    },
    "socialFormat": ["small_group", "group"],
    "interactionStyle": ["activity_based", "project_based", "learning"],
    "environment": ["outdoor"],
    "cost": {
      "type": "unknown",
      "label": {
        "fr": "Se renseigner auprès de l’association",
        "en": "Contact the association for details"
      }
    },
    "eligibility": {
      "fr": "Contacter les AJONC pour les modalités de participation.",
      "en": "Contact AJONC for participation details."
    },
    "description": {
      "fr": "Jardin partagé de Fives autour du potager, du compostage et de la biodiversité.",
      "en": "Community garden in Fives focused on vegetable gardening, composting and biodiversity."
    },
    "whyUseful": {
      "fr": "Une alternative aux clubs classiques : on se rencontre en jardinant.",
      "en": "An alternative to traditional clubs: you meet people while gardening."
    },
    "tags": ["garden", "fives", "outdoor", "community"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Nature-a-Lille/Faites-de-Lille-votre-jardin/Les-jardins-partages-et-en-bacs",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "jardin-retrouvailles",
    "name": "Jardin des (re)trouvailles",
    "resourceType": "place",
    "themeIds": ["social", "active", "learn", "contribute"],
    "journeyRoles": ["act"],
    "seniorSpecific": false,
    "audience": ["all_ages"],
    "location": {
      "city": "Lille",
      "neighborhood": "Moulins",
      "address": "Face au 11 rue Montesquieu, Lille"
    },
    "commitment": {
      "level": "low",
      "cadence": "flexible_or_regular"
    },
    "socialFormat": ["small_group", "group"],
    "interactionStyle": ["activity_based", "project_based", "learning"],
    "environment": ["outdoor"],
    "cost": {
      "type": "unknown",
      "label": {
        "fr": "Se renseigner auprès de l’association",
        "en": "Contact the association for details"
      }
    },
    "eligibility": {
      "fr": "Contacter les AJONC pour les modalités.",
      "en": "Contact AJONC for participation details."
    },
    "description": {
      "fr": "Jardin naturel à Moulins proposant compost, ateliers et animations.",
      "en": "Natural community garden in Moulins with composting, workshops and activities."
    },
    "whyUseful": {
      "fr": "Du lien informel, du plein air et une vraie participation à la vie du quartier.",
      "en": "Informal connection, fresh air and real involvement in local life."
    },
    "tags": ["garden", "moulins", "outdoor", "workshops"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Nature-a-Lille/Faites-de-Lille-votre-jardin/Les-jardins-partages-et-en-bacs",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "jardin-pre-muche",
    "name": "Jardin du Pré Muché",
    "resourceType": "place",
    "themeIds": ["social", "active", "learn", "contribute"],
    "journeyRoles": ["act"],
    "seniorSpecific": false,
    "audience": ["all_ages"],
    "location": {
      "city": "Lille",
      "neighborhood": "Saint-Maurice Pellevoisin",
      "address": "117 rue Saint-Gabriel, Lille"
    },
    "commitment": {
      "level": "low",
      "cadence": "flexible_or_regular"
    },
    "socialFormat": ["small_group", "group"],
    "interactionStyle": ["activity_based", "project_based", "learning"],
    "environment": ["outdoor"],
    "cost": {
      "type": "unknown",
      "label": {
        "fr": "Se renseigner auprès de l’association",
        "en": "Contact the association for details"
      }
    },
    "eligibility": {
      "fr": "Contacter les AJONC pour les modalités.",
      "en": "Contact AJONC for participation details."
    },
    "description": {
      "fr": "Jardin de quartier avec potager, compost, ateliers et animations.",
      "en": "Neighborhood garden with vegetable plots, composting, workshops and activities."
    },
    "whyUseful": {
      "fr": "Jardiner dehors et rencontrer des habitants autour d’un projet partagé.",
      "en": "Garden outdoors and meet neighbours around a shared project."
    },
    "tags": ["garden", "saint_maurice", "outdoor", "community"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Nature-a-Lille/Faites-de-Lille-votre-jardin/Les-jardins-partages-et-en-bacs",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "place-des-assos-lille",
    "name": "Place des Assos Lille",
    "resourceType": "service",
    "themeIds": ["contribute", "social"],
    "journeyRoles": ["explore", "act"],
    "seniorSpecific": false,
    "audience": ["all_ages"],
    "location": {
      "city": "Lille",
      "neighborhood": null,
      "address": null
    },
    "commitment": {
      "level": "very_low",
      "cadence": "flexible"
    },
    "socialFormat": ["not_applicable"],
    "interactionStyle": ["volunteering", "project_based"],
    "environment": ["online", "mixed"],
    "cost": {
      "type": "free",
      "label": {
        "fr": "Gratuit",
        "en": "Free"
      }
    },
    "eligibility": {
      "fr": "Plateforme ouverte aux citoyens et associations.",
      "en": "Platform open to residents and associations."
    },
    "description": {
      "fr": "Plateforme municipale qui met en relation citoyens et associations pour bénévolat, partage de compétences, matériel et annuaire associatif.",
      "en": "Municipal platform connecting residents and associations for volunteering, skill-sharing, equipment sharing and association discovery."
    },
    "whyUseful": {
      "fr": "Utile si vous avez envie de vous engager sans savoir encore pour quelle cause ou quelle mission.",
      "en": "Useful if you’d like to volunteer but aren’t yet sure which cause or role."
    },
    "tags": ["volunteering", "associations", "marketplace", "skills"],
    "source": {
      "name": "Ville de Lille / Place des Assos",
      "url": "https://www.lille.fr/Participer/S-engager-dans-la-vie-associative/Place-des-Assos-LA-plateforme-de-l-engagement-associatif",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "forum-associations-lille-2026",
    "name": "Forum des Associations et du Bénévolat 2026",
    "resourceType": "event",
    "themeIds": ["social", "contribute", "active", "learn"],
    "journeyRoles": ["explore"],
    "seniorSpecific": false,
    "audience": ["all_ages"],
    "location": {
      "city": "Lille",
      "neighborhood": "Lille-Sud",
      "address": "Le Grand Sud, Lille"
    },
    "commitment": {
      "level": "very_low",
      "cadence": "one_off"
    },
    "socialFormat": ["large_group"],
    "interactionStyle": ["conversation", "exploration"],
    "environment": ["indoor"],
    "cost": {
      "type": "free",
      "label": {
        "fr": "Gratuit",
        "en": "Free"
      }
    },
    "eligibility": {
      "fr": "Ouvert à tous.",
      "en": "Open to everyone."
    },
    "description": {
      "fr": "Événement gratuit le 26 septembre 2026 réunissant plus de 200 associations autour du sport, de la culture, de la solidarité, de l’environnement et d’autres thèmes.",
      "en": "Free event on Sep 26, 2026 bringing together more than 200 associations across sports, culture, solidarity, environment and other areas."
    },
    "whyUseful": {
      "fr": "Idéal si vous ne savez pas encore ce qui vous attire : beaucoup de possibilités à découvrir en une seule journée.",
      "en": "Ideal if you’re not sure yet what appeals to you: lots of options to discover in a single day."
    },
    "tags": ["event", "associations", "one_off", "exploration", "free"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Participer/S-engager-dans-la-vie-associative/Le-Forum-des-Associations-et-du-Benevolat-2026",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": true
  },
  {
    "id": "france-benevolat-nord-lille",
    "name": "France Bénévolat Nord - Centre de Lille",
    "resourceType": "service",
    "themeIds": ["contribute", "social"],
    "journeyRoles": ["explore", "support", "act"],
    "seniorSpecific": false,
    "audience": ["all_ages", "retirees"],
    "location": {
      "city": "Lille",
      "neighborhood": "Centre",
      "address": "Maison des Associations, 27 rue Jean Bart, 59000 Lille"
    },
    "commitment": {
      "level": "very_low",
      "cadence": "appointment_or_drop_in"
    },
    "socialFormat": ["one_to_one"],
    "interactionStyle": ["support", "volunteering"],
    "environment": ["indoor", "online"],
    "cost": {
      "type": "free",
      "label": {
        "fr": "Gratuit",
        "en": "Free"
      }
    },
    "eligibility": {
      "fr": "Le bénévolat est ouvert à tous, y compris aux retraités.",
      "en": "Volunteering is open to everyone, including retirees."
    },
    "description": {
      "fr": "Point d’accueil local pour trouver une mission de bénévolat correspondant à ses disponibilités, centres d’intérêt et compétences.",
      "en": "Local support point for finding volunteering opportunities that match availability, interests and skills."
    },
    "whyUseful": {
      "fr": "Pour échanger avec quelqu’un avant de choisir une association où vous rendre utile.",
      "en": "Talk things through with someone before choosing where to volunteer."
    },
    "tags": ["volunteering", "matching", "human_support", "retirees"],
    "source": {
      "name": "France Bénévolat Nord",
      "url": "https://nord.francebenevolat.org/missions/",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "jeveuxaider-lille",
    "name": "JeVeuxAider.gouv.fr - Lille",
    "resourceType": "service",
    "themeIds": ["contribute", "social", "learn"],
    "journeyRoles": ["explore", "act"],
    "seniorSpecific": false,
    "audience": ["all_ages"],
    "location": {
      "city": "Lille",
      "neighborhood": "Lille and surroundings",
      "address": null
    },
    "commitment": {
      "level": "varies",
      "cadence": "one_off_to_regular"
    },
    "socialFormat": ["varies"],
    "interactionStyle": ["volunteering", "mentoring", "activity_based"],
    "environment": ["mixed"],
    "cost": {
      "type": "free",
      "label": {
        "fr": "Gratuit",
        "en": "Free"
      }
    },
    "eligibility": {
      "fr": "Les conditions varient selon chaque mission.",
      "en": "Requirements vary by mission."
    },
    "description": {
      "fr": "Plateforme publique listant actuellement des centaines de missions autour de Lille, notamment mentorat, lutte contre l’isolement, loisirs, sport et médiation culturelle.",
      "en": "Public platform currently listing hundreds of opportunities around Lille, including mentoring, social connection, leisure, sports and cultural mediation."
    },
    "whyUseful": {
      "fr": "Des missions de bénévolat concrètes près de chez vous, à choisir selon vos envies et votre temps.",
      "en": "Concrete volunteering missions near you, chosen to fit your interests and time."
    },
    "tags": ["volunteering", "mentoring", "public_platform", "many_opportunities"],
    "source": {
      "name": "JeVeuxAider.gouv.fr",
      "url": "https://www.jeveuxaider.gouv.fr/villes/lille",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": true
  },
  {
    "id": "maison-associations-lille",
    "name": "Maison des Associations de Lille",
    "resourceType": "place",
    "themeIds": ["contribute", "social", "learn"],
    "journeyRoles": ["explore", "support"],
    "seniorSpecific": false,
    "audience": ["all_ages", "association_members"],
    "location": {
      "city": "Lille",
      "neighborhood": "Centre",
      "address": "27 rue Jean Bart, 59000 Lille"
    },
    "commitment": {
      "level": "very_low",
      "cadence": "drop_in_or_training"
    },
    "socialFormat": ["one_to_one", "group"],
    "interactionStyle": ["support", "learning", "project_based"],
    "environment": ["indoor"],
    "cost": {
      "type": "free",
      "label": {
        "fr": "Services et formations municipales gratuits selon conditions",
        "en": "Municipal services and training are free subject to conditions"
      }
    },
    "eligibility": {
      "fr": "Certains services complets sont réservés aux associations inscrites à la MDA.",
      "en": "Some full services are reserved for associations registered with the MDA."
    },
    "description": {
      "fr": "Lieu central de la vie associative lilloise : information, accompagnement, formations et orientation vers les associations.",
      "en": "Central hub for Lille's association ecosystem, offering information, support, training and orientation."
    },
    "whyUseful": {
      "fr": "Pour découvrir le tissu associatif local avant de vous engager, ou même lancer votre propre projet.",
      "en": "Discover local associations before volunteering — or even start your own project."
    },
    "tags": ["associations", "support", "training", "project"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Participer/S-engager-dans-la-vie-associative/La-Maison-des-associations-de-Lille",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": false
  },
  {
    "id": "capv-adult-art-workshops",
    "name": "Centre d'Arts Plastiques et Visuels - activités adultes",
    "resourceType": "program",
    "themeIds": ["learn", "social", "new_rhythm"],
    "journeyRoles": ["explore", "act"],
    "seniorSpecific": false,
    "audience": ["adults"],
    "location": {
      "city": "Lille",
      "neighborhood": "Wazemmes",
      "address": "4 rue des Sarrazins, 59000 Lille"
    },
    "commitment": {
      "level": "medium",
      "cadence": "weekly_or_stage"
    },
    "socialFormat": ["small_group", "group"],
    "interactionStyle": ["learning", "activity_based"],
    "environment": ["indoor"],
    "cost": {
      "type": "paid",
      "label": {
        "fr": "Tarif selon quotient familial et format",
        "en": "Fee varies by household quotient and format"
      }
    },
    "eligibility": {
      "fr": "Ateliers adultes ; inscription selon places disponibles, avec priorité aux habitants de Lille/Lomme/Hellemmes.",
      "en": "Adult workshops; enrollment subject to availability, with priority for residents of Lille/Lomme/Hellemmes."
    },
    "description": {
      "fr": "Cours et ateliers adultes en arts plastiques, photographie, gravure, dessin, peinture, vidéo, sérigraphie et techniques mixtes.",
      "en": "Adult classes and workshops in visual arts, photography, printmaking, drawing, painting, video, screen printing and mixed media."
    },
    "whyUseful": {
      "fr": "Apprendre une pratique artistique et retrouver un groupe chaque semaine.",
      "en": "Learn an artistic practice and join a regular weekly group."
    },
    "tags": ["art", "creative", "learning", "regular", "adult"],
    "source": {
      "name": "Ville de Lille",
      "url": "https://www.lille.fr/Centre-d-Arts-plastiques-et-visuels/Activites-adultes/Arts-plastiques/Ateliers",
      "lastChecked": "2026-09-02"
    },
    "timeSensitive": true
  }
];

export function localizeResource(resource: LilleResource, locale: Locale) {
  return {
    ...resource,
    descriptionText: resource.description[locale],
    whyUsefulText: resource.whyUseful[locale],
    eligibilityText: resource.eligibility[locale],
    costLabelText: resource.cost.label[locale],
  };
}

export function getLilleResourcesByTheme(themeId: ThemeId) {
  return lilleResources.filter((resource) => resource.themeIds.includes(themeId));
}

export function getLilleResourcesForJourney(themeId: ThemeId, role?: JourneyRole) {
  return lilleResources.filter(
    (resource) =>
      resource.themeIds.includes(themeId) &&
      (!role || resource.journeyRoles.includes(role))
  );
}
