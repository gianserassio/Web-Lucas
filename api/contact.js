import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre, empresa, email, telefono, servicio, mensaje } = req.body;

  if (!nombre || !empresa || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    await resend.emails.send({
      from: 'Formulario Web <onboarding@resend.dev>',
      to: 'ls.servicioshys@gmail.com',
      replyTo: email,
      subject: `Nuevo contacto de ${nombre} – ${empresa}`,
      html: `
        <h2>Nuevo mensaje desde el formulario de contacto</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:600px">
          <tr><td><strong>Nombre</strong></td><td>${nombre}</td></tr>
          <tr><td><strong>Empresa / Rubro</strong></td><td>${empresa}</td></tr>
          <tr><td><strong>Email</strong></td><td>${email}</td></tr>
          <tr><td><strong>Teléfono</strong></td><td>${telefono || '–'}</td></tr>
          <tr><td><strong>Servicio de interés</strong></td><td>${servicio || '–'}</td></tr>
          <tr><td><strong>Mensaje</strong></td><td>${mensaje}</td></tr>
        </table>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error al enviar email:', error);
    return res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
}
