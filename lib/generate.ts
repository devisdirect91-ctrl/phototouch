import sharp from "sharp";
import { toFile } from "openai";
import { getOpenAI } from "@/lib/openai";

// Modèle configurable (ex: "gpt-image-1" ou "gpt-image-1-mini" moins cher).
const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
// Qualité configurable (low | medium | high). low = le moins cher.
const QUALITY =
  (process.env.OPENAI_IMAGE_QUALITY as "low" | "medium" | "high") || "low";

type Size = "1024x1024" | "1024x1536" | "1536x1024";

/** Choisit le format de sortie le plus proche du ratio de la photo source. */
function pickSize(width?: number, height?: number): Size {
  if (!width || !height) return "1024x1024";
  const ratio = width / height;
  if (ratio <= 0.8) return "1024x1536"; // portrait
  if (ratio >= 1.25) return "1536x1024"; // paysage
  return "1024x1024"; // ~carré
}

async function toBuffer(blob: Blob) {
  return Buffer.from(await blob.arrayBuffer());
}

/**
 * Édite/transforme l'image source selon le prompt (et une référence optionnelle)
 * via OpenAI. Le format de sortie suit le ratio de la photo source.
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

  const sourceBuffer = await toBuffer(source);
  let width: number | undefined;
  let height: number | undefined;
  try {
    const meta = await sharp(sourceBuffer).metadata();
    width = meta.width;
    height = meta.height;
  } catch {
    // métadonnées indisponibles → format carré par défaut
  }
  const size = pickSize(width, height);

  const images = [
    await toFile(sourceBuffer, "source.png", {
      type: source.type || "image/png",
    }),
  ];
  if (reference) {
    images.push(
      await toFile(await toBuffer(reference), "reference.png", {
        type: reference.type || "image/png",
      }),
    );
  }

  const res = await openai.images.edit({
    model: MODEL,
    image: images,
    prompt,
    size,
    quality: QUALITY,
  });

  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error("Génération : aucune image renvoyée par OpenAI.");

  return { buffer: Buffer.from(b64, "base64"), model: MODEL };
}
