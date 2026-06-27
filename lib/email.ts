import { Resend } from "resend";

const FROM =
  process.env.RESEND_FROM_EMAIL ?? "PhotoTouch <hello@phototouch.app>";
const APP = process.env.NEXT_PUBLIC_APP_URL ?? "https://phototouch.app";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function button(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;margin-top:20px;background:linear-gradient(135deg,#7C3AED,#3B82F6,#22D3EE);color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:9999px;">${label}</a>`;
}

function layout(heading: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#0A0A0B;font-family:Inter,Arial,sans-serif;color:#F5F5F7;padding:32px 16px;">
  <div style="max-width:480px;margin:0 auto;background:#131316;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:32px;">
    <div style="font-weight:700;font-size:18px;margin-bottom:24px;">Photo<span style="color:#8B5CF6;">Touch</span></div>
    <h1 style="font-size:22px;margin:0 0 12px;color:#F5F5F7;">${heading}</h1>
    <div style="font-size:14px;line-height:1.6;color:#A1A1AA;">${bodyHtml}</div>
  </div>
  <p style="max-width:480px;margin:16px auto 0;font-size:11px;color:#71717A;text-align:center;">Tu reçois cet email car tu as un compte PhotoTouch.</p>
</body></html>`;
}

async function send(to: string, subject: string, html: string) {
  const resend = getResend();
  if (!resend || !to) return;
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (e) {
    console.error("[email] envoi échoué:", e);
  }
}

export function sendWelcomeEmail(to: string) {
  return send(
    to,
    "Bienvenue sur PhotoTouch ✨",
    layout(
      "Bienvenue !",
      `<p>Ton compte est prêt. Importe une photo, décris ta retouche, et laisse l'IA faire le reste.</p>
       <p>Tu profites d'un essai gratuit de 7 jours.</p>
       ${button(`${APP}/create`, "Créer ma première image")}`,
    ),
  );
}

export function sendTrialEndingEmail(to: string, daysLeft: number) {
  const d = `${daysLeft} jour${daysLeft > 1 ? "s" : ""}`;
  return send(
    to,
    `Ton essai gratuit se termine dans ${d}`,
    layout(
      "Ton essai se termine bientôt",
      `<p>Il te reste <strong>${d}</strong> d'essai gratuit. Sans action de ta part, ton abonnement démarrera automatiquement.</p>
       <p>Tu peux gérer ou annuler ton abonnement en un clic.</p>
       ${button(`${APP}/account`, "Gérer mon abonnement")}`,
    ),
  );
}

export function sendPaymentSucceededEmail(to: string) {
  return send(
    to,
    "Paiement confirmé — merci !",
    layout(
      "Paiement confirmé",
      `<p>Merci ! Ton abonnement PhotoTouch est actif. Profite des générations illimitées en haute résolution.</p>
       ${button(`${APP}/create`, "Créer")}`,
    ),
  );
}

export function sendPaymentFailedEmail(to: string) {
  return send(
    to,
    "Problème avec ton paiement",
    layout(
      "Paiement échoué",
      `<p>Nous n'avons pas pu valider ton paiement. Mets à jour ton moyen de paiement pour continuer à profiter de PhotoTouch.</p>
       ${button(`${APP}/account`, "Mettre à jour")}`,
    ),
  );
}

export function sendSubscriptionCanceledEmail(to: string) {
  return send(
    to,
    "Ton abonnement a été annulé",
    layout(
      "Abonnement annulé",
      `<p>Ton abonnement a bien été annulé. Tu peux revenir quand tu veux — tes créations t'attendent.</p>
       ${button(`${APP}/create`, "Revenir")}`,
    ),
  );
}
