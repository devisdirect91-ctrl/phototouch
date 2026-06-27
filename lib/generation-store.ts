// Store en mémoire pour passer les inputs de génération de /create à /processing.
// La navigation client de Next préserve l'état des modules (pas de reload),
// donc on évite de sérialiser les fichiers dans l'URL ou le sessionStorage.

export type PendingGeneration = {
  source: File;
  reference: File | null;
  prompt: string;
};

let pending: PendingGeneration | null = null;

export function setPendingGeneration(value: PendingGeneration) {
  pending = value;
}

export function getPendingGeneration(): PendingGeneration | null {
  return pending;
}

export function clearPendingGeneration() {
  pending = null;
}
