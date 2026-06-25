import OpenAI from "openai";

let client: OpenAI | null = null;

/** Client OpenAI (serveur uniquement). */
export function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY manquant — configure-le dans .env.local.");
  }
  if (!client) client = new OpenAI({ apiKey });
  return client;
}
