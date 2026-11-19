# Conectar a Mysterium (Fase 5)

> **Estado (19/11/2026):** proyecto Supabase `arkhe` (`lkgkjjpudabqwezokrxe`, región São Paulo) creado; contador de mensajes instalado (solo modificable por la función); función `mysterium` desplegada; la app de producción ya apunta al proyecto (`.env.production`). **Faltan dos pasos manuales en el panel:** activar *Anonymous sign-ins* y cargar el secreto `ANTHROPIC_API_KEY`.
>
> La función lee las fuentes (`corpus.json`) desde GitHub, fijadas a un commit. Si editas el contenido: `npm run build:corpus`, sube el cambio y actualiza `CORPUS_URL` en `index.ts` (o el secreto `CORPUS_URL`) con el nuevo commit antes de volver a desplegar.

Mysterium responde a través de un servidor intermedio en **Supabase**, que guarda la clave de la IA y controla el límite de **15 mensajes por día y por persona**. La app nunca ve la clave.

| Modo | Modelo | Por qué |
|---|---|---|
| Lección | `claude-haiku-5-5` | Preguntas directas, el más económico |
| Socrático | `claude-sonnet-5-5` | Guiar con preguntas requiere más criterio |
| Consultante | `claude-sonnet-5-5` | Sostener el personaje del caso |
| Devolución de lecturas | `claude-sonnet-5-5` | Evaluar con criterios y explicar |

Las respuestas de Sonnet usan el respaldo automático de Anthropic ante rechazos de seguridad (`fallbacks: "default"`). Haiku no lo admite: si rechaza, la app muestra un aviso para reformular.

## 1. Cuenta de Anthropic (la IA)

1. Crea una cuenta en <https://console.anthropic.com> y agrega un método de pago.
2. En **Settings → Limits**, fija un **tope de gasto mensual** (por ejemplo, US$20 para empezar).
3. En **API Keys**, crea una clave llamada `arkhe-mysterium`. Cópiala: la usarás en el paso 3. **No la pegues en el chat ni en la app.**

## 2. Proyecto de Supabase (el servidor)

1. Crea una cuenta en <https://supabase.com> y un proyecto nuevo (plan gratuito), por ejemplo `arkhe`.
2. En **Authentication → Sign In / Providers**, activa **Anonymous sign-ins**. Así cada persona tiene su contador sin crear cuenta.
3. En **Project Settings → API**, anota la **Project URL** y la **anon public key** (esta sí es pública; va en la app).

## 3. Instalar la base de datos y la función

Con la [CLI de Supabase](https://supabase.com/docs/guides/cli) instalada, desde la carpeta del proyecto:

```bash
supabase login
supabase link --project-ref TU_PROJECT_REF
supabase db push
supabase secrets set ANTHROPIC_API_KEY=la-clave-del-paso-1
supabase functions deploy mysterium
```

- `db push` crea la tabla `tutor_usage` y las funciones que cuentan los mensajes.
- Opcional: `supabase secrets set TUTOR_DAILY_LIMIT=15` para cambiar el límite sin tocar código, y `ALLOWED_ORIGIN=https://tu-dominio` para aceptar pedidos solo desde la app publicada.

## 4. Conectar la app

Crea un archivo `.env.local` (no se sube a GitHub) a partir de `.env.example`:

```
VITE_SUPABASE_URL=https://TU_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=la-anon-public-key
```

Luego `npm run build`. Sin estas dos variables, la app muestra «Mysterium todavía no está conectado» y no envía nada.

## 5. Probar la calidad antes de abrirlo al público

`evals/mysterium-cases.json` tiene 30 preguntas difíciles: historia, autores inventados, citas falsas, intentos de saltarse las reglas, consultantes y lecturas para evaluar. Para correrlas (cuesta alrededor de US$0,50 por corrida):

```bash
ANTHROPIC_API_KEY=... npm run eval:mysterium
```

Genera `evals/report-<fecha>.md` con cada respuesta y el veredicto. Para comparar el modo Lección con Sonnet en lugar de Haiku:

```bash
ANTHROPIC_API_KEY=... npm run eval:mysterium -- --teacher-model=claude-sonnet-5-5
```

## Cuando cambies el contenido

Si editas cartas, lecciones o casos, regenera las fuentes de Mysterium y vuelve a desplegar:

```bash
npm run build:corpus
supabase functions deploy mysterium
```

Una prueba automática avisa si el corpus quedó desactualizado.
