# BulkAI / MassGain AI - MVP

Descrição
BulkAI é um app para quem quer ganhar peso e massa muscular de forma saudável. Conta calorias por foto e por texto, calcula metas diárias, controla água, registra peso e fotos de evolução, e oferece sugestões de refeições e treinos com suporte de IA.

Tech stack
- Frontend: Flutter (iOS + Android)
- Backend: Firebase (Auth, Firestore, Storage, Cloud Functions, FCM)
- Visão computacional: Google Cloud Vision API (ou ML custom)
- IA conversacional e inferência: OpenAI API (Chat Completions)
- Banco nutricional: TACO (BR) / USDA (opcional) importados para Firestore/BigQuery

Como usar este repositório (setup rápido)
1. Criar projeto Firebase e ativar:
   - Authentication (Email, Google)
   - Firestore (modo produção)
   - Storage
   - Cloud Functions
   - Cloud Messaging (opcional)
2. Criar credenciais Google Cloud e habilitar Vision API.
3. Exportar variáveis de ambiente para Cloud Functions:
   - OPENAI_API_KEY
   - GOOGLE_APPLICATION_CREDENTIALS (ou configurar no ambiente do GCP)
   - NUTRITION_COLLECTION (nome da coleção Firestore com a base nutricional)
4. Deploy Cloud Functions:
   - cd functions && npm install && npm run build && firebase deploy --only functions
5. Rodar app Flutter:
   - cd flutter_app && flutter pub get && flutter run

Arquivos principais
- README.md (este)
- architecture.md (arquitetura)
- firestore_schema.md (esquema Firestore)
- functions/index.ts (Cloud Function exemplo)
- flutter_app/lib/main.dart (exemplo Flutter mínimo)
- firestore.rules (regras de segurança)
- prompt_templates.md (prompts para OpenAI)
- nutrition/ (instruções para importar TACO/USDA)

Cronograma estimado (MVP)
- 0–2 semanas: protótipo UI, modelagem de dados, infra básica
- 2–6 semanas: integração Vision + OpenAI, Cloud Functions, endpoints
- 4–8 semanas: Flutter screens (captura, resultado foto, salvar, dashboard) + notificações

Licença
MIT
