import { GoogleGenAI, Type } from '@google/genai';
import { BrandTokens, FontFamilyOption } from '../types';

export interface GeneratedBrandConcept {
  brandName: string;
  tagline: string;
  stylePresetName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceTint: string;
  headingFont: FontFamilyOption;
  bodyFont: FontFamilyOption;
  radiusPx: number;
  rationale: string;
}

export async function generateBrandDirectionWithAI(prompt: string): Promise<GeneratedBrandConcept> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [
        {
          text: `Você é um Diretor Executivo de Branding e Design Systems (nível Linear, Stripe, Apple).
Com base no briefing do usuário: "${prompt}", gere uma direção de identidade visual completa em JSON.
Escolha headingFont e bodyFont estritamente entre: "Plus Jakarta Sans", "Inter", "Space Grotesk", "Syne", "Instrument Serif", "Fraunces", "DM Sans".
Cores devem ser códigos HEX vibrantes e sofisticados (ex: #E11D48, #4F46E5).`,
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brandName: { type: Type.STRING },
          tagline: { type: Type.STRING },
          stylePresetName: { type: Type.STRING },
          primaryColor: { type: Type.STRING },
          secondaryColor: { type: Type.STRING },
          accentColor: { type: Type.STRING },
          surfaceTint: { type: Type.STRING },
          headingFont: { type: Type.STRING },
          bodyFont: { type: Type.STRING },
          radiusPx: { type: Type.INTEGER },
          rationale: { type: Type.STRING },
        },
        required: [
          'brandName',
          'tagline',
          'stylePresetName',
          'primaryColor',
          'secondaryColor',
          'accentColor',
          'surfaceTint',
          'headingFont',
          'bodyFont',
          'radiusPx',
          'rationale',
        ],
      },
    },
  });

  const text = response.text || '{}';
  return JSON.parse(text) as GeneratedBrandConcept;
}

export function applyGeneratedConceptToTokens(
  current: BrandTokens,
  concept: GeneratedBrandConcept
): BrandTokens {
  const r = Math.max(0, Math.min(32, concept.radiusPx));
  const radiusPreset =
    r === 0 ? 'none' : r <= 6 ? 'sm' : r <= 12 ? 'md' : r <= 18 ? 'lg' : r <= 24 ? 'xl' : 'full';

  return {
    ...current,
    brandName: concept.brandName || current.brandName,
    tagline: concept.tagline || current.tagline,
    stylePresetName: concept.stylePresetName || 'Custom AI',
    primaryColor: concept.primaryColor?.startsWith('#') ? concept.primaryColor : current.primaryColor,
    secondaryColor: concept.secondaryColor?.startsWith('#')
      ? concept.secondaryColor
      : current.secondaryColor,
    accentColor: concept.accentColor?.startsWith('#') ? concept.accentColor : current.accentColor,
    surfaceTint: concept.surfaceTint?.startsWith('#') ? concept.surfaceTint : current.surfaceTint,
    headingFont: concept.headingFont || current.headingFont,
    bodyFont: concept.bodyFont || current.bodyFont,
    radiusPx: r,
    radius: radiusPreset,
  };
}
