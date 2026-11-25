export const ui = {
  boot: {
    title: 'SecOps Desktop',
    subtitle: 'Un juego práctico de formación en ciberseguridad. Realiza tareas de seguridad reales en una estación de trabajo simulada, guiado por el mismo tipo de documentación que usan los equipos en su día a día.',
    chooseOs: 'Elige tu estación de trabajo',
    language: 'Idioma',
    start: 'Encender',
    footer: 'Proyecto de portafolio de Thuany Kamers',
    os: { windows: 'Windows', macos: 'macOS', linux: 'Linux' },
  },
  login: {
    user: 'Analista de Seguridad',
    password: 'Contraseña',
    signIn: 'Iniciar sesión',
    hint: 'Estación de formación: no hace falta contraseña.',
    back: 'Cambiar de estación',
  },
  apps: {
    missions: 'Centro de Formación',
    wiki: 'Wiki',
    soc: 'Panel del SOC',
    siem: 'SIEM',
    intel: 'Threat Intel',
    firewall: 'Firewall',
    directory: 'Directorio',
  },
  window: { close: 'Cerrar', minimize: 'Minimizar', maximize: 'Maximizar' },
  taskbar: { start: 'Inicio', logout: 'Cerrar sesión', language: 'Idioma' },
  tracks: {
    soc: { name: 'Operaciones de Seguridad (SOC)', desc: 'Clasifica alertas, investiga en el SIEM, contén amenazas e informa.' },
    pentest: { name: 'Pruebas de Penetración', desc: 'Encuentra y explota debilidades antes que los atacantes.' },
    forensics: { name: 'Análisis Forense Digital', desc: 'Recupera evidencias de discos, memoria y logs.' },
    cloud: { name: 'Seguridad en la Nube', desc: 'Protege identidades, almacenamiento y cargas de trabajo en la nube.' },
    grc: { name: 'Gobierno, Riesgo y Cumplimiento', desc: 'Políticas, auditorías y evaluaciones de riesgo.' },
  },
  hub: {
    title: 'Centro de Formación',
    intro: 'Bienvenido/a a Orbitae Logistics. Elige una misión. Cada una llega como el trabajo real: un ticket, un runbook en la Wiki y las herramientas de tu escritorio.',
    comingSoon: 'Próximamente',
    start: 'Iniciar misión',
    restart: 'Reiniciar',
    resume: 'Continuar',
    abandon: 'Abandonar misión',
    difficulty: 'Dificultad',
    best: 'Mejor puntuación: {{score}}%',
    active: 'Misión activa',
    openBriefing: 'Abrir briefing',
    confirmRestart: 'Reiniciar borra el progreso de esta misión. Haz clic otra vez para confirmar.',
  },
  noMission: 'No hay ninguna misión activa. Empieza una en el Centro de Formación.',
  roles: { l1: 'Analista SOC N1', l2: 'Analista SOC N2 (de guardia)', engineer: 'Ingeniero SOC', manager: 'Responsable del SOC', you: 'Tú (N1)' },
  presence: { online: 'conectado', offline: 'desconectado' },
  severity: { critical: 'Crítica', high: 'Alta', medium: 'Media', low: 'Baja' },
  status: { new: 'Nueva', in_progress: 'En curso', closed: 'Cerrada' },
  verdict: { true_positive: 'Verdadero positivo', false_positive: 'Falso positivo' },
  soc: {
    queue: 'Cola de alertas',
    filters: { all: 'Todas', new: 'Nuevas', mine: 'Asignadas a mí', open: 'Abiertas' },
    cols: { id: 'ID', title: 'Alerta', severity: 'Severidad', status: 'Estado', assignee: 'Responsable', time: 'Hora (UTC)' },
    unassigned: 'Sin asignar',
    you: 'Tú',
    select: 'Selecciona una alerta para ver sus detalles.',
    source: 'Origen',
    verdict: 'Veredicto',
    description: 'Descripción',
    assignToMe: 'Asignármela',
    startWork: 'Marcar En curso',
    writeReport: 'Redactar informe y cerrar',
    notMine: 'Asígnate la alerta para trabajar en ella.',
    team: 'Equipo de guardia',
    reportTitle: 'Informe del caso: {{id}}',
    submit: 'Enviar informe y cerrar alerta',
    cancel: 'Cancelar',
    missingVerdict: 'Elige un veredicto antes de enviar.',
    escalatedTo: 'Escalada a {{name}}',
    closedBy: 'Cerrada con veredicto: {{verdict}}',
  },
  siem: {
    placeholder: 'Busca, p. ej. src_ip=203.0.113.45 AND outcome=failure',
    search: 'Buscar',
    from: 'Desde',
    to: 'Hasta',
    results_one: '{{count}} evento',
    results_other: '{{count}} eventos',
    fields: 'Valores más frecuentes',
    noResults: 'Ningún evento coincide con esta búsqueda.',
    error: 'Error en la consulta: {{msg}}',
    help: 'Guía de consultas',
    clear: 'Limpiar',
    pickField: 'Haz clic en un valor para añadirlo a la búsqueda.',
    examples: 'Escribe una consulta y pulsa Buscar. Algunos ejemplos:',
  },
  intel: {
    placeholder: 'Dirección IP, dominio, URL o hash',
    lookup: 'Consultar',
    score: 'Puntuación de riesgo',
    malicious: 'Malicioso',
    suspicious: 'Sospechoso',
    clean: 'Sin actividad maliciosa conocida',
    tags: 'Etiquetas',
    reports: 'Denuncias de la comunidad',
    asn: 'Red (ASN)',
    country: 'País',
    firstSeen: 'Visto por primera vez',
    notFound: 'No hay registros de inteligencia para "{{q}}".',
    intro: 'Comprueba la reputación de un indicador antes de actuar.',
  },
  firewall: {
    title: 'Lista de bloqueo del perímetro (fw-core-01)',
    intro: 'El tráfico entrante y saliente de estas direcciones se descarta en el perímetro.',
    placeholder: 'Dirección IPv4 a bloquear',
    block: 'Bloquear',
    unblock: 'Desbloquear',
    invalid: 'Introduce una dirección IPv4 válida.',
    internal: 'Es una dirección interna (privada). Bloquearla en el perímetro no sirve de nada y puede ocultar el problema.',
    empty: 'No hay direcciones bloqueadas.',
    since: 'Añadida',
    preexisting: 'regla existente',
    now: 'ahora mismo',
  },
  directory: {
    search: 'Buscar personas',
    cols: { name: 'Nombre', user: 'Usuario', dept: 'Departamento', location: 'Ubicación', device: 'Dispositivo', status: 'Cuenta' },
    lock: 'Bloquear cuenta',
    unlock: 'Desbloquear',
    locked: 'Bloqueada',
    active: 'Activa',
    details: 'Detalles',
    email: 'Correo',
    title: 'Puesto',
    lockNote: 'Bloquear cierra todas las sesiones del usuario (VPN incluida) e impide nuevos inicios de sesión hasta que TI restablezca la contraseña.',
  },
  result: {
    title: 'Revisión del turno',
    score: 'Puntuación: {{score}} / {{max}} ({{pct}}%)',
    great: 'Excelente trabajo. Este es el informe que un N2 quiere recibir.',
    good: 'Buen trabajo. Revisa los puntos de abajo para completarlo.',
    low: 'Faltaron algunos pasos clave. Vuelve a leer el runbook e inténtalo de nuevo.',
    back: 'Volver al Centro de Formación',
    retry: 'Repetir misión',
    done: 'Hecho',
    missed: 'Faltó',
  },
  wikiNav: 'Páginas',
}

export const wiki = {
  triage: {
    title: 'Manual del SOC: clasificación de alertas',
    body: `# Clasificación de alertas

Cada alerta sigue el mismo ciclo: **elegir → entender → investigar → decidir → informar**.

## 1. Elige la alerta correcta
1. Toma solo alertas **Nuevas** y sin asignar. Nunca trabajes en una alerta que ya tiene un compañero.
2. Ordena por **severidad**: crítica, luego alta, media y baja.
3. Con la misma severidad, toma primero la **más antigua**. Una intrusión más antigua ha tenido más tiempo para causar daño.

## 2. Hazte cargo
Asígnate la alerta y márcala **En curso**, para que el equipo sepa que alguien la está tratando.

## 3. Investiga
Lee la descripción y confirma los hechos en el **SIEM**. Comprueba los indicadores (IPs, dominios, hashes) en **Threat Intel**. Busca personas y dispositivos en el **Directorio**.

## 4. Decide
- **Verdadero positivo**: la actividad es maliciosa o viola una política.
- **Falso positivo**: la actividad es legítima. Explica *por qué*.

La severidad marca el orden de trabajo, no el veredicto.

## 5. Informa y cierra
Redacta el informe del caso (ver *Cómo redactar un informe*) y cierra la alerta, o escálala.`,
  },
  siem: {
    title: 'Guía de consultas del SIEM',
    body: `# Guía de consultas del SIEM

El SIEM recoge logs del gateway VPN, firewall, proxy, controlador de dominio, servidores de ficheros y pasarela de correo.

## Sintaxis
| Ejemplo | Significado |
|---|---|
| \`src_ip=203.0.113.45\` | campo igual a valor |
| \`user=l.*\` | \`*\` es comodín |
| \`source=vpn outcome=failure\` | varios términos = AND |
| \`user=admin OR user=root\` | uno u otro |
| \`NOT outcome=success\` | excluir |
| \`dst_port>1024\` | comparación numérica (\`> < >= <=\`) |
| \`"payroll"\` | texto libre en cualquier campo |

## Campos habituales
- \`source\`: vpn, firewall, proxy, auth, fileserver, email
- \`user\`, \`src_ip\`, \`dst_ip\`, \`dst_port\`
- \`outcome\` (success / failure), \`action\` (allowed / denied)
- \`assigned_ip\`: IP interna que la VPN asigna a una sesión

## Consejos
- Empieza amplio (una IP) y luego acota.
- Comprueba siempre qué pasó **después** del evento de la alerta. ¿Algún inicio de sesión tuvo éxito? ¿A dónde fue esa sesión?
- Haz clic en un valor de **Valores más frecuentes** para añadirlo a la búsqueda.`,
  },
  escalation: {
    title: 'Matriz de escalado',
    body: `# Matriz de escalado

Escala al **N2 de guardia** cuando se cumpla cualquiera de estos puntos:
1. La alerta indica una intrusión real que requiere una investigación más profunda.
2. Hace falta remediar más allá de la contención del N1 (cambio de contraseña, aislar un equipo, eliminar malware).
3. Hay que avisar a alguien fuera del SOC (dirección, clientes, legal).
4. No entiendes del todo la alerta. Preguntar siempre es mejor que adivinar.

**No** escales un verdadero positivo que un control detuvo por completo (por ejemplo, una conexión bloqueada por el firewall) y que no necesita nada más. Documéntalo y ciérralo.

## Cadena de contacto
| Orden | Quién | Cuándo |
|---|---|---|
| 1 | N2 de guardia | siempre primero |
| 2 | N3 / Respuesta a Incidentes | N2 sin responder 30 min en una alerta crítica |
| 3 | Ingeniero SOC | problemas de herramientas: faltan logs, SIEM caído |
| 4 | Responsable del SOC | después de los anteriores, o por temas de personal |

Para escalar en el Panel del SOC, elige a la persona en el campo **Escalar a** del informe del caso.`,
  },
  reporting: {
    title: 'Cómo redactar un informe',
    body: `# Cómo redactar un informe

Los logs en bruto se borran a los pocos meses, pero las alertas se conservan. **El informe es el registro permanente**, y es lo primero que lee el siguiente analista.

Responde a las cinco W:
- **Who (quién)**: usuarios y equipos implicados.
- **What (qué)**: qué ocurrió, paso a paso.
- **When (cuándo)**: hora de inicio y fin (usa las marcas de tiempo de los logs, UTC).
- **Where (dónde)**: origen y destino (IPs, hosts, URLs).
- **Why (por qué)**: el razonamiento detrás de tu veredicto. La parte más importante.

Incluye también los **indicadores de compromiso (IOCs)**: IPs, dominios, hashes, cuentas, y las **acciones ya tomadas** (bloqueado, cuenta bloqueada...).

Escríbelo para que alguien que no ha visto la alerta lo entienda en un minuto.`,
  },
}
