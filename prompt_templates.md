# Templates de prompts (em Português)

1) Prompt system (instrução geral)
Você é um assistente que converte a saída da API de visão (labels e áreas) ou descrições em texto em estimativas de peso e nutrientes. Responda apenas em JSON válido com o formato especificado. Use os valores da base nutricional fornecida.

2) Prompt user (foto)
Imagem_id: {image_id}
Vision_labels: {labels array com name, confidence, bbox_area_pct}
Plate_area_cm2_est: {opcional}
Nutrition_db: {pequenos trechos do DB para cada label}

Instrução:
A partir das labels e porcentagens de área do prato, estime peso (g) por item usando suposições razoáveis (explique em assumption) e calcule kcal, proteínas, carboidratos, gorduras e fibras por item. Retorne JSON com campos:
{
  "image_id": "...",
  "items":[
    {"name":"arroz","weight_g":200,"kcal":260,"protein_g":5.4,"carbs_g":56,"fat_g":0.8,"confidence":0.96,"assumption":"..."}
  ],
  "total":{"kcal":780,"protein_g":42,"carbs_g":83,"fat_g":24},
  "explanation":"..."
}

3) Prompt user (texto)
Texto: "Comi 3 ovos, 200 g de arroz e 150 g de frango."
Instrução:
Parseie unidades e quantidades, normalize para gramas e calcule macros usando a base nutricional. Retorne JSON com items e totals.

Exemplo de resposta esperada:
{
 "source":"text",
 "items":[ {"name":"ovo","qty":3,"weight_g":150,"kcal":225,"protein_g":18, ... } ],
 "total":{ "kcal": ... }
}
