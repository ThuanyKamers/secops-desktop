export const ui = {
  boot: {
    title: 'SecOps Desktop',
    subtitle: 'Um jogo prático de treinamento em cibersegurança. Faça tarefas reais de segurança numa estação de trabalho simulada, guiada pelo mesmo tipo de documentação que os times usam no dia a dia.',
    chooseOs: 'Escolha sua estação de trabalho',
    language: 'Idioma',
    start: 'Ligar',
    footer: 'Projeto de portfólio de Thuany Kamers',
    os: { windows: 'Windows', macos: 'macOS', linux: 'Linux' },
  },
  login: {
    user: 'Analista de Segurança',
    signIn: 'Entrar',
    back: 'Trocar de estação',
    or: "ou",
    guest: "Continuar como convidado(a)",
    guestHint: "O progresso como convidado fica só neste navegador e não entra no ranking.",
    switchAccount: "Usar outra conta",
  },
  apps: {
    missions: 'Central de Treinamento',
    wiki: 'Wiki',
    soc: 'Painel do SOC',
    siem: 'SIEM',
    intel: 'Threat Intel',
    firewall: 'Firewall',
    directory: 'Diretório',
    profile: "Perfil",
    notes: 'Bloco de notas',
  },
  window: { close: 'Fechar', minimize: 'Minimizar', maximize: 'Maximizar' },
  taskbar: { start: 'Iniciar', logout: 'Sair', language: 'Idioma' },
  tracks: {
    soc: { name: 'Operações de Segurança (SOC)', desc: 'Faça a triagem de alertas, investigue no SIEM, contenha ameaças e reporte.' },
    pentest: { name: 'Teste de Invasão', desc: 'Encontre e explore falhas antes dos atacantes.' },
    forensics: { name: 'Forense Digital', desc: 'Recupere evidências de discos, memória e logs.' },
    cloud: { name: 'Segurança em Nuvem', desc: 'Proteja identidades, armazenamento e cargas de trabalho na nuvem.' },
    grc: { name: 'Governança, Risco e Conformidade', desc: 'Políticas, auditorias e avaliações de risco.' },
  },
  hub: {
    title: 'Central de Treinamento',
    intro: 'Bem-vinda(o) à Orbitae Logistics. Escolha uma missão. Cada uma chega como o trabalho de verdade: um ticket, um runbook na Wiki e as ferramentas na sua área de trabalho.',
    comingSoon: 'Em breve',
    start: 'Iniciar missão',
    restart: 'Recomeçar',
    resume: 'Continuar',
    abandon: 'Abandonar missão',
    difficulty: 'Dificuldade',
    best: 'Melhor nota: {{score}}%',
    active: 'Missão ativa',
    openBriefing: 'Abrir briefing',
    confirmRestart: 'Recomeçar zera esta missão. Clique de novo para confirmar.',
  },
  noMission: 'Nenhuma missão ativa. Comece uma na Central de Treinamento.',
  roles: { l1: 'Analista SOC N1', l2: 'Analista SOC N2 (de plantão)', engineer: 'Engenheiro SOC', manager: 'Gerente do SOC', you: 'Você (N1)' },
  presence: { online: 'online', offline: 'offline' },
  severity: { critical: 'Crítica', high: 'Alta', medium: 'Média', low: 'Baixa' },
  status: { new: 'Novo', in_progress: 'Em andamento', closed: 'Fechado' },
  verdict: { true_positive: 'Verdadeiro positivo', false_positive: 'Falso positivo' },
  soc: {
    queue: 'Fila de alertas',
    filters: { all: 'Todos', new: 'Novos', mine: 'Atribuídos a mim', open: 'Abertos' },
    cols: { id: 'ID', title: 'Alerta', severity: 'Severidade', status: 'Status', assignee: 'Responsável', time: 'Hora (UTC)' },
    unassigned: 'Sem responsável',
    you: 'Você',
    select: 'Selecione um alerta para ver os detalhes.',
    source: 'Origem',
    verdict: 'Veredito',
    description: 'Descrição',
    assignToMe: 'Atribuir a mim',
    startWork: 'Marcar Em andamento',
    writeReport: 'Escrever relatório e fechar',
    notMine: 'Atribua o alerta a você para trabalhar nele.',
    team: 'Equipe de plantão',
    reportTitle: 'Relatório do caso: {{id}}',
    submit: 'Enviar relatório e fechar alerta',
    cancel: 'Cancelar',
    missingVerdict: 'Escolha um veredito antes de enviar.',
    escalatedTo: 'Escalado para {{name}}',
    closedBy: 'Fechado com veredito: {{verdict}}',
  },
  siem: {
    placeholder: 'Busque, ex.: src_ip=203.0.113.45 AND outcome=failure',
    search: 'Buscar',
    from: 'De',
    to: 'Até',
    results_one: '{{count}} evento',
    results_other: '{{count}} eventos',
    fields: 'Valores mais frequentes',
    noResults: 'Nenhum evento corresponde a esta busca.',
    error: 'Erro na consulta: {{msg}}',
    help: 'Guia de consultas',
    clear: 'Limpar',
    pickField: 'Clique num valor para adicioná-lo à busca.',
    examples: 'Digite uma consulta e clique em Buscar. Alguns exemplos:',
  },
  intel: {
    placeholder: 'Endereço IP, domínio, URL ou hash',
    lookup: 'Consultar',
    score: 'Nota de risco',
    malicious: 'Malicioso',
    suspicious: 'Suspeito',
    clean: 'Nenhuma atividade maliciosa conhecida',
    tags: 'Tags',
    reports: 'Denúncias da comunidade',
    asn: 'Rede (ASN)',
    country: 'País',
    firstSeen: 'Visto pela primeira vez',
    notFound: 'Nenhum registro de inteligência para "{{q}}".',
    intro: 'Verifique a reputação de um indicador antes de agir.',
  },
  firewall: {
    title: 'Lista de bloqueio do perímetro (fw-core-01)',
    intro: 'O tráfego de entrada e saída destes endereços é descartado no perímetro.',
    placeholder: 'Endereço IPv4 para bloquear',
    block: 'Bloquear',
    unblock: 'Desbloquear',
    invalid: 'Digite um endereço IPv4 válido.',
    internal: 'Este é um endereço interno (privado). Bloqueá-lo no perímetro não tem efeito e pode esconder o problema.',
    empty: 'Nenhum endereço bloqueado.',
    since: 'Adicionado',
    preexisting: 'regra existente',
    now: 'agora mesmo',
  },
  directory: {
    search: 'Buscar pessoas',
    cols: { name: 'Nome', user: 'Usuário', dept: 'Departamento', location: 'Local', device: 'Dispositivo', status: 'Conta' },
    lock: 'Bloquear conta',
    unlock: 'Desbloquear',
    locked: 'Bloqueada',
    active: 'Ativa',
    details: 'Detalhes',
    email: 'E-mail',
    title: 'Cargo',
    lockNote: 'Bloquear desconecta o usuário de todas as sessões (VPN incluída) e impede novos logins até o TI redefinir a senha.',
  },
  result: {
    title: 'Avaliação do turno',
    score: 'Nota: {{score}} / {{max}} ({{pct}}%)',
    great: 'Excelente trabalho. Este é o relatório que um N2 quer receber.',
    good: 'Bom trabalho. Revise os pontos abaixo para deixá-lo completo.',
    low: 'Alguns passos importantes ficaram de fora. Leia o runbook de novo e tente outra vez.',
    back: 'Voltar à Central de Treinamento',
    retry: 'Refazer missão',
    done: 'Feito',
    missed: 'Faltou',
    newBadges: "Novos badges desbloqueados",
    profile: "Ver perfil",
  },
  notes: {
    placeholder: 'Anote IPs, usuários, horários e tudo o que encontrar. As notas ficam salvas neste navegador.',
    clear: 'Limpar',
    confirmClear: 'Clique de novo para apagar tudo.',
    saved: 'Salvo',
    chars: '{{count}} caracteres',
  },
  profile: {
    defaultName: "Analista",
    nameLabel: "Nome de exibição",
    level: "Nível {{level}}",
    xpLabel: "Progresso até o próximo nível",
    xpToNext: "{{xp}} / {{next}} XP",
    maxLevel: "{{xp}} XP · nível máximo",
    locked: "Bloqueado",
    noHistory: "Nenhuma missão concluída ainda. Suas tentativas aparecem aqui.",
    stats: {
      xp: "XP",
      completed: "Missões",
      avg: "Nota média",
      badges: "Badges",
    },
    tabs: {
      progress: "Progresso",
      badges: "Badges",
      history: "Histórico",
      ranking: "Ranking",
    },
    cols: {
      date: "Data",
      mission: "Missão",
      score: "Nota",
      time: "Tempo",
    },
  },
  account: {
    loading: "Carregando…",
    joinTitle: "Entre no ranking global",
    joinText: "Crie uma conta grátis para salvar seu progresso online, comparar XP com outros jogadores e manter seus badges em qualquer dispositivo.",
    github: "Entrar com GitHub",
    emailPlaceholder: "voce@exemplo.com",
    emailLink: "Receber link de acesso por e-mail",
    emailSent: "Confira seu e-mail: enviamos um link de acesso.",
    privacy: "Guardamos só um nome de usuário, os resultados das missões e os badges. Você pode excluir sua conta quando quiser.",
    username: "Nome de usuário",
    usernameRule: "3 a 20 caracteres: letras minúsculas, números e _",
    usernameTaken: "Esse nome de usuário já está em uso.",
    save: "Salvar",
    cancel: "Cancelar",
    edit: "Editar",
    syncing: "Sincronizando…",
    synced: "Progresso salvo online",
    signOut: "Sair",
    delete: "Excluir conta",
    confirmDelete: "Clique de novo para excluir sua conta e todos os seus dados",
    photoChange: "Trocar foto",
    photoRemove: "Remover foto",
    photoHint: "PNG, JPG ou WebP de até 5 MB",
    photoUploading: "Enviando…",
    photoSignIn: "Entre na sua conta para adicionar uma foto",
    avatarErr: {
      type: "Use uma imagem PNG, JPG, WebP ou GIF.",
      tooBig: "A imagem é grande demais. Escolha uma de até 5 MB.",
      unreadable: "Não foi possível ler essa imagem. Tente outro arquivo.",
    },
  },
  ranking: {
    signIn: "Entre na sua conta no perfil acima para aparecer no ranking.",
    empty: "Ninguém concluiu uma missão ainda. Seja a primeira pessoa!",
    error: "Não foi possível carregar o ranking. Tente mais tarde.",
    player: "Jogador(a)",
  },
  charts: {
    scoreTitle: "Notas ao longo do tempo",
    scoreSummary_one: "{{count}} missão · média {{avg}}%",
    scoreSummary_other: "{{count}} missões · média {{avg}}%",
    noData: "Nenhuma missão neste período ainda.",
    range: "Período",
    scoreAria_one: "Gráfico de notas: {{count}} missão, média {{avg}}%. Use as setas para ler cada ponto.",
    scoreAria_other: "Gráfico de notas: {{count}} missões, média {{avg}}%. Use as setas para ler cada ponto.",
    ranges: {
      week: "1 semana",
      month: "1 mês",
      year: "1 ano",
      all: "Todo o tempo",
    },
    activityTitle: "Atividade",
    activitySummary_one: "{{count}} dia ativo nos últimos 6 meses",
    activitySummary_other: "{{count}} dias ativos nos últimos 6 meses",
    attempts_zero: "Nenhuma missão",
    attempts_one: "{{count}} missão",
    attempts_other: "{{count}} missões",
    less: "Menos",
    more: "Mais",
  },
  streak: {
    days_one: "{{count}} dia seguido",
    days_other: "{{count}} dias seguidos",
    safe: "Você já jogou hoje. Até amanhã!",
    atRisk: "Jogue uma missão hoje para manter a sequência.",
    keepGoing_one: "🔥 {{count}} dia seguido: conclua uma missão hoje para manter a sequência!",
    keepGoing_other: "🔥 {{count}} dias seguidos: conclua uma missão hoje para manter a sequência!",
    start: "Conclua uma missão hoje para começar uma sequência 🔥",
    best_one: "Melhor sequência: {{count}} dia",
    best_other: "Melhor sequência: {{count}} dias",
  },
  reward: {
    noXp: "Sem XP novo: supere sua melhor nota para ganhar mais.",
    levelUp: "Subiu de nível! Agora você é Nível {{level}}: {{title}}",
    streakUp_one: "{{count}} dia seguido!",
    streakUp_other: "{{count}} dias seguidos! Volte amanhã para continuar.",
    toNext: "Faltam {{xp}} XP para o Nível {{level}}",
    nextBadge: "Próximo badge",
  },
  levels: {
    "0": "Estagiário(a)",
    "1": "Analista Júnior",
    "2": "Analista SOC I",
    "3": "Analista SOC II",
    "4": "Analista Sênior",
    "5": "Threat Hunter",
    "6": "Incident Responder",
    "7": "Detection Engineer",
    "8": "SOC Lead",
    "9": "Cyber Defender",
  },
  badges: {
    first_steps: {
      name: "Primeiro plantão",
      desc: "Conclua qualquer missão com pelo menos 60%.",
    },
    perfect: {
      name: "Relatório perfeito",
      desc: "Tire 100% em uma missão.",
    },
    flawless: {
      name: "Impecável",
      desc: "Tire 100% na primeira tentativa de uma missão.",
    },
    speed: {
      name: "Resposta rápida",
      desc: "Tire 80% ou mais em menos de 10 minutos.",
    },
    by_the_book: {
      name: "Seguindo o manual",
      desc: "Abra o runbook antes de qualquer ação de contenção.",
    },
    contained: {
      name: "Contido",
      desc: "Bloqueie o atacante e a conta comprometida na mesma missão.",
    },
    polyglot: {
      name: "Poliglota",
      desc: "Conclua missões em dois idiomas diferentes.",
    },
    cross_platform: {
      name: "Multiplataforma",
      desc: "Conclua missões no Windows, macOS e Linux.",
    },
    soc_track: {
      name: "Formado(a) em SOC",
      desc: "Tire 80% ou mais em todas as missões de SOC.",
    },
    streak_3: {
      name: "Embalado(a)",
      desc: "Jogue missões em 3 dias seguidos.",
    },
    streak_7: {
      name: "Semana de plantão",
      desc: "Jogue missões em 7 dias seguidos.",
    },
  },
  wikiNav: 'Páginas',
}

export const wiki = {
  triage: {
    title: 'Manual do SOC: triagem de alertas',
    body: `# Triagem de alertas

Todo alerta segue o mesmo ciclo: **escolher → entender → investigar → decidir → reportar**.

## 1. Escolha o alerta certo
1. Pegue apenas alertas **Novos** e sem responsável. Nunca trabalhe num alerta que já é de um colega.
2. Ordene por **severidade**: crítica, depois alta, média e baixa.
3. Na mesma severidade, pegue o **mais antigo** primeiro. Uma invasão mais antiga já teve mais tempo para causar estrago.

## 2. Assuma o alerta
Atribua o alerta a você e marque **Em andamento**, para o time saber que alguém está cuidando dele.

## 3. Investigue
Leia a descrição e confirme os fatos no **SIEM**. Verifique indicadores (IPs, domínios, hashes) no **Threat Intel**. Consulte pessoas e dispositivos no **Diretório**.

## 4. Decida
- **Verdadeiro positivo**: a atividade é maliciosa ou viola uma política.
- **Falso positivo**: a atividade é legítima. Explique *por quê*.

A severidade define a ordem do trabalho, não o veredito.

## 5. Reporte e feche
Escreva o relatório do caso (veja *Como escrever um relatório*) e feche o alerta, ou escale.`,
  },
  siem: {
    title: 'Guia de consultas do SIEM',
    body: `# Guia de consultas do SIEM

O SIEM coleta logs do gateway de VPN, firewall, proxy, controlador de domínio, servidores de arquivos e gateway de e-mail.

## Sintaxe
| Exemplo | Significado |
|---|---|
| \`src_ip=203.0.113.45\` | campo igual ao valor |
| \`user=l.*\` | \`*\` é curinga |
| \`source=vpn outcome=failure\` | vários termos = AND |
| \`user=admin OR user=root\` | um ou outro |
| \`NOT outcome=success\` | excluir |
| \`dst_port>1024\` | comparação numérica (\`> < >= <=\`) |
| \`"payroll"\` | texto livre em qualquer campo |

## Campos comuns
- \`source\`: vpn, firewall, proxy, auth, fileserver, email
- \`user\`, \`src_ip\`, \`dst_ip\`, \`dst_port\`
- \`outcome\` (success / failure), \`action\` (allowed / denied)
- \`assigned_ip\`: IP interno que a VPN dá para a sessão

## Dicas
- Comece amplo (um IP) e vá refinando.
- Sempre verifique o que aconteceu **depois** do evento do alerta. Algum login deu certo? Para onde essa sessão foi?
- Clique num valor em **Valores mais frequentes** para adicioná-lo à busca.`,
  },
  escalation: {
    title: 'Matriz de escalonamento',
    body: `# Matriz de escalonamento

Escale para o **N2 de plantão** quando qualquer um destes for verdade:
1. O alerta indica uma invasão real que precisa de investigação mais profunda.
2. É preciso remediar além da contenção do N1 (troca de senha, isolar máquina, remover malware).
3. Alguém fora do SOC precisa ser avisado (gestão, clientes, jurídico).
4. Você não entende totalmente o alerta. Perguntar é sempre melhor que adivinhar.

**Não** escale um verdadeiro positivo que foi totalmente bloqueado por um controle (por exemplo, uma conexão barrada pelo firewall) e não precisa de mais nada. Documente e feche.

## Cadeia de contato
| Ordem | Quem | Quando |
|---|---|---|
| 1 | N2 de plantão | sempre primeiro |
| 2 | N3 / Resposta a Incidentes | N2 sem resposta por 30 min num alerta crítico |
| 3 | Engenheiro SOC | problemas de ferramenta: logs faltando, SIEM fora do ar |
| 4 | Gerente do SOC | depois dos anteriores, ou para questões de equipe |

Para escalar no Painel do SOC, escolha a pessoa no campo **Escalar para** do relatório do caso.`,
  },
  reporting: {
    title: 'Como escrever um relatório',
    body: `# Como escrever um relatório

Os logs brutos são apagados depois de alguns meses, mas os alertas ficam. **O relatório é o registro permanente**, e é a primeira coisa que o próximo analista lê.

Responda os cinco Ws:
- **Who (quem)**: usuários e máquinas envolvidos.
- **What (o quê)**: o que aconteceu, passo a passo.
- **When (quando)**: hora de início e fim (use os horários dos logs, em UTC).
- **Where (onde)**: origem e destino (IPs, hosts, URLs).
- **Why (por quê)**: o raciocínio por trás do veredito. A parte mais importante.

Liste também os **indicadores de comprometimento (IOCs)**: IPs, domínios, hashes, contas, e as **ações já tomadas** (bloqueado, conta travada...).

Escreva de forma que alguém que não viu o alerta entenda em um minuto.`,
  },
}
