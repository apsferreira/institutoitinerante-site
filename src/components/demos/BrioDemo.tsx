import { useState, useRef, useEffect } from 'react';

interface Message {
  from: 'user' | 'agent';
  text: string;
  time: string;
}

const getTime = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
};

const responses: Record<string, string> = {
  default: 'Posso te ajudar com mais alguma coisa? 😊',
};

function getAgentReply(userMsg: string): string {
  const msg = userMsg.toLowerCase().trim();
  if (/ol[aá]|oi|bom dia|boa tarde|boa noite|hey|hi/.test(msg)) {
    return 'Olá! 😊 Bem-vindo à Clínica Exemplo. Sou o assistente virtual. Como posso te ajudar hoje?\n\n1️⃣ Agendar consulta\n2️⃣ Saber sobre preços\n3️⃣ Horários de atendimento\n4️⃣ Outras dúvidas';
  }
  if (/consulta|agendar|marcar|appoint/.test(msg)) {
    return 'Claro! Qual especialidade você precisa?\n\n👨‍⚕️ Clínico Geral\n🦷 Odontologia\n🧠 Psicologia\n💆 Nutrição\n\nTemos disponibilidade ainda esta semana!';
  }
  if (/pre[çc]o|valor|custo|quanto|plano|conven/.test(msg)) {
    return 'Nossa consulta inicial é **R$150**. Trabalhamos com os principais convênios:\n\n✅ Unimed\n✅ Bradesco Saúde\n✅ SulAmérica\n✅ Amil\n\nConsulta particular também disponível. Quer verificar disponibilidade?';
  }
  if (/s[aá]bado|domingo|fim de semana|weekend/.test(msg)) {
    return 'Sim! Atendemos sábados das 8h às 13h. 🗓️\n\nQuer que eu verifique horários disponíveis para o próximo sábado?';
  }
  if (/hor[aá]rio|funciona|abre|fecha|quando/.test(msg)) {
    return '⏰ Nosso horário de atendimento:\n\nSeg-Sex: 8h às 19h\nSábado: 8h às 13h\nDomingo: fechado\n\nPosso agendar sua consulta agora mesmo!';
  }
  if (/endere[çc]o|localiza|onde|location|bairro/.test(msg)) {
    return '📍 Estamos localizados na Av. Tancredo Neves, 1632 — Caminho das Árvores, Salvador/BA.\n\nFácil acesso por transporte público. Quer que eu envie o link do mapa?';
  }
  if (/sim|quero|ok|pode|claro|yes|vamos|confirmar/.test(msg)) {
    return '✅ Ótimo! Vou registrar seu interesse. Nossa equipe entrará em contato em breve para confirmar.\n\nEnquanto isso, é isso que o **Brio** faz pela sua empresa — atendimento 24/7, sem perder nenhum lead. 🚀\n\n👇 Quer um para o seu negócio?';
  }
  return 'Entendi! Posso te ajudar com:\n\n📅 Agendamento de consultas\n💰 Informações de preços\n⏰ Horários de funcionamento\n📍 Localização\n\nSobre o que você gostaria de saber?';
}

export default function AttendAgentDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'agent',
      text: 'Olá! 👋 Bem-vindo à Clínica Exemplo. Sou o Brio, assistente virtual 24/7. Como posso te ajudar hoje?',
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickReplies = ['Olá!', 'Quero marcar consulta', 'Qual o preço?', 'Vocês atendem sábado?'];

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { from: 'user', text, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const delay = 800 + Math.random() * 1000;
    await new Promise(r => setTimeout(r, delay));

    const reply = getAgentReply(text);
    setMessages(prev => [...prev, { from: 'agent', text: reply, time: getTime() }]);
    setIsTyping(false);

    if (/quer um para|seu negócio|brio/i.test(reply)) {
      setShowCTA(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Phone frame */}
      <div className="w-full max-w-sm bg-gray-800 rounded-3xl p-3 shadow-2xl">
        <div className="rounded-2xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
          {/* WA Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#075E54] shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#0097D6] flex items-center justify-center text-white font-bold text-xs shrink-0">
              IIT
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">Clínica Exemplo · Brio</p>
              <p className="text-green-200 text-xs">online agora</p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2" style={{ background: '#ECE5DD' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.from === 'user'
                      ? 'bg-[#DCF8C6] text-gray-800 rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                  <span className="block text-right text-[10px] text-gray-400 mt-1">
                    {msg.time} {msg.from === 'user' && '✓✓'}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-xl rounded-bl-none shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {!showCTA && (
            <div className="flex gap-2 px-3 py-2 overflow-x-auto bg-[#ECE5DD] border-t border-gray-200 shrink-0">
              {quickReplies.map((r) => (
                <button
                  key={r}
                  onClick={() => sendMessage(r)}
                  className="shrink-0 text-xs bg-white text-[#0097D6] border border-[#0097D6] rounded-full px-3 py-1 hover:bg-[#0097D6] hover:text-white transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#F0F0F0] shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Digite uma mensagem..."
              className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-gray-700 outline-none border border-gray-200 focus:border-[#25D366]"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isTyping}
              className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 hover:bg-[#20ba5a] transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* CTA after demo */}
      {showCTA && (
        <div className="w-full max-w-sm bg-gradient-to-br from-[#0097D6] to-[#007ab8] rounded-2xl p-6 text-center text-white shadow-lg shadow-[#0097D6]/30">
          <p className="font-bold text-lg mb-1">🚀 Esse é o Brio em ação!</p>
          <p className="text-sm text-white/80 mb-4">Quer um assim para sua empresa, funcionando 24/7?</p>
          <a
            href="https://wa.me/5571992732430?text=Quero%20saber%20mais%20sobre%20o%20Brio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#0097D6] font-bold px-6 py-3 rounded-xl text-sm hover:scale-105 transition-transform"
          >
            Quero o meu Brio →
          </a>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center max-w-xs">
        ↑ Demo interativo. Experimente digitar perguntas reais que seus clientes fariam.
      </p>
    </div>
  );
}
