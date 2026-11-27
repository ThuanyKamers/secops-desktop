export const ui = {
  boot: {
    title: 'SecOps Desktop',
    subtitle: 'Ein praxisnahes Cybersecurity-Trainingsspiel. Erledige echte Sicherheitsaufgaben an einem simulierten Arbeitsplatz, angeleitet von der gleichen Art Dokumentation, die Teams im Berufsalltag nutzen.',
    chooseOs: 'Wähle deinen Arbeitsplatz',
    language: 'Sprache',
    start: 'Einschalten',
    footer: 'Portfolio-Projekt von Thuany Kamers',
    os: { windows: 'Windows', macos: 'macOS', linux: 'Linux' },
  },
  login: {
    user: 'Security Analyst',
    password: 'Passwort',
    signIn: 'Anmelden',
    hint: 'Trainingsarbeitsplatz: kein Passwort nötig.',
    back: 'Arbeitsplatz wechseln',
  },
  apps: {
    missions: 'Trainingszentrale',
    wiki: 'Wiki',
    soc: 'SOC-Dashboard',
    siem: 'SIEM',
    intel: 'Threat Intel',
    firewall: 'Firewall',
    directory: 'Verzeichnis',
    profile: "Profil",
    notes: 'Notizen',
  },
  window: { close: 'Schließen', minimize: 'Minimieren', maximize: 'Maximieren' },
  taskbar: { start: 'Start', logout: 'Abmelden', language: 'Sprache' },
  tracks: {
    soc: { name: 'Security Operations (SOC)', desc: 'Alarme triagieren, im SIEM ermitteln, Bedrohungen eindämmen und berichten.' },
    pentest: { name: 'Penetrationstests', desc: 'Schwachstellen finden und ausnutzen, bevor Angreifer es tun.' },
    forensics: { name: 'Digitale Forensik', desc: 'Beweise aus Festplatten, Arbeitsspeicher und Logs sichern.' },
    cloud: { name: 'Cloud-Sicherheit', desc: 'Identitäten, Speicher und Workloads in der Cloud absichern.' },
    grc: { name: 'Governance, Risk & Compliance', desc: 'Richtlinien, Audits und Risikobewertungen.' },
  },
  hub: {
    title: 'Trainingszentrale',
    intro: 'Willkommen bei Orbitae Logistics. Wähle eine Mission. Jede kommt so an wie echte Arbeit: ein Ticket, ein Runbook im Wiki und die Tools auf deinem Desktop.',
    comingSoon: 'Demnächst',
    start: 'Mission starten',
    restart: 'Neu starten',
    resume: 'Fortsetzen',
    abandon: 'Mission abbrechen',
    difficulty: 'Schwierigkeit',
    best: 'Beste Wertung: {{score}} %',
    active: 'Aktive Mission',
    openBriefing: 'Briefing öffnen',
    confirmRestart: 'Ein Neustart setzt diese Mission zurück. Zum Bestätigen erneut klicken.',
  },
  noMission: 'Keine aktive Mission. Starte eine in der Trainingszentrale.',
  roles: { l1: 'SOC-Analyst L1', l2: 'SOC-Analyst L2 (im Dienst)', engineer: 'SOC Engineer', manager: 'SOC-Manager', you: 'Du (L1)' },
  presence: { online: 'online', offline: 'offline' },
  severity: { critical: 'Kritisch', high: 'Hoch', medium: 'Mittel', low: 'Niedrig' },
  status: { new: 'Neu', in_progress: 'In Bearbeitung', closed: 'Geschlossen' },
  verdict: { true_positive: 'True Positive', false_positive: 'False Positive' },
  soc: {
    queue: 'Alarm-Warteschlange',
    filters: { all: 'Alle', new: 'Neu', mine: 'Mir zugewiesen', open: 'Offen' },
    cols: { id: 'ID', title: 'Alarm', severity: 'Schweregrad', status: 'Status', assignee: 'Zuständig', time: 'Zeit (UTC)' },
    unassigned: 'Nicht zugewiesen',
    you: 'Du',
    select: 'Wähle einen Alarm, um die Details zu sehen.',
    source: 'Quelle',
    verdict: 'Urteil',
    description: 'Beschreibung',
    assignToMe: 'Mir zuweisen',
    startWork: 'Auf In Bearbeitung setzen',
    writeReport: 'Bericht schreiben & schließen',
    notMine: 'Weise dir den Alarm zu, um daran zu arbeiten.',
    team: 'Team im Dienst',
    reportTitle: 'Fallbericht: {{id}}',
    submit: 'Bericht senden und Alarm schließen',
    cancel: 'Abbrechen',
    missingVerdict: 'Wähle vor dem Senden ein Urteil.',
    escalatedTo: 'Eskaliert an {{name}}',
    closedBy: 'Geschlossen mit Urteil: {{verdict}}',
  },
  siem: {
    placeholder: 'Suche, z. B. src_ip=203.0.113.45 AND outcome=failure',
    search: 'Suchen',
    from: 'Von',
    to: 'Bis',
    results_one: '{{count}} Ereignis',
    results_other: '{{count}} Ereignisse',
    fields: 'Häufigste Werte',
    noResults: 'Keine Ereignisse passen zu dieser Suche.',
    error: 'Abfragefehler: {{msg}}',
    help: 'Abfrage-Leitfaden',
    clear: 'Leeren',
    pickField: 'Klicke auf einen Wert, um ihn zur Suche hinzuzufügen.',
    examples: 'Gib eine Abfrage ein und klicke auf Suchen. Einige Beispiele:',
  },
  intel: {
    placeholder: 'IP-Adresse, Domain, URL oder Hash',
    lookup: 'Prüfen',
    score: 'Risikowert',
    malicious: 'Bösartig',
    suspicious: 'Verdächtig',
    clean: 'Keine bekannte bösartige Aktivität',
    tags: 'Tags',
    reports: 'Community-Meldungen',
    asn: 'Netz (ASN)',
    country: 'Land',
    firstSeen: 'Zuerst gesehen',
    notFound: 'Keine Threat-Intelligence-Einträge für „{{q}}“.',
    intro: 'Prüfe die Reputation eines Indikators, bevor du handelst.',
  },
  firewall: {
    title: 'Perimeter-Sperrliste (fw-core-01)',
    intro: 'Ein- und ausgehender Verkehr dieser Adressen wird am Perimeter verworfen.',
    placeholder: 'Zu sperrende IPv4-Adresse',
    block: 'Sperren',
    unblock: 'Entsperren',
    invalid: 'Gib eine gültige IPv4-Adresse ein.',
    internal: 'Das ist eine interne (private) Adresse. Eine Sperre am Perimeter bewirkt nichts und kann das Problem verdecken.',
    empty: 'Keine Adressen gesperrt.',
    since: 'Hinzugefügt',
    preexisting: 'bestehende Regel',
    now: 'gerade eben',
  },
  directory: {
    search: 'Personen suchen',
    cols: { name: 'Name', user: 'Benutzername', dept: 'Abteilung', location: 'Standort', device: 'Gerät', status: 'Konto' },
    lock: 'Konto sperren',
    unlock: 'Entsperren',
    locked: 'Gesperrt',
    active: 'Aktiv',
    details: 'Details',
    email: 'E-Mail',
    title: 'Position',
    lockNote: 'Das Sperren beendet alle Sitzungen des Benutzers (auch VPN) und verhindert neue Anmeldungen, bis die IT das Passwort zurücksetzt.',
  },
  result: {
    title: 'Schichtauswertung',
    score: 'Wertung: {{score}} / {{max}} ({{pct}} %)',
    great: 'Hervorragende Arbeit. Genau so einen Bericht will ein L2 bekommen.',
    good: 'Gute Arbeit. Prüfe die Punkte unten, um ihn zu vervollständigen.',
    low: 'Einige wichtige Schritte fehlen. Lies das Runbook noch einmal und versuche es erneut.',
    back: 'Zurück zur Trainingszentrale',
    retry: 'Mission wiederholen',
    done: 'Erledigt',
    missed: 'Verpasst',
    newBadges: "Neue Abzeichen freigeschaltet",
    profile: "Profil ansehen",
  },
  notes: {
    placeholder: 'Notiere IPs, Benutzernamen, Zeiten und alles, was du findest. Notizen werden in diesem Browser gespeichert.',
    clear: 'Leeren',
    confirmClear: 'Zum Löschen aller Notizen erneut klicken.',
    saved: 'Gespeichert',
    chars: '{{count}} Zeichen',
  },
  profile: {
    defaultName: "Analyst:in",
    nameLabel: "Anzeigename",
    level: "Level {{level}}",
    xpLabel: "Fortschritt zum nächsten Level",
    xpToNext: "{{xp}} / {{next}} XP",
    maxLevel: "{{xp}} XP · Höchstlevel",
    locked: "Gesperrt",
    noHistory: "Noch keine Mission abgeschlossen. Deine Versuche erscheinen hier.",
    stats: {
      xp: "XP",
      completed: "Missionen",
      avg: "Ø Punktzahl",
      badges: "Abzeichen",
    },
    tabs: {
      badges: "Abzeichen",
      history: "Verlauf",
      ranking: "Rangliste",
    },
    cols: {
      date: "Datum",
      mission: "Mission",
      score: "Punkte",
      time: "Zeit",
    },
  },
  account: {
    loading: "Wird geladen…",
    joinTitle: "Mach mit bei der globalen Rangliste",
    joinText: "Erstelle ein kostenloses Konto, um deinen Fortschritt online zu speichern, deine XP mit anderen zu vergleichen und deine Abzeichen auf jedem Gerät zu behalten.",
    github: "Mit GitHub anmelden",
    emailPlaceholder: "du@beispiel.de",
    emailLink: "Anmeldelink per E-Mail senden",
    emailSent: "Schau in dein Postfach: Wir haben dir einen Anmeldelink geschickt.",
    privacy: "Wir speichern nur einen Benutzernamen, deine Missionsergebnisse und Abzeichen. Du kannst dein Konto jederzeit löschen.",
    username: "Benutzername",
    usernameRule: "3 bis 20 Zeichen: Kleinbuchstaben, Ziffern und _",
    usernameTaken: "Dieser Benutzername ist bereits vergeben.",
    save: "Speichern",
    cancel: "Abbrechen",
    edit: "Bearbeiten",
    syncing: "Wird synchronisiert…",
    synced: "Fortschritt online gespeichert",
    signOut: "Abmelden",
    delete: "Konto löschen",
    confirmDelete: "Erneut klicken, um dein Konto und alle Daten zu löschen",
  },
  ranking: {
    signIn: "Melde dich oben im Profil an, um in der Rangliste zu erscheinen.",
    empty: "Noch hat niemand eine Mission abgeschlossen. Sei die erste Person!",
    error: "Die Rangliste konnte nicht geladen werden. Versuch es später erneut.",
    player: "Spieler:in",
  },
  levels: {
    "0": "Trainee",
    "1": "Junior-Analyst:in",
    "2": "SOC-Analyst:in I",
    "3": "SOC-Analyst:in II",
    "4": "Senior-Analyst:in",
    "5": "Threat Hunter",
    "6": "Incident Responder",
    "7": "Detection Engineer",
    "8": "SOC Lead",
    "9": "Cyber Defender",
  },
  badges: {
    first_steps: {
      name: "Erste Schicht",
      desc: "Schließe eine Mission mit mindestens 60 % ab.",
    },
    perfect: {
      name: "Perfekter Bericht",
      desc: "Erreiche 100 % in einer Mission.",
    },
    flawless: {
      name: "Makellos",
      desc: "Erreiche 100 % beim ersten Versuch einer Mission.",
    },
    speed: {
      name: "Schnelle Reaktion",
      desc: "Erreiche 80 % oder mehr in unter 10 Minuten.",
    },
    by_the_book: {
      name: "Nach Vorschrift",
      desc: "Öffne das Runbook vor der ersten Eindämmungsmaßnahme.",
    },
    contained: {
      name: "Eingedämmt",
      desc: "Sperre Angreifer und kompromittiertes Konto in derselben Mission.",
    },
    polyglot: {
      name: "Polyglott",
      desc: "Schließe Missionen in zwei verschiedenen Sprachen ab.",
    },
    cross_platform: {
      name: "Plattformübergreifend",
      desc: "Schließe Missionen unter Windows, macOS und Linux ab.",
    },
    soc_track: {
      name: "SOC-Absolvent:in",
      desc: "Erreiche 80 % oder mehr in jeder SOC-Mission.",
    },
  },
  wikiNav: 'Seiten',
}

export const wiki = {
  triage: {
    title: 'SOC-Handbuch: Alarm-Triage',
    body: `# Alarm-Triage

Jeder Alarm folgt demselben Zyklus: **auswählen → verstehen → ermitteln → entscheiden → berichten**.

## 1. Den richtigen Alarm wählen
1. Nimm nur **neue**, nicht zugewiesene Alarme. Arbeite nie an einem Alarm, den schon jemand aus dem Team hat.
2. Sortiere nach **Schweregrad**: kritisch, dann hoch, mittel und niedrig.
3. Bei gleichem Schweregrad zuerst den **ältesten**. Ein älterer Einbruch hatte mehr Zeit, Schaden anzurichten.

## 2. Übernehmen
Weise dir den Alarm zu und setze ihn auf **In Bearbeitung**, damit das Team weiß, dass er bearbeitet wird.

## 3. Ermitteln
Lies die Beschreibung und bestätige die Fakten im **SIEM**. Prüfe Indikatoren (IPs, Domains, Hashes) in **Threat Intel**. Schlage Personen und Geräte im **Verzeichnis** nach.

## 4. Entscheiden
- **True Positive**: Die Aktivität ist bösartig oder ein Richtlinienverstoß.
- **False Positive**: Die Aktivität ist legitim. Erkläre, *warum*.

Der Schweregrad bestimmt die Reihenfolge der Arbeit, nicht das Urteil.

## 5. Berichten und schließen
Schreibe den Fallbericht (siehe *Einen Fallbericht schreiben*) und schließe den Alarm oder eskaliere ihn.`,
  },
  siem: {
    title: 'SIEM-Abfrage-Leitfaden',
    body: `# SIEM-Abfrage-Leitfaden

Das SIEM sammelt Logs von VPN-Gateway, Firewall, Proxy, Domain Controller, Dateiservern und Mail-Gateway.

## Syntax
| Beispiel | Bedeutung |
|---|---|
| \`src_ip=203.0.113.45\` | Feld gleich Wert |
| \`user=l.*\` | \`*\` ist ein Platzhalter |
| \`source=vpn outcome=failure\` | mehrere Begriffe = AND |
| \`user=admin OR user=root\` | einer von beiden |
| \`NOT outcome=success\` | ausschließen |
| \`dst_port>1024\` | numerischer Vergleich (\`> < >= <=\`) |
| \`"payroll"\` | Freitext in jedem Feld |

## Häufige Felder
- \`source\`: vpn, firewall, proxy, auth, fileserver, email
- \`user\`, \`src_ip\`, \`dst_ip\`, \`dst_port\`
- \`outcome\` (success / failure), \`action\` (allowed / denied)
- \`assigned_ip\`: interne IP, die das VPN einer Sitzung zuweist

## Tipps
- Beginne breit (eine IP) und grenze dann ein.
- Prüfe immer, was **nach** dem Ereignis im Alarm passiert ist. War eine Anmeldung erfolgreich? Wohin ging diese Sitzung?
- Klicke unter **Häufigste Werte** auf einen Wert, um ihn zur Suche hinzuzufügen.`,
  },
  escalation: {
    title: 'Eskalationsmatrix',
    body: `# Eskalationsmatrix

Eskaliere an den **L2 im Dienst**, wenn einer dieser Punkte zutrifft:
1. Der Alarm deutet auf einen echten Einbruch hin, der tiefer untersucht werden muss.
2. Es braucht Maßnahmen über die L1-Eindämmung hinaus (Passwort-Reset, Host-Isolierung, Malware-Entfernung).
3. Jemand außerhalb des SOC muss informiert werden (Management, Kunden, Rechtsabteilung).
4. Du verstehst den Alarm nicht vollständig. Fragen ist immer besser als raten.

Eskaliere **keinen** True Positive, der von einer Kontrolle vollständig gestoppt wurde (z. B. eine von der Firewall blockierte Verbindung) und nichts weiter erfordert. Dokumentiere ihn und schließe ihn.

## Kontaktkette
| Reihenfolge | Wer | Wann |
|---|---|---|
| 1 | L2 im Dienst | immer zuerst |
| 2 | L3 / Incident Response | L2 bei kritischem Alarm 30 Min. nicht erreichbar |
| 3 | SOC Engineer | Tool-Probleme: fehlende Logs, SIEM ausgefallen |
| 4 | SOC-Manager | nach den obigen oder bei Personalthemen |

Zum Eskalieren im SOC-Dashboard wählst du die Person im Feld **Eskalieren an** des Fallberichts.`,
  },
  reporting: {
    title: 'Einen Fallbericht schreiben',
    body: `# Einen Fallbericht schreiben

Rohlogs werden nach einigen Monaten gelöscht, Alarme bleiben erhalten. **Der Bericht ist die dauerhafte Aufzeichnung**, und ihn liest der nächste Analyst zuerst.

Beantworte die fünf W:
- **Wer**: beteiligte Benutzer und Geräte.
- **Was**: was passiert ist, Schritt für Schritt.
- **Wann**: Start- und Endzeit (Zeitstempel aus den Logs, UTC).
- **Wo**: Quelle und Ziel (IPs, Hosts, URLs).
- **Warum**: die Begründung deines Urteils. Der wichtigste Teil.

Liste auch die **Indicators of Compromise (IOCs)** auf: IPs, Domains, Hashes, Konten, sowie die **bereits ergriffenen Maßnahmen** (gesperrt, Konto deaktiviert …).

Schreibe so, dass jemand, der den Alarm nicht gesehen hat, ihn in einer Minute versteht.`,
  },
}
