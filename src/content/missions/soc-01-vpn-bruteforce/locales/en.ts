export default {
  hub: {
    title: 'Mission 1: Knock knock on the VPN',
    summary: 'A burst of failed VPN logins has triggered an alert. Find out if the attacker got in, contain it and hand the case to L2.',
    skills: 'Alert triage · SIEM · IP reputation · Containment · Escalation · 5 Ws report',
  },
  alerts: {
    a2041: {
      title: 'Multiple failed VPN logins from a single source',
      desc: 'More than 50 failed authentication attempts against vpn-gw-01 from one source IP within 5 minutes. Rule: AUTH-BF-003. Possible brute force or password spraying. Follow runbook RB-AUTH-01.',
    },
    a2042: {
      title: 'Antivirus signature update failed',
      desc: 'EDR agent on PC-WH-005 could not download today\'s signature update (timeout). Agent is otherwise healthy.',
    },
    a2038: {
      title: 'Outbound connection to newly registered domain',
      desc: 'Workstation LPT-SAL-007 connected to a domain registered 2 days ago.',
    },
    a2035: {
      title: 'Unusual print volume',
      desc: '420 pages printed by one user in 10 minutes.',
    },
  },
  intel: {
    attacker: 'Hosting-provider IP widely reported for VPN and SSH brute-force campaigns in the last 30 days.',
    homeIsp: 'Residential broadband address. No malicious reports.',
  },
  wiki: {
    briefing: {
      title: 'Shift briefing: Monday 08:15 UTC',
      body: `# Shift briefing

Good morning, and welcome to your first shift on the Orbitae Logistics SOC. You are the **L1 analyst** on duty.

A new **high** severity alert just landed in the queue. Handle it following our procedures:

- Runbook for this alert type: [RB-AUTH-01: Authentication brute force](#rb-auth-01)
- How we pick and handle alerts: [Alert triage](#triage)
- How to search logs: [SIEM query guide](#siem-guide)
- Who to call: [Escalation matrix](#escalation)
- What goes in the report: [Writing a case report](#reporting)

Your team today: **Lucas Sagás** (L2 on shift), **Thuany Kamers** (SOC Engineer) and **Davi Amorim** (L1, working on another alert). **Priya Nair** (SOC Manager) is in meetings all morning.

Open the **SOC Dashboard** to begin.`,
    },
    runbook: {
      title: 'RB-AUTH-01: Authentication brute force',
      body: `# RB-AUTH-01: Authentication brute force

**Applies to:** rules AUTH-BF-001 to AUTH-BF-005 (VPN, webmail, SSO).
**Goal:** find out whether any login attempt **succeeded**, contain the threat, and report.

## Step 1: Take the alert
In the **SOC Dashboard**, assign the alert to yourself and set it to **In progress**.

## Step 2: Scope the attack in the SIEM
Search for the source IP from the alert:

\`src_ip=<attacker IP>\`

Write down:
- first and last event (time window),
- which **usernames** were tried,
- whether **any attempt has \`outcome=success\`**.

> A few failures followed by a success from a user's usual IP is normal (a typo). Hundreds of failures from an unknown IP is not.

## Step 3: Check the source reputation
Look up the attacker IP in **Threat Intel**. A high risk score and brute-force tags confirm the activity is malicious.

## Step 4: If a login succeeded, follow the session
A successful VPN login gets an internal IP (\`assigned_ip\`). Search for it in the SIEM to see **what the session touched** (file servers, RDP, etc.).
Check in the **Directory** whether the real user could have made that login (location, device, other logins at that time).

## Step 5: Contain
1. **Block** the attacker IP on the perimeter **Firewall**. Never block internal or legitimate user IPs.
2. If an account was compromised, **lock it** in the **Directory**. This ends its VPN session.
3. Only lock accounts you have evidence for.

## Step 6: Report and escalate
- Verdict: true positive if the activity is malicious.
- A **successful** login by an attacker is a compromise: **escalate to the L2 on shift**. The account needs a password reset and the accessed data must be reviewed.
- If every attempt failed and the IP is blocked, close without escalation.

Fill the case report with the 5 Ws. See [Writing a case report](#reporting).`,
    },
  },
  report: {
    verdict: 'Verdict',
    choose: 'Choose…',
    tp: 'True positive',
    fp: 'False positive',
    who: 'Who: affected user account(s)',
    whoHint: 'e.g. j.doe',
    where: 'Where: attacker source IP',
    whereHint: 'e.g. 192.0.2.10',
    start: 'When: first malicious event (UTC)',
    end: 'When: last failed attempt / compromise (UTC)',
    timeHint: 'HH:MM:SS',
    assets: 'Internal systems reached after the login',
    assetsHint: 'IPs or hostnames, or "none"',
    summary: 'What happened and why (verdict reasoning, IOCs, actions taken)',
    summaryHint: 'Explain it so the L2 understands the case in one minute.',
    escalate: 'Escalate to',
    noEscalation: 'No escalation: close the alert',
    toL2: 'Lucas Sagás (L2 on shift)',
    toEngineer: 'Thuany Kamers (SOC Engineer)',
    toManager: 'Priya Nair (SOC Manager)',
  },
  grade: {
    assigned: { label: 'You assigned the alert to yourself before working on it.', tip: 'Always take ownership of an alert first, so nobody else duplicates the work.' },
    siem: { label: 'You searched the SIEM for the attacker IP.', tip: 'Start by searching the alert\'s source IP: src_ip=203.0.113.45.' },
    siemSuccess: { label: 'You checked whether any login succeeded.', tip: 'The key question in a brute force: did any attempt succeed? Try outcome=success or user=l.moreau.' },
    intel: { label: 'You checked the IP reputation in Threat Intel.', tip: 'Confirm an indicator\'s reputation before acting on it.' },
    block: { label: 'You blocked 203.0.113.45 on the firewall.', tip: 'The attacker IP was still allowed to reach the VPN.' },
    noWrongBlock: { label: 'You did not block any legitimate IP.', tip: 'Blocking user or internal addresses breaks the business and does not stop the attacker.' },
    lock: { label: 'You locked the compromised account l.moreau.', tip: 'The attacker logged in as l.moreau at 08:10:48. Locking the account ends that VPN session.' },
    noWrongLock: { label: 'You did not lock accounts without evidence.', tip: 'Only the account with a successful malicious login needed locking.' },
    verdict: { label: 'Verdict: true positive.', tip: 'Hundreds of failures from a malicious IP followed by a success is a real attack.' },
    escalate: { label: 'You escalated to the L2 on shift.', tip: 'A successful attacker login is a compromise: escalate to Lucas Sagás (L2), per the escalation matrix.' },
    who: { label: 'Who: the affected account is named.', tip: 'The report must name the compromised account (l.moreau / Lucas Moreau).' },
    where: { label: 'Where: the attacker IP is in the report.', tip: 'Include the source IP 203.0.113.45 as an IOC.' },
    when: { label: 'When: the time window is correct.', tip: 'The attack ran from 08:07:02 (first spray attempt) to the successful login at 08:10:48.' },
    assets: { label: 'You identified what the session reached.', tip: 'Following assigned_ip=10.8.0.23 shows access to fs-01 (10.10.5.20), finance share.' },
    why: { label: 'The summary explains the case.', tip: 'Write at least a few sentences: what happened, why it is malicious, what you already did.' },
  },
}
