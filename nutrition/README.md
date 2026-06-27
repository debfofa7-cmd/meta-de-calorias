# Importando base nutricional (TACO / USDA) para Firestore

Formato de documento esperado por alimento:
{
  "name": "arroz branco cozido",
  "aliases": ["arroz", "arroz branco", "arroz cozido"],
  "kcal_per_100g": 130,
  "protein_100g": 2.7,
  "carbs_100g": 28.0,
  "fat_100g": 0.3,
  "fiber_100g": 0.4,
  "density_g_per_ml": 0.9,
  "source": "TACO"
}

Importação sugerida:
- Converter CSV TACO/USDA para JSON
- Rodar script Node.js que faz batchWrite para a coleção `nutrition`
- Criar aliases manuais para sinônimos comuns
