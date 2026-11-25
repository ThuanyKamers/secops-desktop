export default {
  hub: {
    title: 'Mission 1 : Toc toc sur le VPN',
    summary: 'Une rafale de connexions VPN échouées a déclenché une alerte. Découvrez si l’attaquant est entré, contenez la menace et transmettez le dossier au N2.',
    skills: 'Tri des alertes · SIEM · Réputation d’IP · Confinement · Escalade · Rapport 5 W',
  },
  alerts: {
    a2041: {
      title: 'Multiples échecs de connexion VPN depuis une source unique',
      desc: 'Plus de 50 échecs d’authentification sur vpn-gw-01 depuis une seule IP en 5 minutes. Règle : AUTH-BF-003. Force brute ou password spraying possible. Suivez le runbook RB-AUTH-01.',
    },
    a2042: {
      title: 'Échec de la mise à jour des signatures antivirus',
      desc: 'L’agent EDR de PC-WH-005 n’a pas pu télécharger la mise à jour des signatures du jour (timeout). L’agent fonctionne normalement par ailleurs.',
    },
    a2038: {
      title: 'Connexion sortante vers un domaine récemment enregistré',
      desc: 'Le poste LPT-SAL-007 s’est connecté à un domaine enregistré il y a 2 jours.',
    },
    a2035: {
      title: 'Volume d’impression inhabituel',
      desc: '420 pages imprimées par un utilisateur en 10 minutes.',
    },
  },
  intel: {
    attacker: 'IP d’un hébergeur largement signalée pour des campagnes de force brute sur VPN et SSH au cours des 30 derniers jours.',
    homeIsp: 'Adresse haut débit résidentielle. Aucun signalement.',
  },
  wiki: {
    briefing: {
      title: 'Briefing de permanence : lundi, 08:15 UTC',
      body: `# Briefing de permanence

Bonjour, et bienvenue pour votre première permanence au SOC d’Orbitae Logistics. Vous êtes l’**analyste N1** de service.

Une nouvelle alerte de sévérité **élevée** vient d’arriver dans la file. Traitez-la selon nos procédures :

- Runbook pour ce type d’alerte : [RB-AUTH-01 : Force brute sur l’authentification](#rb-auth-01)
- Comment nous choisissons et traitons les alertes : [Tri des alertes](#triage)
- Comment chercher dans les logs : [Guide des requêtes SIEM](#siem-guide)
- Qui contacter : [Matrice d’escalade](#escalation)
- Ce que contient le rapport : [Rédiger un rapport d’incident](#reporting)

Votre équipe aujourd’hui : **Lucas Sagás** (N2 d’astreinte), **Thuany Kamers** (ingénieur SOC) et **Davi Amorim** (N1, sur une autre alerte). **Priya Nair** (responsable SOC) est en réunion toute la matinée.

Ouvrez le **Tableau de bord SOC** pour commencer.`,
    },
    runbook: {
      title: 'RB-AUTH-01 : Force brute sur l’authentification',
      body: `# RB-AUTH-01 : Force brute sur l’authentification

**S’applique à :** règles AUTH-BF-001 à AUTH-BF-005 (VPN, webmail, SSO).
**Objectif :** déterminer si une tentative de connexion a **réussi**, contenir la menace et rapporter.

## Étape 1 : Prendre l’alerte
Dans le **Tableau de bord SOC**, assignez-vous l’alerte et passez-la **En cours**.

## Étape 2 : Mesurer l’attaque dans le SIEM
Recherchez l’IP source de l’alerte :

\`src_ip=<IP de l’attaquant>\`

Notez :
- le premier et le dernier événement (fenêtre temporelle),
- les **identifiants** essayés,
- si **une tentative a \`outcome=success\`**.

> Quelques échecs suivis d’une réussite depuis l’IP habituelle de l’utilisateur, c’est normal (faute de frappe). Des centaines d’échecs depuis une IP inconnue, non.

## Étape 3 : Vérifier la réputation de la source
Vérifiez l’IP de l’attaquant dans **Threat Intel**. Un score de risque élevé et des étiquettes de force brute confirment que l’activité est malveillante.

## Étape 4 : Si une connexion a réussi, suivre la session
Une connexion VPN réussie reçoit une IP interne (\`assigned_ip\`). Recherchez-la dans le SIEM pour voir **ce que la session a touché** (serveurs de fichiers, RDP, etc.).
Vérifiez dans l’**Annuaire** si le vrai utilisateur a pu faire cette connexion (site, appareil, autres connexions au même moment).

## Étape 5 : Contenir
1. **Bloquez** l’IP de l’attaquant sur le **Pare-feu** du périmètre. Ne bloquez jamais d’IP internes ou d’utilisateurs légitimes.
2. Si un compte a été compromis, **verrouillez-le** dans l’**Annuaire**. Cela met fin à sa session VPN.
3. Ne verrouillez que les comptes pour lesquels vous avez des preuves.

## Étape 6 : Rapporter et escalader
- Verdict : vrai positif si l’activité est malveillante.
- Une connexion **réussie** d’un attaquant est une compromission : **escaladez au N2 d’astreinte**. Le compte doit être réinitialisé et les données consultées doivent être examinées.
- Si toutes les tentatives ont échoué et que l’IP est bloquée, fermez sans escalade.

Remplissez le rapport d’incident avec les 5 W. Voir [Rédiger un rapport d’incident](#reporting).`,
    },
  },
  report: {
    verdict: 'Verdict',
    choose: 'Choisir…',
    tp: 'Vrai positif',
    fp: 'Faux positif',
    who: 'Qui : compte(s) utilisateur concerné(s)',
    whoHint: 'ex. j.doe',
    where: 'Où : IP source de l’attaquant',
    whereHint: 'ex. 192.0.2.10',
    start: 'Quand : premier événement malveillant (UTC)',
    end: 'Quand : dernière tentative / compromission (UTC)',
    timeHint: 'HH:MM:SS',
    assets: 'Systèmes internes atteints après la connexion',
    assetsHint: 'IP ou noms d’hôte, ou « aucun »',
    summary: 'Ce qui s’est passé et pourquoi (raisonnement, IOC, actions menées)',
    summaryHint: 'Expliquez-le pour que le N2 comprenne le dossier en une minute.',
    escalate: 'Escalader à',
    noEscalation: 'Pas d’escalade : fermer l’alerte',
    toL2: 'Lucas Sagás (N2 d’astreinte)',
    toEngineer: 'Thuany Kamers (ingénieur SOC)',
    toManager: 'Priya Nair (responsable SOC)',
  },
  grade: {
    assigned: { label: 'Vous vous êtes assigné l’alerte avant de la traiter.', tip: 'Prenez toujours l’alerte en premier, pour que personne ne fasse le travail en double.' },
    siem: { label: 'Vous avez cherché l’IP de l’attaquant dans le SIEM.', tip: 'Commencez par l’IP source de l’alerte : src_ip=203.0.113.45.' },
    siemSuccess: { label: 'Vous avez vérifié si une connexion a réussi.', tip: 'La question clé d’une force brute : une tentative a-t-elle réussi ? Essayez outcome=success ou user=l.moreau.' },
    intel: { label: 'Vous avez vérifié la réputation de l’IP dans Threat Intel.', tip: 'Confirmez la réputation d’un indicateur avant d’agir.' },
    block: { label: 'Vous avez bloqué 203.0.113.45 sur le pare-feu.', tip: 'L’IP de l’attaquant pouvait encore atteindre le VPN.' },
    noWrongBlock: { label: 'Vous n’avez bloqué aucune IP légitime.', tip: 'Bloquer des adresses internes ou d’utilisateurs gêne l’activité et n’arrête pas l’attaquant.' },
    lock: { label: 'Vous avez verrouillé le compte compromis l.moreau.', tip: 'L’attaquant s’est connecté en tant que l.moreau à 08:10:48. Verrouiller le compte met fin à cette session VPN.' },
    noWrongLock: { label: 'Vous n’avez pas verrouillé de comptes sans preuve.', tip: 'Seul le compte avec une connexion malveillante réussie devait être verrouillé.' },
    verdict: { label: 'Verdict : vrai positif.', tip: 'Des centaines d’échecs depuis une IP malveillante suivis d’une réussite, c’est une vraie attaque.' },
    escalate: { label: 'Vous avez escaladé au N2 d’astreinte.', tip: 'Une connexion réussie de l’attaquant est une compromission : escaladez à Lucas Sagás (N2), selon la matrice d’escalade.' },
    who: { label: 'Qui : le compte concerné est nommé.', tip: 'Le rapport doit nommer le compte compromis (l.moreau / Lucas Moreau).' },
    where: { label: 'Où : l’IP de l’attaquant figure dans le rapport.', tip: 'Ajoutez l’IP source 203.0.113.45 comme IOC.' },
    when: { label: 'Quand : la fenêtre temporelle est correcte.', tip: 'L’attaque a duré de 08:07:02 (première tentative de spraying) à la connexion réussie de 08:10:48.' },
    assets: { label: 'Vous avez identifié ce que la session a atteint.', tip: 'En suivant assigned_ip=10.8.0.23, on voit l’accès à fs-01 (10.10.5.20), partage de la comptabilité.' },
    why: { label: 'Le résumé explique le dossier.', tip: 'Écrivez au moins quelques phrases : ce qui s’est passé, pourquoi c’est malveillant, ce que vous avez déjà fait.' },
  },
}
