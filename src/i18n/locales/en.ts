export const ui = {
  boot: {
    title: 'SecOps Desktop',
    subtitle: 'A hands-on cybersecurity training game. Work real security tasks on a simulated workstation, guided by the same kind of documentation teams use on the job.',
    chooseOs: 'Choose your workstation',
    language: 'Language',
    start: 'Power on',
    footer: 'Portfolio project by Thuany Kamers',
    os: { windows: 'Windows', macos: 'macOS', linux: 'Linux' },
  },
  login: {
    user: 'Security Analyst',
    signIn: 'Sign in',
    back: 'Change workstation',
    or: "or",
    guest: "Continue as guest",
    guestHint: "Guest progress stays in this browser and is not shown in the ranking.",
    switchAccount: "Use another account",
  },
  apps: {
    missions: 'Training Hub',
    wiki: 'Wiki',
    soc: 'SOC Dashboard',
    siem: 'SIEM',
    intel: 'Threat Intel',
    firewall: 'Firewall',
    directory: 'Directory',
    profile: "Profile",
    notes: 'Notes',
  },
  window: { close: 'Close', minimize: 'Minimize', maximize: 'Maximize' },
  taskbar: { start: 'Start', logout: 'Sign out', language: 'Language' },
  tracks: {
    soc: { name: 'Security Operations (SOC)', desc: 'Triage alerts, investigate in the SIEM, contain threats and report.' },
    pentest: { name: 'Penetration Testing', desc: 'Find and exploit weaknesses before attackers do.' },
    forensics: { name: 'Digital Forensics', desc: 'Recover evidence from disks, memory and logs.' },
    cloud: { name: 'Cloud Security', desc: 'Secure identities, storage and workloads in the cloud.' },
    grc: { name: 'Governance, Risk & Compliance', desc: 'Policies, audits and risk assessments.' },
  },
  hub: {
    title: 'Training Hub',
    intro: 'Welcome to Orbitae Logistics. Pick a mission. Each one arrives the way real work does: a ticket, a runbook in the Wiki, and the tools on your desktop.',
    comingSoon: 'Coming soon',
    start: 'Start mission',
    restart: 'Restart',
    resume: 'Resume',
    abandon: 'Abandon mission',
    difficulty: 'Difficulty',
    best: 'Best score: {{score}}%',
    active: 'Active mission',
    openBriefing: 'Open briefing',
    confirmRestart: 'Restarting resets this mission. Click again to confirm.',
  },
  noMission: 'No active mission. Start one from the Training Hub.',
  roles: { l1: 'SOC Analyst L1', l2: 'SOC Analyst L2 (on shift)', engineer: 'SOC Engineer', manager: 'SOC Manager', you: 'You (L1)' },
  presence: { online: 'online', offline: 'offline' },
  severity: { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' },
  status: { new: 'New', in_progress: 'In progress', closed: 'Closed' },
  verdict: { true_positive: 'True positive', false_positive: 'False positive' },
  soc: {
    queue: 'Alert queue',
    filters: { all: 'All', new: 'New', mine: 'Assigned to me', open: 'Open' },
    cols: { id: 'ID', title: 'Alert', severity: 'Severity', status: 'Status', assignee: 'Assignee', time: 'Time (UTC)' },
    unassigned: 'Unassigned',
    you: 'You',
    select: 'Select an alert to see its details.',
    source: 'Source',
    verdict: 'Verdict',
    description: 'Description',
    assignToMe: 'Assign to me',
    startWork: 'Set In progress',
    writeReport: 'Write report & close',
    notMine: 'Assign the alert to yourself to work on it.',
    team: 'Team on shift',
    reportTitle: 'Case report: {{id}}',
    submit: 'Submit report and close alert',
    cancel: 'Cancel',
    missingVerdict: 'Choose a verdict before submitting.',
    escalatedTo: 'Escalated to {{name}}',
    closedBy: 'Closed with verdict: {{verdict}}',
  },
  siem: {
    placeholder: 'Search, e.g. src_ip=203.0.113.45 AND outcome=failure',
    search: 'Search',
    from: 'From',
    to: 'To',
    results_one: '{{count}} event',
    results_other: '{{count}} events',
    fields: 'Top values',
    noResults: 'No events match this search.',
    error: 'Query error: {{msg}}',
    help: 'Query guide',
    clear: 'Clear',
    pickField: 'Click a value to add it to the search.',
    examples: 'Type a query and press Search. Some examples:',
  },
  intel: {
    placeholder: 'IP address, domain, URL or hash',
    lookup: 'Look up',
    score: 'Risk score',
    malicious: 'Malicious',
    suspicious: 'Suspicious',
    clean: 'No known malicious activity',
    tags: 'Tags',
    reports: 'Community reports',
    asn: 'Network (ASN)',
    country: 'Country',
    firstSeen: 'First seen',
    notFound: 'No intelligence records for "{{q}}".',
    intro: 'Check the reputation of an indicator before acting on it.',
  },
  firewall: {
    title: 'Perimeter blocklist (fw-core-01)',
    intro: 'Inbound and outbound traffic from these addresses is dropped at the perimeter.',
    placeholder: 'IPv4 address to block',
    block: 'Block',
    unblock: 'Unblock',
    invalid: 'Enter a valid IPv4 address.',
    internal: 'This is an internal (private) address. Blocking it at the perimeter has no effect and may hide the problem.',
    empty: 'No addresses blocked.',
    since: 'Added',
    preexisting: 'existing rule',
    now: 'just now',
  },
  directory: {
    search: 'Search people',
    cols: { name: 'Name', user: 'Username', dept: 'Department', location: 'Location', device: 'Device', status: 'Account' },
    lock: 'Lock account',
    unlock: 'Unlock',
    locked: 'Locked',
    active: 'Active',
    details: 'Details',
    email: 'Email',
    title: 'Job title',
    lockNote: 'Locking signs the user out of every session (VPN included) and blocks new logins until IT resets the password.',
  },
  result: {
    title: 'Shift review',
    score: 'Score: {{score}} / {{max}} ({{pct}}%)',
    great: 'Excellent work. This is the report an L2 wants to receive.',
    good: 'Good job. Review the points below to make it complete.',
    low: 'Some key steps were missed. Read the runbook again and retry.',
    back: 'Back to Training Hub',
    retry: 'Retry mission',
    done: 'Done',
    missed: 'Missed',
    newBadges: "New badges unlocked",
    profile: "View profile",
  },
  notes: {
    placeholder: 'Write down IPs, usernames, times and anything you find. Notes are saved in this browser.',
    clear: 'Clear',
    confirmClear: 'Click again to erase everything.',
    saved: 'Saved',
    chars: '{{count}} characters',
  },
  profile: {
    defaultName: "Analyst",
    nameLabel: "Display name",
    level: "Level {{level}}",
    xpLabel: "Progress to next level",
    xpToNext: "{{xp}} / {{next}} XP",
    maxLevel: "{{xp}} XP · max level",
    locked: "Locked",
    noHistory: "No missions finished yet. Your attempts will show up here.",
    stats: {
      xp: "XP",
      completed: "Missions",
      avg: "Avg. score",
      badges: "Badges",
    },
    tabs: {
      badges: "Badges",
      history: "History",
      ranking: "Ranking",
    },
    cols: {
      date: "Date",
      mission: "Mission",
      score: "Score",
      time: "Time",
    },
  },
  account: {
    loading: "Loading…",
    joinTitle: "Join the global ranking",
    joinText: "Create a free account to save your progress online, compare XP with other players and keep your badges on any device.",
    github: "Sign in with GitHub",
    emailPlaceholder: "you@example.com",
    emailLink: "Email me a sign-in link",
    emailSent: "Check your inbox: we sent you a sign-in link.",
    privacy: "We only store a username, your mission results and badges. You can delete your account at any time.",
    username: "Username",
    usernameRule: "3 to 20 characters: lowercase letters, numbers and _",
    usernameTaken: "That username is already taken.",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    syncing: "Syncing…",
    synced: "Progress saved online",
    signOut: "Sign out",
    delete: "Delete account",
    confirmDelete: "Click again to delete your account and all your data",
    photoChange: "Change photo",
    photoRemove: "Remove photo",
    photoHint: "PNG, JPG or WebP up to 5 MB",
    photoUploading: "Uploading…",
    photoSignIn: "Sign in to add a photo",
    avatarErr: {
      type: "Use a PNG, JPG, WebP or GIF image.",
      tooBig: "The image is too large. Pick one under 5 MB.",
      unreadable: "Could not read this image. Try another file.",
    },
  },
  ranking: {
    signIn: "Sign in on the profile above to appear in the ranking.",
    empty: "No one has finished a mission yet. Be the first!",
    error: "Could not load the ranking. Try again later.",
    player: "Player",
  },
  levels: {
    "0": "Trainee",
    "1": "Junior Analyst",
    "2": "SOC Analyst I",
    "3": "SOC Analyst II",
    "4": "Senior Analyst",
    "5": "Threat Hunter",
    "6": "Incident Responder",
    "7": "Detection Engineer",
    "8": "SOC Lead",
    "9": "Cyber Defender",
  },
  badges: {
    first_steps: {
      name: "First shift",
      desc: "Finish any mission with at least 60%.",
    },
    perfect: {
      name: "Perfect report",
      desc: "Score 100% on a mission.",
    },
    flawless: {
      name: "Flawless",
      desc: "Score 100% on your first attempt at a mission.",
    },
    speed: {
      name: "Rapid response",
      desc: "Score 80% or more in under 10 minutes.",
    },
    by_the_book: {
      name: "By the book",
      desc: "Open the runbook before taking any containment action.",
    },
    contained: {
      name: "Contained",
      desc: "Block the attacker and lock the compromised account in the same mission.",
    },
    polyglot: {
      name: "Polyglot",
      desc: "Finish missions in two different languages.",
    },
    cross_platform: {
      name: "Cross-platform",
      desc: "Finish missions on Windows, macOS and Linux.",
    },
    soc_track: {
      name: "SOC graduate",
      desc: "Score 80% or more on every SOC mission.",
    },
  },
  wikiNav: 'Pages',
}

export const wiki = {
  triage: {
    title: 'SOC handbook: alert triage',
    body: `# Alert triage

Every alert follows the same cycle: **pick → understand → investigate → decide → report**.

## 1. Pick the right alert
1. Only take alerts that are **New** and unassigned. Never work on an alert a colleague already owns.
2. Sort by **severity**: critical, then high, medium and low.
3. For the same severity, take the **oldest** first. An older intrusion has had more time to cause damage.

## 2. Own it
Assign the alert to yourself and set it to **In progress**, so the team knows it is being handled.

## 3. Investigate
Read the description, then confirm the facts in the **SIEM**. Check indicators (IPs, domains, hashes) in **Threat Intel**. Look up people and devices in the **Directory**.

## 4. Decide
- **True positive**: the activity is malicious or a policy violation.
- **False positive**: the activity is legitimate. Explain *why*.

Severity tells you the order of work, not the verdict.

## 5. Report and close
Write the case report (see *Writing a case report*) and close the alert, or escalate it.`,
  },
  siem: {
    title: 'SIEM query guide',
    body: `# SIEM query guide

The SIEM collects logs from the VPN gateway, firewall, proxy, domain controller, file servers and mail gateway.

## Syntax
| Example | Meaning |
|---|---|
| \`src_ip=203.0.113.45\` | field equals value |
| \`user=l.*\` | \`*\` is a wildcard |
| \`source=vpn outcome=failure\` | several terms = AND |
| \`user=admin OR user=root\` | either term |
| \`NOT outcome=success\` | exclude |
| \`dst_port>1024\` | numeric comparison (\`> < >= <=\`) |
| \`"payroll"\` | free text in any field |

## Common fields
- \`source\`: vpn, firewall, proxy, auth, fileserver, email
- \`user\`, \`src_ip\`, \`dst_ip\`, \`dst_port\`
- \`outcome\` (success / failure), \`action\` (allowed / denied)
- \`assigned_ip\`: internal IP the VPN gives to a session

## Tips
- Start broad (one IP), then narrow down.
- Always check what happened **after** the event in the alert. Did a login succeed? Where did that session go?
- Click a value in **Top values** to add it to your search.`,
  },
  escalation: {
    title: 'Escalation matrix',
    body: `# Escalation matrix

Escalate to the **L2 on shift** when any of these is true:
1. The alert indicates a real intrusion that needs deeper investigation.
2. Remediation is needed beyond L1 containment (password reset, host isolation, malware removal).
3. Someone outside the SOC must be told (management, customers, legal).
4. You do not fully understand the alert. Asking is always better than guessing.

Do **not** escalate a true positive that was fully stopped by a control (for example, a connection blocked by the firewall) and needs no further action. Document it and close it.

## Contact chain
| Order | Who | When |
|---|---|---|
| 1 | L2 on shift | always first |
| 2 | L3 / Incident Response | L2 unreachable for 30 min on a critical alert |
| 3 | SOC Engineer | tooling problems: logs missing, SIEM down |
| 4 | SOC Manager | after the above, or for staffing issues |

To escalate in the SOC Dashboard, choose the person in the **Escalate to** field of the case report.`,
  },
  reporting: {
    title: 'Writing a case report',
    body: `# Writing a case report

Raw logs are deleted after a few months, but alerts are kept. **The report is the permanent record**, and it is what the next analyst reads first.

Answer the five Ws:
- **Who**: users and machines involved.
- **What**: what happened, step by step.
- **When**: start and end time (use the log timestamps, UTC).
- **Where**: source and destination (IPs, hosts, URLs).
- **Why**: the reasoning behind your verdict. The most important part.

Also list the **indicators of compromise (IOCs)**: IPs, domains, hashes, accounts, and the **actions already taken** (blocked, locked...).

Write it so someone who has not seen the alert understands it in one minute.`,
  },
}
