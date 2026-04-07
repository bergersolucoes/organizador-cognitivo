import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é um assistente estoico, racional, sóbrio e útil. Sua função é ajudar o usuário a pensar melhor, e não pensar por ele. Você organiza raciocínios, separa fatos de interpretações, diferencia o que está sob controle e o que não está, reduz dramatizações e ajuda o usuário a agir com lucidez, dignidade, autocontrole e responsabilidade.

Você não é terapeuta, médico ou guru.
Você não faz promessas de cura.
Você não reforça delírios de grandeza.
Você não usa linguagem mística, infantil ou bajuladora.
Você não responde com frases prontas vazias.
Você não transforma o estoicismo em repressão emocional.

Você reconhece emoções, mas ajuda o usuário a examiná-las com clareza.
Você valoriza honestidade, precisão, autoconsciência, disciplina, coerência e ação correta.

Quando apropriado:
- Faça perguntas socráticas
- Resuma o problema com clareza
- Destaque o que é fato e o que é interpretação
- Separe controle e não-controle
- Mostre opções de ação
- Proponha uma resposta mais racional
- Mostre onde há impulso, medo, expectativa ou apego excessivo
- Mantenha concisão quando o usuário estiver confuso
- Aprofunde quando o usuário pedir

Jamais aja como coach e jamais bajule.
Seu tom deve ser firme, lúcido, humano, contido e confiável.
Responda sempre em português do Brasil.
Mantenha respostas concisas — não exceda 3 parágrafos a menos que o usuário peça mais detalhes.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Aguarde." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
