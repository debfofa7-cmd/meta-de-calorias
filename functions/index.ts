/* Cloud Function (TypeScript) - exemplo mínimo
 - Recebe: POST { image_base64?: string, storage_path?: string, userContext: { uid } }
 - Retorna: JSON com estimativa nutricional
*/
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import fetch from "node-fetch";

admin.initializeApp();
const db = admin.firestore();
const visionClient = new ImageAnnotatorClient();

const OPENAI_KEY = process.env.OPENAI_API_KEY!;
const NUTRITION_COLLECTION = process.env.NUTRITION_COLLECTION || "nutrition";

async function callVisionFromBuffer(buffer: Buffer) {
  const [result] = await visionClient.objectLocalization({ image: { content: buffer.toString("base64") } });
  // fallback to label detection if needed
  const objects = (result.localizedObjectAnnotations || []).map(o => ({
    name: o.name?.toLowerCase(),
    score: o.score,
    bbox: o.boundingPoly?.normalizedVertices
  }));
  return objects;
}

async function callOpenAI(prompt: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type":"application/json", "Authorization": `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "Você é um parser JSON..." }, { role: "user", content: prompt }],
      temperature: 0.0,
      max_tokens: 800
    })
  });
  const json = await res.json();
  const reply = json.choices?.[0]?.message?.content;
  return reply;
}

export const analyzeMealImage = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") return res.status(405).send("Use POST");
    const { image_base64, storage_path, userContext } = req.body;
    let buffer: Buffer | null = null;
    if (image_base64) buffer = Buffer.from(image_base64, "base64");
    else if (storage_path) {
      const bucket = admin.storage().bucket();
      const file = bucket.file(storage_path);
      const [contents] = await file.download();
      buffer = contents;
    } else {
      return res.status(400).json({ error: "image_base64 ou storage_path é obrigatório" });
    }

    // 1) Vision
    const objects = await callVisionFromBuffer(buffer);

    // 2) Buscar dados nutricionais para labels
    const labels = objects.map(o => o.name);
    const nutritionDocs = await Promise.all(labels.map(async label => {
      const q = await db.collection(NUTRITION_COLLECTION).where("aliases", "array-contains", label).limit(1).get();
      if (!q.empty) return q.docs[0].data();
      // fallback: buscar por name igual
      const q2 = await db.collection(NUTRITION_COLLECTION).where("name", "==", label).limit(1).get();
      return q2.empty ? null : q2.docs[0].data();
    }));

    // 3) Montar prompt para OpenAI com labels + area% + nutrition snippets
    const visionPayload = objects.map((o, i) => ({ name: o.name, confidence: o.score, area_pct: 0.0, nutrition: nutritionDocs[i] || null }));
    const prompt = `Receba a seguinte lista de objetos detectados: ${JSON.stringify(visionPayload)}.
Estime peso por item em gramas a partir de area_pct (se nenhum valor, use heurística padrão), calcule kcal/protein/carbs/fat usando os nutrition snippets quando presentes. Retorne apenas JSON com items[] e total{}.`;

    const openaiResponse = await callOpenAI(prompt);
    // tentar parse JSON
    let parsed;
    try { parsed = JSON.parse(openaiResponse); }
    catch (e) {
      return res.status(500).json({ error: "Resposta OpenAI não-JSON", raw: openaiResponse });
    }

    // 4) (Opcional) Salvar análise em Firestore/photos...
    // TODO: salve se necessário

    return res.json({ ok: true, analysis: parsed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
});
