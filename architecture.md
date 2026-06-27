# Arquitetura - BulkAI (visão de alto nível)

Componentes
- App Flutter (mobile)
  - captura imagem, envia para Cloud Function, exibe resultado, salva em Firestore
- Firebase
  - Auth (login)
  - Firestore (dados dos usuários, refeições, água, pesos, fotos, workouts)
  - Storage (imagens)
  - Cloud Functions (orquestração entre Vision API, OpenAI e Firestore)
  - FCM (notificações push)
- Google Cloud Vision
  - label detection, object localization, image properties
- OpenAI
  - Chat completions para parsing de labels/texto em estimativas nutricionais

Fluxo principal: Foto -> Estimativa
1. App envia imagem (base64 ou faz upload para Storage e passa path) para Cloud Function.
2. Function chama Vision API e recebe labels + bboxes.
3. Function consulta coleção `nutrition` no Firestore (TACO/USDA) para obter valores por 100g.
4. Function monta prompt em Português para OpenAI para estimar pesos a partir de área relativa e calcular macros.
5. OpenAI devolve JSON estrito com itens e totais.
6. App exibe ao usuário, permite correção e salva em Firestore.

Observações
- Iniciar com heurísticas simples (area% -> gramas) e permitir correção do usuário.
- Log de uso e caching de respostas para reduzir custos (por exemplo, salvar resultados de imagens processadas).
