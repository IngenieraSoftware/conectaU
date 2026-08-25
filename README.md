# ConectaU — Proyecto de práctica Scrum (con Supabase)

Mini portal de comunicación (foro/Twitter simplificado), hecho como práctica de equipo (Scrum + Git) antes del proyecto real de Ingeniería de Software.

## Stack
- Frontend: React + Vite
- Backend / Base de datos / Auth: **Supabase** (PostgreSQL + Auth + API listos, sin servidor propio)

## Estructura
```
database/   -> schema.sql (se ejecuta una sola vez en Supabase)
frontend/   -> React + Vite, habla directo con Supabase
```

## Paso 1 — Crear el proyecto en Supabase (lo hace UNA persona, después comparte los datos)
1. Entrar a https://supabase.com y crear cuenta/proyecto (plan gratis).
2. Ir a **SQL Editor** → **New query** → pegar el contenido de `database/schema.sql` → **Run**.
3. Ir a **Authentication → Providers → Email** y desactivar "Confirm email" (para no complicarse con correos reales durante la práctica).
4. Ir a **Project Settings → API** y copiar:
   - `Project URL`
   - `anon public key`
5. Compartir esos dos datos con todo el equipo (por el grupo de WhatsApp o en el README interno) — **todos usan el mismo proyecto**, no crean uno cada uno.

## Paso 2 — Cada integrante levanta el frontend
```
cd frontend
npm install
cp .env.example .env
```
Editar `.env` y pegar ahí el `Project URL` y el `anon key` que compartió el paso 1.
```
npm run dev
```
Queda corriendo en `http://localhost:5173`.

## Flujo de trabajo en Git
Ver `ASIGNACIONES.md` para la división de historias de usuario y el flujo de ramas.

## Alcance de esta práctica
Incluye: registro, login, cerrar sesión, crear publicación, ver publicaciones (feed), responder publicación, borrar publicación.
No incluye: likes, seguidores, mensajes privados, imágenes, notificaciones.

## Nota sobre seguridad
Con Supabase, la seguridad ya no se revisa con un middleware propio: se controla con **Row Level Security (RLS)**, políticas escritas en `database/schema.sql` (por ejemplo: "solo el dueño de una publicación puede borrarla"). Si alguien necesita agregar una regla nueva, se agrega ahí, como una migración más.
