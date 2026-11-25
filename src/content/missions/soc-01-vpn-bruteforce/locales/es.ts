export default {
  hub: {
    title: 'Misión 1: Toc, toc en la VPN',
    summary: 'Una ráfaga de inicios de sesión VPN fallidos ha disparado una alerta. Averigua si el atacante entró, contén la amenaza y pasa el caso al N2.',
    skills: 'Clasificación de alertas · SIEM · Reputación de IP · Contención · Escalado · Informe 5 W',
  },
  alerts: {
    a2041: {
      title: 'Múltiples inicios de sesión VPN fallidos desde un único origen',
      desc: 'Más de 50 intentos de autenticación fallidos contra vpn-gw-01 desde una sola IP en 5 minutos. Regla: AUTH-BF-003. Posible fuerza bruta o password spraying. Sigue el runbook RB-AUTH-01.',
    },
    a2042: {
      title: 'Falló la actualización de firmas del antivirus',
      desc: 'El agente EDR del PC-WH-005 no pudo descargar la actualización de firmas de hoy (timeout). Por lo demás, el agente está en buen estado.',
    },
    a2038: {
      title: 'Conexión saliente a un dominio recién registrado',
      desc: 'La estación LPT-SAL-007 se conectó a un dominio registrado hace 2 días.',
    },
    a2035: {
      title: 'Volumen de impresión inusual',
      desc: '420 páginas impresas por un usuario en 10 minutos.',
    },
  },
  intel: {
    attacker: 'IP de un proveedor de hosting ampliamente denunciada por campañas de fuerza bruta contra VPN y SSH en los últimos 30 días.',
    homeIsp: 'Dirección de banda ancha residencial. Sin denuncias.',
  },
  wiki: {
    briefing: {
      title: 'Briefing del turno: lunes, 08:15 UTC',
      body: `# Briefing del turno

Buenos días, y bienvenido/a a tu primer turno en el SOC de Orbitae Logistics. Eres el/la **analista N1** de guardia.

Acaba de llegar a la cola una nueva alerta de severidad **alta**. Trátala siguiendo nuestros procedimientos:

- Runbook para este tipo de alerta: [RB-AUTH-01: Fuerza bruta en autenticación](#rb-auth-01)
- Cómo elegimos y tratamos las alertas: [Clasificación de alertas](#triage)
- Cómo buscar en los logs: [Guía de consultas del SIEM](#siem-guide)
- A quién llamar: [Matriz de escalado](#escalation)
- Qué va en el informe: [Cómo redactar un informe](#reporting)

Tu equipo hoy: **Mara Lindqvist** (N2 de guardia), **Kenji Watanabe** (Ingeniero SOC) y **Ana Silva** (N1, trabajando en otra alerta). **Priya Nair** (Responsable del SOC) está en reuniones toda la mañana.

Abre el **Panel del SOC** para empezar.`,
    },
    runbook: {
      title: 'RB-AUTH-01: Fuerza bruta en autenticación',
      body: `# RB-AUTH-01: Fuerza bruta en autenticación

**Se aplica a:** reglas AUTH-BF-001 a AUTH-BF-005 (VPN, webmail, SSO).
**Objetivo:** averiguar si algún intento de inicio de sesión **tuvo éxito**, contener la amenaza e informar.

## Paso 1: Hazte cargo de la alerta
En el **Panel del SOC**, asígnate la alerta y márcala **En curso**.

## Paso 2: Dimensiona el ataque en el SIEM
Busca la IP de origen de la alerta:

\`src_ip=<IP del atacante>\`

Anota:
- el primer y el último evento (ventana de tiempo),
- qué **usuarios** se probaron,
- si **algún intento tiene \`outcome=success\`**.

> Unos pocos fallos seguidos de un éxito desde la IP habitual del usuario es normal (una errata). Cientos de fallos desde una IP desconocida, no.

## Paso 3: Comprueba la reputación del origen
Consulta la IP del atacante en **Threat Intel**. Una puntuación de riesgo alta y etiquetas de fuerza bruta confirman que la actividad es maliciosa.

## Paso 4: Si un inicio de sesión tuvo éxito, sigue la sesión
Un inicio de sesión VPN correcto recibe una IP interna (\`assigned_ip\`). Búscala en el SIEM para ver **a qué accedió la sesión** (servidores de ficheros, RDP, etc.).
Comprueba en el **Directorio** si el usuario real pudo hacer ese inicio de sesión (ubicación, dispositivo, otros accesos a esa hora).

## Paso 5: Contén
1. **Bloquea** la IP del atacante en el **Firewall** del perímetro. Nunca bloquees IPs internas o de usuarios legítimos.
2. Si una cuenta quedó comprometida, **bloquéala** en el **Directorio**. Esto cierra su sesión VPN.
3. Bloquea solo cuentas de las que tengas evidencia.

## Paso 6: Informa y escala
- Veredicto: verdadero positivo si la actividad es maliciosa.
- Un inicio de sesión **correcto** de un atacante es un compromiso: **escala al N2 de guardia**. La cuenta necesita un cambio de contraseña y hay que revisar los datos accedidos.
- Si todos los intentos fallaron y la IP está bloqueada, cierra sin escalar.

Rellena el informe del caso con las 5 W. Ver [Cómo redactar un informe](#reporting).`,
    },
  },
  report: {
    verdict: 'Veredicto',
    choose: 'Elige…',
    tp: 'Verdadero positivo',
    fp: 'Falso positivo',
    who: 'Quién: cuenta(s) de usuario afectada(s)',
    whoHint: 'p. ej. j.doe',
    where: 'Dónde: IP de origen del atacante',
    whereHint: 'p. ej. 192.0.2.10',
    start: 'Cuándo: primer evento malicioso (UTC)',
    end: 'Cuándo: último intento / compromiso (UTC)',
    timeHint: 'HH:MM:SS',
    assets: 'Sistemas internos alcanzados tras el inicio de sesión',
    assetsHint: 'IPs o nombres de host, o "ninguno"',
    summary: 'Qué pasó y por qué (razonamiento del veredicto, IOCs, acciones tomadas)',
    summaryHint: 'Explícalo para que el N2 entienda el caso en un minuto.',
    escalate: 'Escalar a',
    noEscalation: 'Sin escalado: cerrar la alerta',
    toL2: 'Mara Lindqvist (N2 de guardia)',
    toEngineer: 'Kenji Watanabe (Ingeniero SOC)',
    toManager: 'Priya Nair (Responsable del SOC)',
  },
  grade: {
    assigned: { label: 'Te asignaste la alerta antes de trabajar en ella.', tip: 'Hazte siempre cargo de la alerta primero, para que nadie duplique el trabajo.' },
    siem: { label: 'Buscaste la IP del atacante en el SIEM.', tip: 'Empieza buscando la IP de origen de la alerta: src_ip=203.0.113.45.' },
    siemSuccess: { label: 'Comprobaste si algún inicio de sesión tuvo éxito.', tip: 'La pregunta clave en una fuerza bruta: ¿tuvo éxito algún intento? Prueba outcome=success o user=l.moreau.' },
    intel: { label: 'Comprobaste la reputación de la IP en Threat Intel.', tip: 'Confirma la reputación de un indicador antes de actuar.' },
    block: { label: 'Bloqueaste 203.0.113.45 en el firewall.', tip: 'La IP del atacante todavía podía llegar a la VPN.' },
    noWrongBlock: { label: 'No bloqueaste ninguna IP legítima.', tip: 'Bloquear direcciones internas o de usuarios perjudica al negocio y no detiene al atacante.' },
    lock: { label: 'Bloqueaste la cuenta comprometida l.moreau.', tip: 'El atacante entró como l.moreau a las 08:10:48. Bloquear la cuenta cierra esa sesión VPN.' },
    noWrongLock: { label: 'No bloqueaste cuentas sin evidencia.', tip: 'Solo había que bloquear la cuenta con un inicio de sesión malicioso correcto.' },
    verdict: { label: 'Veredicto: verdadero positivo.', tip: 'Cientos de fallos desde una IP maliciosa seguidos de un éxito es un ataque real.' },
    escalate: { label: 'Escalaste al N2 de guardia.', tip: 'Un inicio de sesión correcto del atacante es un compromiso: escala a Mara Lindqvist (N2), según la matriz de escalado.' },
    who: { label: 'Quién: la cuenta afectada aparece en el informe.', tip: 'El informe debe nombrar la cuenta comprometida (l.moreau / Lucas Moreau).' },
    where: { label: 'Dónde: la IP del atacante está en el informe.', tip: 'Incluye la IP de origen 203.0.113.45 como IOC.' },
    when: { label: 'Cuándo: la ventana de tiempo es correcta.', tip: 'El ataque fue de 08:07:02 (primer intento de spraying) al inicio de sesión correcto a las 08:10:48.' },
    assets: { label: 'Identificaste a qué accedió la sesión.', tip: 'Siguiendo assigned_ip=10.8.0.23 se ve el acceso a fs-01 (10.10.5.20), recurso compartido de finanzas.' },
    why: { label: 'El resumen explica el caso.', tip: 'Escribe al menos unas frases: qué pasó, por qué es malicioso, qué has hecho ya.' },
  },
}
