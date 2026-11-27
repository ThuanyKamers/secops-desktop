export const ui = {
  boot: {
    title: 'SecOps Desktop',
    subtitle: 'Un jeu de formation pratique en cybersécurité. Réalisez de vraies tâches de sécurité sur un poste de travail simulé, guidé par le même type de documentation que les équipes utilisent au quotidien.',
    chooseOs: 'Choisissez votre poste de travail',
    language: 'Langue',
    start: 'Allumer',
    footer: 'Projet de portfolio de Thuany Kamers',
    os: { windows: 'Windows', macos: 'macOS', linux: 'Linux' },
  },
  login: {
    user: 'Analyste sécurité',
    signIn: 'Se connecter',
    back: 'Changer de poste',
    or: "ou",
    guest: "Continuer en invité",
    guestHint: "En invité, votre progression reste dans ce navigateur et n’apparaît pas au classement.",
    switchAccount: "Utiliser un autre compte",
  },
  apps: {
    missions: 'Centre de formation',
    wiki: 'Wiki',
    soc: 'Tableau de bord SOC',
    siem: 'SIEM',
    intel: 'Threat Intel',
    firewall: 'Pare-feu',
    directory: 'Annuaire',
    profile: "Profil",
    notes: 'Bloc-notes',
  },
  window: { close: 'Fermer', minimize: 'Réduire', maximize: 'Agrandir' },
  taskbar: { start: 'Démarrer', logout: 'Se déconnecter', language: 'Langue' },
  tracks: {
    soc: { name: 'Opérations de sécurité (SOC)', desc: 'Triez les alertes, enquêtez dans le SIEM, contenez les menaces et rédigez des rapports.' },
    pentest: { name: 'Tests d’intrusion', desc: 'Trouvez et exploitez les failles avant les attaquants.' },
    forensics: { name: 'Investigation numérique', desc: 'Récupérez des preuves sur disques, en mémoire et dans les logs.' },
    cloud: { name: 'Sécurité du cloud', desc: 'Sécurisez identités, stockage et charges de travail dans le cloud.' },
    grc: { name: 'Gouvernance, risques et conformité', desc: 'Politiques, audits et analyses de risques.' },
  },
  hub: {
    title: 'Centre de formation',
    intro: 'Bienvenue chez Orbitae Logistics. Choisissez une mission. Chacune arrive comme un vrai travail : un ticket, un runbook dans le Wiki et les outils de votre bureau.',
    comingSoon: 'Bientôt disponible',
    start: 'Lancer la mission',
    restart: 'Recommencer',
    resume: 'Reprendre',
    abandon: 'Abandonner la mission',
    difficulty: 'Difficulté',
    best: 'Meilleur score : {{score}} %',
    active: 'Mission en cours',
    openBriefing: 'Ouvrir le briefing',
    confirmRestart: 'Recommencer réinitialise cette mission. Cliquez à nouveau pour confirmer.',
  },
  noMission: 'Aucune mission en cours. Lancez-en une depuis le Centre de formation.',
  roles: { l1: 'Analyste SOC N1', l2: 'Analyste SOC N2 (d’astreinte)', engineer: 'Ingénieur SOC', manager: 'Responsable SOC', you: 'Vous (N1)' },
  presence: { online: 'en ligne', offline: 'hors ligne' },
  severity: { critical: 'Critique', high: 'Élevée', medium: 'Moyenne', low: 'Faible' },
  status: { new: 'Nouvelle', in_progress: 'En cours', closed: 'Fermée' },
  verdict: { true_positive: 'Vrai positif', false_positive: 'Faux positif' },
  soc: {
    queue: 'File d’alertes',
    filters: { all: 'Toutes', new: 'Nouvelles', mine: 'Assignées à moi', open: 'Ouvertes' },
    cols: { id: 'ID', title: 'Alerte', severity: 'Sévérité', status: 'Statut', assignee: 'Responsable', time: 'Heure (UTC)' },
    unassigned: 'Non assignée',
    you: 'Vous',
    select: 'Sélectionnez une alerte pour voir ses détails.',
    source: 'Source',
    verdict: 'Verdict',
    description: 'Description',
    assignToMe: 'M’assigner',
    startWork: 'Passer En cours',
    writeReport: 'Rédiger le rapport et fermer',
    notMine: 'Assignez-vous l’alerte pour la traiter.',
    team: 'Équipe d’astreinte',
    reportTitle: 'Rapport d’incident : {{id}}',
    submit: 'Envoyer le rapport et fermer l’alerte',
    cancel: 'Annuler',
    missingVerdict: 'Choisissez un verdict avant d’envoyer.',
    escalatedTo: 'Escaladée à {{name}}',
    closedBy: 'Fermée avec le verdict : {{verdict}}',
  },
  siem: {
    placeholder: 'Recherche, ex. src_ip=203.0.113.45 AND outcome=failure',
    search: 'Rechercher',
    from: 'De',
    to: 'À',
    results_one: '{{count}} événement',
    results_other: '{{count}} événements',
    fields: 'Valeurs principales',
    noResults: 'Aucun événement ne correspond à cette recherche.',
    error: 'Erreur de requête : {{msg}}',
    help: 'Guide des requêtes',
    clear: 'Effacer',
    pickField: 'Cliquez sur une valeur pour l’ajouter à la recherche.',
    examples: 'Saisissez une requête et cliquez sur Rechercher. Quelques exemples :',
  },
  intel: {
    placeholder: 'Adresse IP, domaine, URL ou hash',
    lookup: 'Vérifier',
    score: 'Score de risque',
    malicious: 'Malveillant',
    suspicious: 'Suspect',
    clean: 'Aucune activité malveillante connue',
    tags: 'Étiquettes',
    reports: 'Signalements de la communauté',
    asn: 'Réseau (ASN)',
    country: 'Pays',
    firstSeen: 'Vu pour la première fois',
    notFound: 'Aucune donnée de renseignement pour « {{q}} ».',
    intro: 'Vérifiez la réputation d’un indicateur avant d’agir.',
  },
  firewall: {
    title: 'Liste de blocage du périmètre (fw-core-01)',
    intro: 'Le trafic entrant et sortant de ces adresses est rejeté au périmètre.',
    placeholder: 'Adresse IPv4 à bloquer',
    block: 'Bloquer',
    unblock: 'Débloquer',
    invalid: 'Saisissez une adresse IPv4 valide.',
    internal: 'C’est une adresse interne (privée). La bloquer au périmètre n’a aucun effet et peut masquer le problème.',
    empty: 'Aucune adresse bloquée.',
    since: 'Ajoutée',
    preexisting: 'règle existante',
    now: 'à l’instant',
  },
  directory: {
    search: 'Rechercher des personnes',
    cols: { name: 'Nom', user: 'Identifiant', dept: 'Service', location: 'Site', device: 'Appareil', status: 'Compte' },
    lock: 'Verrouiller le compte',
    unlock: 'Déverrouiller',
    locked: 'Verrouillé',
    active: 'Actif',
    details: 'Détails',
    email: 'E-mail',
    title: 'Poste',
    lockNote: 'Le verrouillage déconnecte l’utilisateur de toutes ses sessions (VPN compris) et bloque toute nouvelle connexion jusqu’à la réinitialisation du mot de passe par l’IT.',
  },
  result: {
    title: 'Bilan de la permanence',
    score: 'Score : {{score}} / {{max}} ({{pct}} %)',
    great: 'Excellent travail. C’est le rapport qu’un N2 veut recevoir.',
    good: 'Bon travail. Revoyez les points ci-dessous pour le compléter.',
    low: 'Des étapes clés ont été oubliées. Relisez le runbook et réessayez.',
    back: 'Retour au Centre de formation',
    retry: 'Refaire la mission',
    done: 'Fait',
    missed: 'Manqué',
    newBadges: "Nouveaux badges débloqués",
    profile: "Voir le profil",
  },
  notes: {
    placeholder: 'Notez les IP, identifiants, heures et tout ce que vous trouvez. Les notes sont enregistrées dans ce navigateur.',
    clear: 'Effacer',
    confirmClear: 'Cliquez à nouveau pour tout effacer.',
    saved: 'Enregistré',
    chars: '{{count}} caractères',
  },
  profile: {
    defaultName: "Analyste",
    nameLabel: "Nom d'affichage",
    level: "Niveau {{level}}",
    xpLabel: "Progression vers le niveau suivant",
    xpToNext: "{{xp}} / {{next}} XP",
    maxLevel: "{{xp}} XP · niveau maximum",
    locked: "Verrouillé",
    noHistory: "Aucune mission terminée pour l'instant. Vos tentatives apparaîtront ici.",
    stats: {
      xp: "XP",
      completed: "Missions",
      avg: "Score moyen",
      badges: "Badges",
    },
    tabs: {
      badges: "Badges",
      history: "Historique",
      ranking: "Classement",
    },
    cols: {
      date: "Date",
      mission: "Mission",
      score: "Score",
      time: "Durée",
    },
  },
  account: {
    loading: "Chargement…",
    joinTitle: "Rejoignez le classement mondial",
    joinText: "Créez un compte gratuit pour sauvegarder votre progression en ligne, comparer votre XP avec les autres et garder vos badges sur tous vos appareils.",
    github: "Se connecter avec GitHub",
    emailPlaceholder: "vous@exemple.fr",
    emailLink: "Recevoir un lien de connexion",
    emailSent: "Vérifiez votre boîte mail : nous vous avons envoyé un lien de connexion.",
    privacy: "Nous ne stockons qu'un nom d'utilisateur, vos résultats de mission et vos badges. Vous pouvez supprimer votre compte à tout moment.",
    username: "Nom d'utilisateur",
    usernameRule: "3 à 20 caractères : minuscules, chiffres et _",
    usernameTaken: "Ce nom d'utilisateur est déjà pris.",
    save: "Enregistrer",
    cancel: "Annuler",
    edit: "Modifier",
    syncing: "Synchronisation…",
    synced: "Progression enregistrée en ligne",
    signOut: "Se déconnecter",
    delete: "Supprimer le compte",
    confirmDelete: "Cliquez à nouveau pour supprimer votre compte et toutes vos données",
  },
  ranking: {
    signIn: "Connectez-vous dans le profil ci-dessus pour apparaître au classement.",
    empty: "Personne n'a encore terminé de mission. Soyez le premier !",
    error: "Impossible de charger le classement. Réessayez plus tard.",
    player: "Joueur·se",
  },
  levels: {
    "0": "Stagiaire",
    "1": "Analyste junior",
    "2": "Analyste SOC I",
    "3": "Analyste SOC II",
    "4": "Analyste senior",
    "5": "Threat Hunter",
    "6": "Incident Responder",
    "7": "Detection Engineer",
    "8": "SOC Lead",
    "9": "Cyber Defender",
  },
  badges: {
    first_steps: {
      name: "Première garde",
      desc: "Terminez une mission avec au moins 60 %.",
    },
    perfect: {
      name: "Rapport parfait",
      desc: "Obtenez 100 % sur une mission.",
    },
    flawless: {
      name: "Sans faute",
      desc: "Obtenez 100 % dès votre premier essai sur une mission.",
    },
    speed: {
      name: "Réponse rapide",
      desc: "Obtenez 80 % ou plus en moins de 10 minutes.",
    },
    by_the_book: {
      name: "Dans les règles",
      desc: "Ouvrez le runbook avant toute action de confinement.",
    },
    contained: {
      name: "Confiné",
      desc: "Bloquez l’attaquant et le compte compromis dans la même mission.",
    },
    polyglot: {
      name: "Polyglotte",
      desc: "Terminez des missions dans deux langues différentes.",
    },
    cross_platform: {
      name: "Multiplateforme",
      desc: "Terminez des missions sous Windows, macOS et Linux.",
    },
    soc_track: {
      name: "Diplômé·e SOC",
      desc: "Obtenez 80 % ou plus sur chaque mission SOC.",
    },
  },
  wikiNav: 'Pages',
}

export const wiki = {
  triage: {
    title: 'Manuel SOC : tri des alertes',
    body: `# Tri des alertes

Chaque alerte suit le même cycle : **choisir → comprendre → enquêter → décider → rapporter**.

## 1. Choisir la bonne alerte
1. Ne prenez que des alertes **Nouvelles** et non assignées. Ne travaillez jamais sur une alerte déjà prise par un collègue.
2. Triez par **sévérité** : critique, puis élevée, moyenne et faible.
3. À sévérité égale, prenez d’abord la **plus ancienne**. Une intrusion plus ancienne a eu plus de temps pour faire des dégâts.

## 2. Se l’approprier
Assignez-vous l’alerte et passez-la **En cours**, pour que l’équipe sache qu’elle est traitée.

## 3. Enquêter
Lisez la description puis confirmez les faits dans le **SIEM**. Vérifiez les indicateurs (IP, domaines, hashes) dans **Threat Intel**. Cherchez les personnes et les appareils dans l’**Annuaire**.

## 4. Décider
- **Vrai positif** : l’activité est malveillante ou viole une politique.
- **Faux positif** : l’activité est légitime. Expliquez *pourquoi*.

La sévérité fixe l’ordre de travail, pas le verdict.

## 5. Rapporter et fermer
Rédigez le rapport d’incident (voir *Rédiger un rapport d’incident*) et fermez l’alerte, ou escaladez-la.`,
  },
  siem: {
    title: 'Guide des requêtes SIEM',
    body: `# Guide des requêtes SIEM

Le SIEM collecte les logs de la passerelle VPN, du pare-feu, du proxy, du contrôleur de domaine, des serveurs de fichiers et de la passerelle mail.

## Syntaxe
| Exemple | Signification |
|---|---|
| \`src_ip=203.0.113.45\` | champ égal à la valeur |
| \`user=l.*\` | \`*\` est un joker |
| \`source=vpn outcome=failure\` | plusieurs termes = AND |
| \`user=admin OR user=root\` | l’un ou l’autre |
| \`NOT outcome=success\` | exclure |
| \`dst_port>1024\` | comparaison numérique (\`> < >= <=\`) |
| \`"payroll"\` | texte libre dans n’importe quel champ |

## Champs courants
- \`source\` : vpn, firewall, proxy, auth, fileserver, email
- \`user\`, \`src_ip\`, \`dst_ip\`, \`dst_port\`
- \`outcome\` (success / failure), \`action\` (allowed / denied)
- \`assigned_ip\` : IP interne attribuée par le VPN à une session

## Astuces
- Commencez large (une IP), puis affinez.
- Vérifiez toujours ce qui s’est passé **après** l’événement de l’alerte. Une connexion a-t-elle réussi ? Où est allée cette session ?
- Cliquez sur une valeur dans **Valeurs principales** pour l’ajouter à la recherche.`,
  },
  escalation: {
    title: 'Matrice d’escalade',
    body: `# Matrice d’escalade

Escaladez au **N2 d’astreinte** si l’un de ces points est vrai :
1. L’alerte indique une intrusion réelle qui nécessite une enquête approfondie.
2. Une remédiation est nécessaire au-delà du confinement N1 (réinitialisation de mot de passe, isolement d’un poste, suppression de malware).
3. Quelqu’un hors du SOC doit être prévenu (direction, clients, juridique).
4. Vous ne comprenez pas entièrement l’alerte. Demander vaut toujours mieux que deviner.

N’escaladez **pas** un vrai positif entièrement stoppé par un contrôle (par exemple une connexion bloquée par le pare-feu) et qui ne demande rien de plus. Documentez-le et fermez-le.

## Chaîne de contact
| Ordre | Qui | Quand |
|---|---|---|
| 1 | N2 d’astreinte | toujours en premier |
| 2 | N3 / Réponse à incident | N2 injoignable 30 min sur une alerte critique |
| 3 | Ingénieur SOC | problèmes d’outils : logs manquants, SIEM en panne |
| 4 | Responsable SOC | après les précédents, ou pour les questions d’équipe |

Pour escalader dans le Tableau de bord SOC, choisissez la personne dans le champ **Escalader à** du rapport d’incident.`,
  },
  reporting: {
    title: 'Rédiger un rapport d’incident',
    body: `# Rédiger un rapport d’incident

Les logs bruts sont supprimés au bout de quelques mois, mais les alertes sont conservées. **Le rapport est la trace permanente**, et c’est ce que le prochain analyste lit en premier.

Répondez aux cinq W :
- **Who (qui)** : utilisateurs et machines concernés.
- **What (quoi)** : ce qui s’est passé, étape par étape.
- **When (quand)** : heures de début et de fin (horodatages des logs, UTC).
- **Where (où)** : source et destination (IP, hôtes, URL).
- **Why (pourquoi)** : le raisonnement derrière votre verdict. La partie la plus importante.

Listez aussi les **indicateurs de compromission (IOC)** : IP, domaines, hashes, comptes, ainsi que les **actions déjà menées** (bloqué, compte verrouillé…).

Écrivez-le pour qu’une personne qui n’a pas vu l’alerte la comprenne en une minute.`,
  },
}
