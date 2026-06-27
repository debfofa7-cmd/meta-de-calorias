# Esquema Firestore sugerido

Coleções principais:

users/{uid}
- name: string
- email: string
- birthdate: timestamp
- sex: "male"|"female"|"other"
- height_cm: number
- initial_weight_kg: number
- activity_level: "sedentary"|"light"|"moderate"|"active"|"very_active"
- objective: "engordar_rapido"|"ganhar_massa_magra"
- daily_targets: { kcal: number, protein_g: number, carbs_g: number, fat_g: number }
- settings: { units: "metric"|"imperial", reminders: {...} }

meals/{uid}/{date}/{meal_id}
- timestamp: timestamp
- meal_type: "breakfast"|"snack"|"lunch"|"pre"|"post"|"dinner"
- items: [{ name, qty_g, kcal, protein_g, carbs_g, fat_g, source: "photo"|"text"|"manual", image_ref }]
- total_kcal: number
- note: string

water_logs/{uid}/{date}
- entries: [{ ts, volume_ml }]

weights/{uid}
- entries: [{ ts, weight_kg, fat_pct, muscle_kg }]

photos/{uid}/{date}/{photo_id}
- storage_path: string
- ts: timestamp
- type: "meal"|"progress"
- processed: boolean
- analysis: { total_kcal, items: [...] }

workouts/{uid}/{date}
- template_id
- exercises: [{ name, sets, reps, weight_kg }]
- completed: bool

nutrition/{food_id}
- aliases: [ "arroz", "arroz branco", ... ]
- kcal_per_100g, protein_100g, carbs_100g, fat_100g, fiber_100g
- source: "TACO"|"USDA"
- density_g_per_ml (opcional)
