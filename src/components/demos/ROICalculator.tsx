import { useState, useMemo } from 'react';

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export default function ROICalculator() {
  const [msgsDay, setMsgsDay] = useState(50);
  const [pctLost, setPctLost] = useState(40);
  const [ticket, setTicket] = useState(300);
  const [dias] = useState(22);

  const results = useMemo(() => {
    const leadsPerDay = msgsDay * (pctLost / 100);
    const leadsPerMonth = Math.round(leadsPerDay * dias);
    const revLost = leadsPerMonth * ticket;
    const recovered = Math.round(revLost * 0.65);
    const investMin = 397;
    const payback = recovered > 0 ? Math.ceil((investMin / (recovered / 30))) : 0;
    return { leadsPerMonth, revLost, recovered, payback };
  }, [msgsDay, pctLost, ticket, dias]);

  return (
    <div className="bg-white rounded-2xl border border-[#D0DDE6] shadow-sm p-8 max-w-2xl mx-auto">
      <h3 className="text-2xl font-black text-[#0D1B26] mb-2">Calculadora de ROI</h3>
      <p className="text-gray-500 text-sm mb-8">Descubra quanto você está perdendo sem atendimento automático.</p>

      <div className="space-y-6">
        {/* Slider 1 */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Mensagens por dia no WhatsApp</label>
            <span className="text-sm font-bold text-[#0097D6]">{msgsDay}</span>
          </div>
          <input
            type="range" min={10} max={500} step={10}
            value={msgsDay}
            onChange={(e) => setMsgsDay(Number(e.target.value))}
            className="w-full accent-[#0097D6]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10</span><span>500</span></div>
        </div>

        {/* Slider 2 */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">% sem resposta fora do horário</label>
            <span className="text-sm font-bold text-[#0097D6]">{pctLost}%</span>
          </div>
          <input
            type="range" min={10} max={80} step={5}
            value={pctLost}
            onChange={(e) => setPctLost(Number(e.target.value))}
            className="w-full accent-[#0097D6]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10%</span><span>80%</span></div>
        </div>

        {/* Ticket */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket médio do negócio (R$)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">R$</span>
            <input
              type="number" min={50} max={50000}
              value={ticket}
              onChange={(e) => setTicket(Number(e.target.value))}
              className="w-full border border-[#D0DDE6] rounded-xl pl-10 pr-4 py-3 text-gray-800 font-semibold focus:outline-none focus:border-[#0097D6]"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
          <p className="text-xs text-red-500 font-semibold uppercase tracking-wide mb-1">Leads perdidos/mês</p>
          <p className="text-3xl font-black text-red-600">~{results.leadsPerMonth}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
          <p className="text-xs text-red-500 font-semibold uppercase tracking-wide mb-1">Receita perdida/mês</p>
          <p className="text-2xl font-black text-red-600">{fmt(results.revLost)}</p>
        </div>
        <div className="bg-[#0097D6]/5 border border-[#0097D6]/20 rounded-xl p-4 text-center">
          <p className="text-xs text-[#0097D6] font-semibold uppercase tracking-wide mb-1">Recuperável com Attend-Agent</p>
          <p className="text-2xl font-black text-[#0097D6]">{fmt(results.recovered)}</p>
        </div>
        <div className="bg-[#00D6A0]/10 border border-[#00D6A0]/20 rounded-xl p-4 text-center">
          <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-1">Payback do investimento</p>
          <p className="text-3xl font-black text-emerald-600">{results.payback}d</p>
        </div>
      </div>

      <a
        href="https://wa.me/5571992732430?text=Quero%20recuperar%20minha%20receita%20perdida%20com%20o%20Attend-Agent"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 w-full flex items-center justify-center gap-2 bg-[#0097D6] hover:bg-[#007ab8] text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-[#0097D6]/30 transition-all hover:scale-[1.02]"
      >
        💰 Quero recuperar esse dinheiro →
      </a>

      <p className="text-xs text-gray-400 text-center mt-3">
        Estimativa baseada em taxa de recuperação de 65% com automação ativa 24/7.
      </p>
    </div>
  );
}
