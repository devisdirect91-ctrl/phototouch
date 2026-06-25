import { PARENTAL_CONSENT_AGE } from "@/lib/constants";

/** Âge en années révolues à partir d'une date de naissance. */
export function computeAge(
  birthDate: Date | string,
  now: Date = new Date(),
): number {
  const b = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  let age = now.getFullYear() - b.getFullYear();
  const monthDiff = now.getMonth() - b.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < b.getDate())) {
    age -= 1;
  }
  return age;
}

/** Un consentement parental est-il requis (moins de 15 ans) ? */
export function requiresParentalConsent(
  birthDate: Date | string,
  now?: Date,
): boolean {
  return computeAge(birthDate, now) < PARENTAL_CONSENT_AGE;
}

/** Date de naissance valide (réaliste et dans le passé) ? */
export function isValidBirthDate(birthDate: Date | string): boolean {
  const b = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  if (Number.isNaN(b.getTime())) return false;
  const age = computeAge(b);
  return age >= 0 && age <= 120;
}
