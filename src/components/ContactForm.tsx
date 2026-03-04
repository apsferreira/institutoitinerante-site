import { useState } from 'react';

interface Props {
  t: {
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder?: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    successMessage: string;
    email: string;
  };
}

export default function ContactForm({ t }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get('name') as string,
      email: data.get('email') as string,
      phone: data.get('phone') as string | undefined,
      message: data.get('message') as string,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-lg font-semibold text-gray-900">{t.successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp.
        </div>
      )}
      <div>
        <input
          type="text"
          name="name"
          required
          placeholder={t.namePlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0097D6]/50 focus:border-[#0097D6] text-gray-900 placeholder-gray-400 transition-all"
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          required
          placeholder={t.emailPlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0097D6]/50 focus:border-[#0097D6] text-gray-900 placeholder-gray-400 transition-all"
        />
      </div>
      <div>
        <input
          type="tel"
          name="phone"
          placeholder={t.phonePlaceholder || 'Seu telefone (opcional)'}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0097D6]/50 focus:border-[#0097D6] text-gray-900 placeholder-gray-400 transition-all"
        />
      </div>
      <div>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t.messagePlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0097D6]/50 focus:border-[#0097D6] text-gray-900 placeholder-gray-400 transition-all resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-4 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#0097D6' }}
      >
        {status === 'sending' ? t.sending : t.send}
      </button>
    </form>
  );
}
