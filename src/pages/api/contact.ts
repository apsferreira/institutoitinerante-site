import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { name: string; email: string; phone?: string; message: string };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, email, phone, message } = body;

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Missing required fields: name, email, message' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const htmlBody = `
    <h2>Nova mensagem via site — Instituto Itinerante</h2>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-family: sans-serif; font-size: 14px;">
      <tr>
        <td style="font-weight:bold; color:#555; white-space:nowrap;">Nome:</td>
        <td>${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td style="font-weight:bold; color:#555; white-space:nowrap;">Email:</td>
        <td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
      </tr>
      ${phone ? `<tr>
        <td style="font-weight:bold; color:#555; white-space:nowrap;">Telefone:</td>
        <td>${escapeHtml(phone)}</td>
      </tr>` : ''}
      <tr>
        <td style="font-weight:bold; color:#555; vertical-align:top; white-space:nowrap;">Mensagem:</td>
        <td style="white-space:pre-wrap;">${escapeHtml(message)}</td>
      </tr>
    </table>
    <hr style="margin-top:24px; border:none; border-top:1px solid #eee;" />
    <p style="font-size:12px; color:#aaa;">Enviado via institutoitinerante.com.br</p>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'site@institutoitinerante.com.br',
        to: ['contato@institutoitinerante.com.br'],
        reply_to: email,
        subject: `[Site] Nova mensagem de ${name}`,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('Resend API error:', errData);
      return new Response(JSON.stringify({ error: 'Failed to send email', details: errData }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Contact endpoint error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
