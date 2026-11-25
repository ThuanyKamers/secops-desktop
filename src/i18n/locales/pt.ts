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
    password: 'Senha',
    signIn: 'Entrar',
    hint: 'Estação de treinamento: não precisa de senha.',
    back: 'Trocar de estação',
  },
  apps: {
    missions: 'Central de Treinamento',
    wiki: 'Wiki',
    soc: 'Painel do SOC',
    siem: 'SIEM',
    intel: 'Threat Intel',
    firewall: 'Firewall',
    directory: 'Diretório',
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
