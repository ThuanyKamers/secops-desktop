export default {
  hub: {
    title: 'Missão 1: Toc toc na VPN',
    summary: 'Uma rajada de logins de VPN com falha disparou um alerta. Descubra se o atacante entrou, contenha a ameaça e passe o caso para o N2.',
    skills: 'Triagem de alertas · SIEM · Reputação de IP · Contenção · Escalonamento · Relatório 5 Ws',
  },
  alerts: {
    a2041: {
      title: 'Vários logins de VPN com falha vindos de uma única origem',
      desc: 'Mais de 50 tentativas de autenticação com falha contra o vpn-gw-01 a partir de um único IP em 5 minutos. Regra: AUTH-BF-003. Possível força bruta ou password spraying. Siga o runbook RB-AUTH-01.',
    },
    a2042: {
      title: 'Falha na atualização de assinaturas do antivírus',
      desc: 'O agente de EDR no PC-WH-005 não conseguiu baixar a atualização de assinaturas de hoje (timeout). Fora isso, o agente está saudável.',
    },
    a2038: {
      title: 'Conexão de saída para domínio recém-registrado',
      desc: 'A estação LPT-SAL-007 se conectou a um domínio registrado há 2 dias.',
    },
    a2035: {
      title: 'Volume de impressão incomum',
      desc: '420 páginas impressas por um usuário em 10 minutos.',
    },
  },
  intel: {
    attacker: 'IP de provedor de hospedagem amplamente denunciado por campanhas de força bruta em VPN e SSH nos últimos 30 dias.',
    homeIsp: 'Endereço de banda larga residencial. Nenhuma denúncia.',
  },
  wiki: {
    briefing: {
      title: 'Briefing do turno: segunda, 08:15 UTC',
      body: `# Briefing do turno

Bom dia, e bem-vinda(o) ao seu primeiro turno no SOC da Orbitae Logistics. Você é o(a) **analista N1** de plantão.

Um novo alerta de severidade **alta** acabou de chegar na fila. Trate-o seguindo nossos procedimentos:

- Runbook para este tipo de alerta: [RB-AUTH-01: Força bruta em autenticação](#rb-auth-01)
- Como escolhemos e tratamos alertas: [Triagem de alertas](#triage)
- Como buscar nos logs: [Guia de consultas do SIEM](#siem-guide)
- Quem acionar: [Matriz de escalonamento](#escalation)
- O que vai no relatório: [Como escrever um relatório](#reporting)

Sua equipe hoje: **Lucas Sagás** (N2 de plantão), **Thuany Kamers** (Engenheiro SOC) e **Davi Amorim** (N1, trabalhando em outro alerta). **Priya Nair** (Gerente do SOC) está em reuniões a manhã toda.

Abra o **Painel do SOC** para começar.`,
    },
    runbook: {
      title: 'RB-AUTH-01: Força bruta em autenticação',
      body: `# RB-AUTH-01: Força bruta em autenticação

**Aplica-se a:** regras AUTH-BF-001 a AUTH-BF-005 (VPN, webmail, SSO).
**Objetivo:** descobrir se alguma tentativa de login **deu certo**, conter a ameaça e reportar.

## Passo 1: Assuma o alerta
No **Painel do SOC**, atribua o alerta a você e marque **Em andamento**.

## Passo 2: Dimensione o ataque no SIEM
Busque o IP de origem do alerta:

\`src_ip=<IP do atacante>\`

Anote:
- o primeiro e o último evento (janela de tempo),
- quais **usuários** foram testados,
- se **alguma tentativa tem \`outcome=success\`**.

> Algumas falhas seguidas de um sucesso a partir do IP habitual do usuário é normal (erro de digitação). Centenas de falhas de um IP desconhecido não é.

## Passo 3: Verifique a reputação da origem
Consulte o IP do atacante no **Threat Intel**. Nota de risco alta e tags de força bruta confirmam que a atividade é maliciosa.

## Passo 4: Se um login deu certo, siga a sessão
Um login de VPN bem-sucedido recebe um IP interno (\`assigned_ip\`). Busque esse IP no SIEM para ver **o que a sessão acessou** (servidores de arquivos, RDP etc.).
Confira no **Diretório** se o usuário real poderia ter feito esse login (local, dispositivo, outros logins no mesmo horário).

## Passo 5: Contenha
1. **Bloqueie** o IP do atacante no **Firewall** do perímetro. Nunca bloqueie IPs internos ou de usuários legítimos.
2. Se uma conta foi comprometida, **bloqueie-a** no **Diretório**. Isso encerra a sessão de VPN dela.
3. Só bloqueie contas para as quais você tem evidência.

## Passo 6: Reporte e escale
- Veredito: verdadeiro positivo se a atividade for maliciosa.
- Um login **bem-sucedido** de um atacante é um comprometimento: **escale para o N2 de plantão**. A conta precisa de troca de senha e os dados acessados precisam ser revisados.
- Se todas as tentativas falharam e o IP está bloqueado, feche sem escalar.

Preencha o relatório do caso com os 5 Ws. Veja [Como escrever um relatório](#reporting).`,
    },
  },
  report: {
    verdict: 'Veredito',
    choose: 'Escolha…',
    tp: 'Verdadeiro positivo',
    fp: 'Falso positivo',
    who: 'Quem: conta(s) de usuário afetada(s)',
    whoHint: 'ex.: j.doe',
    where: 'Onde: IP de origem do atacante',
    whereHint: 'ex.: 192.0.2.10',
    start: 'Quando: primeiro evento malicioso (UTC)',
    end: 'Quando: última tentativa / comprometimento (UTC)',
    timeHint: 'HH:MM:SS',
    assets: 'Sistemas internos acessados depois do login',
    assetsHint: 'IPs ou hostnames, ou "nenhum"',
    summary: 'O que aconteceu e por quê (raciocínio do veredito, IOCs, ações tomadas)',
    summaryHint: 'Explique de forma que o N2 entenda o caso em um minuto.',
    escalate: 'Escalar para',
    noEscalation: 'Sem escalonamento: fechar o alerta',
    toL2: 'Lucas Sagás (N2 de plantão)',
    toEngineer: 'Thuany Kamers (Engenheiro SOC)',
    toManager: 'Priya Nair (Gerente do SOC)',
  },
  grade: {
    assigned: { label: 'Você atribuiu o alerta a si antes de trabalhar nele.', tip: 'Sempre assuma o alerta primeiro, para ninguém duplicar o trabalho.' },
    siem: { label: 'Você buscou o IP do atacante no SIEM.', tip: 'Comece buscando o IP de origem do alerta: src_ip=203.0.113.45.' },
    siemSuccess: { label: 'Você verificou se algum login deu certo.', tip: 'A pergunta-chave numa força bruta: alguma tentativa deu certo? Tente outcome=success ou user=l.moreau.' },
    intel: { label: 'Você verificou a reputação do IP no Threat Intel.', tip: 'Confirme a reputação de um indicador antes de agir.' },
    block: { label: 'Você bloqueou 203.0.113.45 no firewall.', tip: 'O IP do atacante ainda conseguia chegar à VPN.' },
    noWrongBlock: { label: 'Você não bloqueou nenhum IP legítimo.', tip: 'Bloquear endereços de usuários ou internos atrapalha o negócio e não para o atacante.' },
    lock: { label: 'Você bloqueou a conta comprometida l.moreau.', tip: 'O atacante entrou como l.moreau às 08:10:48. Bloquear a conta encerra essa sessão de VPN.' },
    noWrongLock: { label: 'Você não bloqueou contas sem evidência.', tip: 'Só a conta com login malicioso bem-sucedido precisava ser bloqueada.' },
    verdict: { label: 'Veredito: verdadeiro positivo.', tip: 'Centenas de falhas de um IP malicioso seguidas de um sucesso é um ataque real.' },
    escalate: { label: 'Você escalou para o N2 de plantão.', tip: 'Um login bem-sucedido do atacante é um comprometimento: escale para Lucas Sagás (N2), conforme a matriz de escalonamento.' },
    who: { label: 'Quem: a conta afetada está nomeada.', tip: 'O relatório precisa nomear a conta comprometida (l.moreau / Lucas Moreau).' },
    where: { label: 'Onde: o IP do atacante está no relatório.', tip: 'Inclua o IP de origem 203.0.113.45 como IOC.' },
    when: { label: 'Quando: a janela de tempo está correta.', tip: 'O ataque foi de 08:07:02 (primeira tentativa de spraying) até o login bem-sucedido às 08:10:48.' },
    assets: { label: 'Você identificou o que a sessão acessou.', tip: 'Seguindo assigned_ip=10.8.0.23 aparece o acesso ao fs-01 (10.10.5.20), compartilhamento do financeiro.' },
    why: { label: 'O resumo explica o caso.', tip: 'Escreva pelo menos algumas frases: o que aconteceu, por que é malicioso, o que você já fez.' },
  },
}
