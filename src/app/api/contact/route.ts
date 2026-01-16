import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Nom trop court').max(100),
  email: z.string().email('Email invalide'),
  subject: z.string().min(1, 'Sujet requis'),
  message: z.string().min(10, 'Message trop court').max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    // Envoyer l'email via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const EMAIL_FROM = process.env.EMAIL_FROM || 'MediTrouve <noreply@meditrouve.fr>';
    const ADMIN_EMAIL = 'contact@meditrouve.fr'; // Email de destination

    if (RESEND_API_KEY && RESEND_API_KEY !== 're_...') {
      const subjectMap: Record<string, string> = {
        question: 'Question générale',
        bug: 'Signalement de bug',
        suggestion: 'Suggestion',
        subscription: 'Question abonnement',
        data: 'Demande RGPD',
        partnership: 'Partenariat / Presse',
        other: 'Autre',
      };

      const emailSubject = `[Contact] ${subjectMap[subject] || subject} - ${name}`;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: [ADMIN_EMAIL],
          reply_to: email,
          subject: emailSubject,
          html: `
            <h2>Nouveau message de contact</h2>
            <p><strong>De:</strong> ${name} (${email})</p>
            <p><strong>Sujet:</strong> ${subjectMap[subject] || subject}</p>
            <hr />
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr />
            <p><small>Ce message a été envoyé depuis le formulaire de contact d'MediTrouve.</small></p>
          `,
        }),
      });
    } else {
      // En dev, juste logger
      console.log('Contact form submission:', { name, email, subject, message });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
