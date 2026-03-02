import { useState } from 'react';

interface Props {
  t: {
    namePlaceholder: string;
    emailPlaceholder: string;
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

    try {
      const res = await fetch('https://formspree.io/f/xyzgpkqr', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      // Fallback: open mailto
      const name = data.get('name') as string;
      const email = data.get('email') as string;
      const message = data.get('message') as string;
      window.location.href = `mailto:${t.email}?subject=Contato via site - ${name}&body=${encodeURIComponent(message)}%0A%0A${email}`;
      setStatus('idle');
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
      <div>
        <input
          type="text"
          name="name"
          required
          placeholder={t.namePlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-iit-blue/50 focus:border-iit-blue text-gray-900 placeholder-gray-400 transition-all"
        />
      </div>
      <div>
        <input
          type="email"
          name="email"
          required
          placeholder={t.emailPlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-iit-blue/50 focus:border-iit-blue text-gray-900 placeholder-gray-400 transition-all"
        />
      </div>
      <div>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t.messagePlaceholder}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-iit-blue/50 focus:border-iit-blue text-gray-900 placeholder-gray-400 transition-all resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-4 bg-iit-blue hover:bg-iit-blue-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#0097D6' }}
      >
        {status === 'sending' ? t.sending : t.send}
      </button>
    </form>
  );
}
