export default {
  hub: {
    title: 'Mission 1: Klopf, klopf am VPN',
    summary: 'Eine Welle fehlgeschlagener VPN-Anmeldungen hat einen Alarm ausgelöst. Finde heraus, ob der Angreifer reingekommen ist, dämme die Bedrohung ein und übergib den Fall an L2.',
    skills: 'Alarm-Triage · SIEM · IP-Reputation · Eindämmung · Eskalation · 5-W-Bericht',
  },
  alerts: {
    a2041: {
      title: 'Mehrere fehlgeschlagene VPN-Anmeldungen von einer Quelle',
      desc: 'Mehr als 50 fehlgeschlagene Authentifizierungsversuche gegen vpn-gw-01 von einer einzigen IP innerhalb von 5 Minuten. Regel: AUTH-BF-003. Möglicher Brute-Force- oder Password-Spraying-Angriff. Folge Runbook RB-AUTH-01.',
    },
    a2042: {
      title: 'Aktualisierung der Antivirus-Signaturen fehlgeschlagen',
      desc: 'Der EDR-Agent auf PC-WH-005 konnte das heutige Signatur-Update nicht herunterladen (Timeout). Ansonsten ist der Agent in Ordnung.',
    },
    a2038: {
      title: 'Ausgehende Verbindung zu neu registrierter Domain',
      desc: 'Arbeitsplatz LPT-SAL-007 hat sich mit einer vor 2 Tagen registrierten Domain verbunden.',
    },
    a2035: {
      title: 'Ungewöhnliches Druckvolumen',
      desc: '420 Seiten von einem Benutzer in 10 Minuten gedruckt.',
    },
  },
  intel: {
    attacker: 'IP eines Hosting-Anbieters, in den letzten 30 Tagen vielfach für Brute-Force-Kampagnen gegen VPN und SSH gemeldet.',
    homeIsp: 'Private Breitband-Adresse. Keine Meldungen.',
  },
  wiki: {
    briefing: {
      title: 'Schicht-Briefing: Montag, 08:15 UTC',
      body: `# Schicht-Briefing

Guten Morgen und willkommen zu deiner ersten Schicht im SOC von Orbitae Logistics. Du bist heute der/die **L1-Analyst:in** im Dienst.

Gerade ist ein neuer Alarm mit Schweregrad **hoch** in der Warteschlange gelandet. Bearbeite ihn nach unseren Verfahren:

- Runbook für diesen Alarmtyp: [RB-AUTH-01: Brute-Force bei der Authentifizierung](#rb-auth-01)
- Wie wir Alarme auswählen und bearbeiten: [Alarm-Triage](#triage)
- Wie man Logs durchsucht: [SIEM-Abfrage-Leitfaden](#siem-guide)
- Wen man kontaktiert: [Eskalationsmatrix](#escalation)
- Was in den Bericht gehört: [Einen Fallbericht schreiben](#reporting)

Dein Team heute: **Lucas Sagás** (L2 im Dienst), **Thuany Kamers** (SOC Engineer) und **Davi Amorim** (L1, arbeitet an einem anderen Alarm). **Priya Nair** (SOC-Managerin) ist den ganzen Vormittag in Meetings.

Öffne das **SOC-Dashboard**, um zu beginnen.`,
    },
    runbook: {
      title: 'RB-AUTH-01: Brute-Force bei der Authentifizierung',
      body: `# RB-AUTH-01: Brute-Force bei der Authentifizierung

**Gilt für:** Regeln AUTH-BF-001 bis AUTH-BF-005 (VPN, Webmail, SSO).
**Ziel:** herausfinden, ob ein Anmeldeversuch **erfolgreich** war, die Bedrohung eindämmen und berichten.

## Schritt 1: Alarm übernehmen
Weise dir im **SOC-Dashboard** den Alarm zu und setze ihn auf **In Bearbeitung**.

## Schritt 2: Umfang im SIEM bestimmen
Suche nach der Quell-IP aus dem Alarm:

\`src_ip=<IP des Angreifers>\`

Notiere:
- erstes und letztes Ereignis (Zeitfenster),
- welche **Benutzernamen** versucht wurden,
- ob **ein Versuch \`outcome=success\` hat**.

> Ein paar Fehlversuche und dann ein Erfolg von der üblichen IP des Benutzers ist normal (Tippfehler). Hunderte Fehlversuche von einer unbekannten IP nicht.

## Schritt 3: Reputation der Quelle prüfen
Prüfe die IP des Angreifers in **Threat Intel**. Ein hoher Risikowert und Brute-Force-Tags bestätigen, dass die Aktivität bösartig ist.

## Schritt 4: Bei erfolgreicher Anmeldung der Sitzung folgen
Eine erfolgreiche VPN-Anmeldung erhält eine interne IP (\`assigned_ip\`). Suche sie im SIEM, um zu sehen, **worauf die Sitzung zugegriffen hat** (Dateiserver, RDP usw.).
Prüfe im **Verzeichnis**, ob der echte Benutzer diese Anmeldung gemacht haben kann (Standort, Gerät, andere Anmeldungen zur gleichen Zeit).

## Schritt 5: Eindämmen
1. **Sperre** die IP des Angreifers an der Perimeter-**Firewall**. Sperre niemals interne oder legitime Benutzer-IPs.
2. Wurde ein Konto kompromittiert, **sperre es** im **Verzeichnis**. Das beendet seine VPN-Sitzung.
3. Sperre nur Konten, für die du Belege hast.

## Schritt 6: Berichten und eskalieren
- Urteil: True Positive, wenn die Aktivität bösartig ist.
- Eine **erfolgreiche** Anmeldung eines Angreifers ist eine Kompromittierung: **eskaliere an den L2 im Dienst**. Das Konto braucht einen Passwort-Reset und die abgerufenen Daten müssen geprüft werden.
- Sind alle Versuche gescheitert und ist die IP gesperrt, schließe ohne Eskalation.

Fülle den Fallbericht mit den 5 W aus. Siehe [Einen Fallbericht schreiben](#reporting).`,
    },
  },
  report: {
    verdict: 'Urteil',
    choose: 'Auswählen…',
    tp: 'True Positive',
    fp: 'False Positive',
    who: 'Wer: betroffene(s) Benutzerkonto/-konten',
    whoHint: 'z. B. j.doe',
    where: 'Wo: Quell-IP des Angreifers',
    whereHint: 'z. B. 192.0.2.10',
    start: 'Wann: erstes bösartiges Ereignis (UTC)',
    end: 'Wann: letzter Fehlversuch / Kompromittierung (UTC)',
    timeHint: 'HH:MM:SS',
    assets: 'Nach der Anmeldung erreichte interne Systeme',
    assetsHint: 'IPs oder Hostnamen, oder „keine“',
    summary: 'Was ist passiert und warum (Begründung, IOCs, ergriffene Maßnahmen)',
    summaryHint: 'Erkläre es so, dass der L2 den Fall in einer Minute versteht.',
    escalate: 'Eskalieren an',
    noEscalation: 'Keine Eskalation: Alarm schließen',
    toL2: 'Lucas Sagás (L2 im Dienst)',
    toEngineer: 'Thuany Kamers (SOC Engineer)',
    toManager: 'Priya Nair (SOC-Managerin)',
  },
  grade: {
    assigned: { label: 'Du hast dir den Alarm vor der Bearbeitung zugewiesen.', tip: 'Übernimm einen Alarm immer zuerst, damit niemand doppelt arbeitet.' },
    siem: { label: 'Du hast im SIEM nach der IP des Angreifers gesucht.', tip: 'Beginne mit der Quell-IP aus dem Alarm: src_ip=203.0.113.45.' },
    siemSuccess: { label: 'Du hast geprüft, ob eine Anmeldung erfolgreich war.', tip: 'Die Kernfrage bei Brute-Force: War ein Versuch erfolgreich? Versuche outcome=success oder user=l.moreau.' },
    intel: { label: 'Du hast die IP-Reputation in Threat Intel geprüft.', tip: 'Bestätige die Reputation eines Indikators, bevor du handelst.' },
    block: { label: 'Du hast 203.0.113.45 an der Firewall gesperrt.', tip: 'Die IP des Angreifers konnte das VPN weiterhin erreichen.' },
    noWrongBlock: { label: 'Du hast keine legitime IP gesperrt.', tip: 'Das Sperren von Benutzer- oder internen Adressen stört den Betrieb und stoppt den Angreifer nicht.' },
    lock: { label: 'Du hast das kompromittierte Konto l.moreau gesperrt.', tip: 'Der Angreifer hat sich um 08:10:48 als l.moreau angemeldet. Das Sperren des Kontos beendet diese VPN-Sitzung.' },
    noWrongLock: { label: 'Du hast keine Konten ohne Belege gesperrt.', tip: 'Nur das Konto mit der erfolgreichen bösartigen Anmeldung musste gesperrt werden.' },
    verdict: { label: 'Urteil: True Positive.', tip: 'Hunderte Fehlversuche von einer bösartigen IP und dann ein Erfolg sind ein echter Angriff.' },
    escalate: { label: 'Du hast an den L2 im Dienst eskaliert.', tip: 'Eine erfolgreiche Anmeldung des Angreifers ist eine Kompromittierung: eskaliere laut Eskalationsmatrix an Lucas Sagás (L2).' },
    who: { label: 'Wer: Das betroffene Konto ist genannt.', tip: 'Der Bericht muss das kompromittierte Konto nennen (l.moreau / Lucas Moreau).' },
    where: { label: 'Wo: Die IP des Angreifers steht im Bericht.', tip: 'Nimm die Quell-IP 203.0.113.45 als IOC auf.' },
    when: { label: 'Wann: Das Zeitfenster stimmt.', tip: 'Der Angriff lief von 08:07:02 (erster Spraying-Versuch) bis zur erfolgreichen Anmeldung um 08:10:48.' },
    assets: { label: 'Du hast erkannt, worauf die Sitzung zugegriffen hat.', tip: 'Folgt man assigned_ip=10.8.0.23, sieht man den Zugriff auf fs-01 (10.10.5.20), Freigabe der Finanzabteilung.' },
    why: { label: 'Die Zusammenfassung erklärt den Fall.', tip: 'Schreibe mindestens ein paar Sätze: was passiert ist, warum es bösartig ist und was du bereits getan hast.' },
  },
}
