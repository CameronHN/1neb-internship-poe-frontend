# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ostentans Resume Creator frontend (portfolio-of-evidence project for the 1Nebula internship). A React 18 + TypeScript + Vite SPA using Fluent UI React components. It talks to a separate C# .NET 8 Web API (repo: `CameronHN/1neb-internship-poe`) that stores resume data and generates PDFs. The backend must be running for anything beyond static pages.

## Commands

Run from the repo root:

- `npm install`
- `npm run dev`: Vite dev server on `http://localhost:5173`
- `npm run build`: `tsc -b && vite build` (the type check is the main correctness gate)
- `npm run lint`: ESLint (flat config, typescript-eslint + react-hooks + react-refresh)
- `npm run preview`

There is no test runner configured.

## Architecture

**Backend coupling.** `src/constants/apiConstants.ts` hardcodes `https://localhost:7165` (`/api` and `/api/auth`). There is no env-based config; changing the backend URL means editing that file.

**Auth is cookie-based.** Every `fetch` in `src/services/*` passes `credentials: "include"`, and no token is stored client-side. `AuthContext` (`src/contexts/AuthContext.tsx`) calls `GET /api/auth/me` on mount to restore the session, and `login`/`register` follow up with `userService.getUserById` to populate `user`. `ProtectedRoute` (defined in `App.tsx`) redirects to `/login` when unauthenticated and shows a loading state while `isLoading`.

**Routing and app shell (`App.tsx`).** Theme state (light/dark) lives in `App` and drives both `FluentProvider` and a hand-styled gradient background wrapper, so theme-dependent colors are inline styles rather than Fluent tokens. Routes are flat: public (`/`, `/login`, `/register`, `/demo`) and protected (`/builder`, `/saved`, `/add-<entity>`, `/update-<entity>/:id`). Each new page needs a route here, wrapped in `ProtectedRoute`.

**Resume entity pattern.** Each resume section (Skill, Certification, Education, WorkExperience, ProfessionalSummary, ResumeTitle, SocialMedia/ProfessionalLink) repeats the same four-layer structure:

- `types/<entity>Types.ts`: request and response shapes
- `services/<entity>Service.ts`: a class with a singleton export (`export const xService = new XService()`), wrapping the REST endpoints (`/Skill/add`, `/Skill/patch`, `/Skill/delete`, `/Skill/{id}`, and so on)
- `components/<Entity>/<Entity>Form.tsx`: one form taking `mode: "add" | "update"`; the `Add…Form` and `Update…Form` files are thin wrappers that fix the mode. In add mode the form manages a dynamic list of rows; in update mode it loads a single record by id
- `pages/<Entity>/Add…Page.tsx` and `Update…Page.tsx`: set the tab title with `usePageTitle` and render the form

When adding or changing an entity, update all four layers and the routes in `App.tsx`.

**Resume builder (`pages/Builder/ResumeBuilderPage.tsx`, ~1500 lines).** Loads everything via `resumeApiService.getUserResumeDetails()`, lets the user select items per section, then POSTs a `ResumeSelectionRequest` (IDs per section) to `/Resume/get-resume`, which returns the PDF as a `Blob`. It can also save a selection through `savedResumeService` (`/SavedResume/*`). The UI warns above 20 selected items (a recommendation, not enforced). The `order` fields in the selection request are placeholders: hardcoded to 0 or 2 with a TODO, because ordering is not implemented in the UI.

**Styling.** Shared style objects live in `src/styles/constants/*.ts` and are applied as inline `style` props; global CSS is in `src/styles/index.css` and `form.css`.
