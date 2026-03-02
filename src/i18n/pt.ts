export const pt = {
  lang: 'pt-BR',
  siteName: 'Instituto Itinerante de Tecnologia',
  siteDescription: 'Agente de atendimento inteligente para empresas. Atenda clientes 24/7 no WhatsApp com IA.',

  nav: {
    about: 'Sobre',
    attendAgent: 'Attend-Agent',
    contact: 'Contato',
    contactPage: '/contato',
    langSwitcher: 'English',
    langLink: '/en/',
    whatsapp: 'WhatsApp',
    whatsappLink: 'https://wa.me/5571999999999',
  },

  hero: {
    badge: '🤖 Agente de Atendimento Inteligente',
    headline: 'Tecnologia que transforma negócios',
    subheadline: 'Agentes de inteligência artificial que atendem seus clientes 24/7, qualificam leads e agendam reuniões — no WhatsApp.',
    ctaPrimary: 'Falar pelo WhatsApp',
    ctaSecondary: 'Conhecer o Attend-Agent',
  },

  about: {
    sectionLabel: 'Sobre o IIT',
    title: 'Quem somos',
    text: 'O Instituto Itinerante de Tecnologia (IIT) é uma empresa de tecnologia fundada em Salvador, Bahia. Desenvolvemos agentes de IA e soluções sob medida para negócios que buscam eficiência e inovação. Nossa equipe combina experiência em engenharia de software, arquitetura de sistemas e inteligência artificial.',
    values: [
      { icon: '⚡', title: 'Eficiência', desc: 'Soluções que entregam resultado real, sem desperdício de tempo ou recurso.' },
      { icon: '🤖', title: 'Inovação com IA', desc: 'Integramos inteligência artificial onde ela gera valor de verdade.' },
      { icon: '🛠️', title: 'Engenharia sólida', desc: 'Código limpo, arquitetura escalável e boas práticas em tudo que construímos.' },
    ],
  },

  attendAgent: {
    sectionLabel: 'Attend-Agent',
    title: 'Seu agente de atendimento inteligente',
    description: 'Atenda clientes 24/7 no WhatsApp, qualifique leads automaticamente e agende reuniões — sem contratar mais ninguém.',
    features: [
      { icon: '🕐', title: 'Atendimento 24/7', desc: 'Nunca perca um cliente por falta de resposta. Seu agente nunca dorme.' },
      { icon: '🎯', title: 'Qualificação de leads', desc: 'Filtre e qualifique prospects automaticamente antes de chegar para você.' },
      { icon: '📅', title: 'Agendamento automático', desc: 'Reuniões agendadas sem troca de mensagens manual.' },
      { icon: '💬', title: 'Integração WhatsApp', desc: 'Funciona no canal que seus clientes já usam.' },
      { icon: '📊', title: 'Relatórios em tempo real', desc: 'Acompanhe métricas de atendimento e conversão.' },
    ],
    cta: 'Quero um agente agora',
    chatMockup: [
      { from: 'user', text: 'Oi! Quero saber sobre os planos' },
      { from: 'agent', text: '👋 Olá! Sou o assistente do IIT. Com prazer te ajudo! Você tem uma empresa ou é autônomo?' },
      { from: 'user', text: 'Tenho uma pequena empresa' },
      { from: 'agent', text: '✅ Perfeito! Posso agendar uma demo gratuita com nossa equipe. Qual melhor horário para você?' },
    ],
  },

  contact: {
    sectionLabel: 'Contato',
    title: 'Vamos conversar?',
    subtitle: 'Tem um projeto em mente ou quer saber mais sobre o Attend-Agent? Manda mensagem.',
    email: 'contato@institutoitinerante.com.br',
    whatsapp: '+55 71 99999-9999',
    whatsappLink: 'https://wa.me/5571999999999',
    whatsappLabel: 'Fale conosco pelo WhatsApp',
    namePlaceholder: 'Seu nome',
    emailPlaceholder: 'seu@email.com',
    messagePlaceholder: 'Como podemos ajudar?',
    send: 'Enviar mensagem',
    sending: 'Enviando...',
    successMessage: 'Mensagem enviada! Entraremos em contato em breve.',
  },

  footer: {
    tagline: 'Agentes de IA para empresas que querem crescer.',
    links: {
      title: 'Links',
      home: 'Início',
      about: 'Sobre',
      attendAgent: 'Attend-Agent',
      contact: 'Contato',
    },
    contact: {
      title: 'Contato',
      whatsappLabel: 'WhatsApp',
      emailLabel: 'Email',
    },
    rights: '© 2026 Instituto Itinerante de Tecnologia. Todos os direitos reservados.',
    madeIn: 'Feito com 💙 em Salvador, BA',
  },

  whatsappFloat: 'Fale conosco',

  pages: {
    home: {
      title: 'Instituto Itinerante de Tecnologia — Agente de Atendimento com IA',
      description: 'O IIT cria agentes de atendimento com IA para empresas. Atenda clientes 24/7 no WhatsApp, qualifique leads e agende reuniões automaticamente.',
    },
    contact: {
      title: 'Contato — Instituto Itinerante de Tecnologia',
      description: 'Entre em contato com o IIT para projetos, parcerias ou para saber mais sobre o Attend-Agent.',
    },
    notFound: {
      title: '404 — Página não encontrada | IIT',
      heading: 'Página não encontrada',
      text: 'A página que você procura não existe ou foi movida.',
      back: 'Voltar para o início',
    },
  },
};

export type Strings = typeof pt;
