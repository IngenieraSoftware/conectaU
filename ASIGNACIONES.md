# Asignación de tareas — Sprint 1 (11 devs, con Supabase)

Como el backend lo resuelve Supabase, el trabajo de "backend" pasa a ser configuración de base de datos + políticas RLS, y el resto es 100% frontend consumiendo Supabase.

## Fase 0 — Setup inicial (bloqueante, se hace primero)
**2 personas** (idealmente Aracely + 1 más, porque después coordinan integración):
- Crear el proyecto en Supabase, correr `database/schema.sql`, desactivar confirmación de email.
- Compartir `Project URL` y `anon key` con el equipo.
- Rama: `setup/supabase-config`

Mientras tanto, el resto del equipo clona el repo e instala dependencias del frontend.

## Fase 1 — Historias de Usuario (9 personas restantes + las 2 de Fase 0 se reincorporan)

| HU | Encargados | Rama |
|---|---|---|
| HU01 Registro | 2 devs | `feature/hu01-registro` |
| HU02+HU06 Login/Logout | 2 devs (se suman las 2 de Fase 0, que ya conocen Auth) | `feature/hu02-login-logout` |
| HU04 Ver publicaciones (Feed) | 2 devs | `feature/hu04-feed` |
| HU03 Crear publicación | 1 dev | `feature/hu03-crear-publicacion` |
| HU05 Responder publicación | 1 dev | `feature/hu05-responder` |
| HU07 Borrar publicación | 1 dev | `feature/hu07-borrar` |

Total: 2 (setup) + 2 + 2 + 2 + 1 + 1 + 1 = **11**.

## Flujo de Git sugerido
1. Clonar el repo.
2. Crear rama desde `main`: `git checkout -b feature/huXX-nombre`
3. Commits pequeños y descriptivos.
4. `git push origin feature/huXX-nombre`
5. Abrir Pull Request en GitHub.
6. Alguien del equipo (rotar el revisor) aprueba.
7. Merge a `main`.

## Orden recomendado
1. Fase 0 (Supabase) — bloquea todo lo demás.
2. HU01 Registro + HU02/HU06 Login-Logout (todo depende de esto).
3. HU04 Feed.
4. HU03, HU05, HU07 (pueden ir en paralelo una vez que el feed y el login existen).
