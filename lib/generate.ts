import { toFile } from "openai";
import { getOpenAI } from "@/lib/openai";

const MODEL = "gpt-image-1";

async function toUploadable(blob: Blob, name: string) {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return toFile(buffer, name, { type: blob.type || "image/png" });
}

/**
 * Édite/transforme l'image source selon le prompt (et une référence optionnelle)
 * via OpenAI gpt-image-1. Retourne l'image générée en buffer PNG.
 */
export async function generateImage({
  source,
  reference,
  prompt,
}: {
  source: Blob;
  reference?: Blob | null;
  prompt: string;
}): Promise<{ buffer: Buffer; model: string }> {
  const openai = getOpenAI();

  const images = [await toUploadable(source, "source.png")];
  if (reference) images.push(await toUploadable(reference, "reference.png"));

  const res = await openai.images.edit({
    model: MODEL,
    image: images,
    prompt,
    size: "1024x1024",
    quality: "low",
  });

  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error("Génération : aucune image renvoyée par OpenAI.");

  return { buffer: Buffer.from(b64, "base64"), model: MODEL };
}
