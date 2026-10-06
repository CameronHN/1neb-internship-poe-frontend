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
- `npm test`: Vitest unit tests (`vitest run`; `npm run test:watch` to watch). Tests sit next to the helpers as `src/helpers/<name>.test.ts` and run in Node, so they cover plain functions, not components. CI runs them after lint.
- `npm run preview`

## Architecture

**Backend coupling.** `src/constants/apiConstants.ts` hardcodes `https://localhost:7165` (`/api` and `/api/auth`). There is no env-based config; changing the backend URL means editing that file.

**Auth is cookie-based.** Every `fetch` in `src/services/*` passes `credentials: "include"`, and no token is stored client-side. `AuthContext` (`src/contexts/AuthContext.tsx`) calls `GET /api/auth/me` on mount to restore the session, and `login`/`register` follow up with `userService.getUserById` to populate `user`. `ProtectedRoute` (defined in `App.tsx`) redirects to `/login` when unauthenticated and shows a loading state while `isLoading`. Logout must POST a JSON body (`{}`): the API rejects a bodyless logout (415) so another site cannot log users out, and it ends the user's sessions on every device. `AuthContext.logout` therefore only clears `user` once the request succeeds.

**API errors.** Services throw `new Error(await readApiError(response, "Failed to …"))` (`src/helpers/apiError.ts`), which reads the message from the API's different error shapes (`{ error: { message } }`, validation `errors`, plain text) and falls back to the given text. Use it for any new `fetch` so users see the API's own message.

**Routing and app shell (`App.tsx`).** Theme state (light/dark) lives in `App` and drives both `FluentProvider` and a hand-styled gradient background wrapper, so theme-dependent colors are inline styles rather than Fluent tokens. Routes are flat: public (`/`, `/login`, `/register`, `/demo`) and protected (`/builder`, `/saved`, `/add-<entity>`, `/update-<entity>/:id`). Each new page needs a route here, wrapped in `ProtectedRoute`.

**Resume entity pattern.** Each resume section (Skill, Certification, Education, WorkExperience, ProfessionalSummary, ResumeTitle, SocialMedia/ProfessionalLink) repeats the same four-layer structure:

- `types/<entity>Types.ts`: request and response shapes
- `services/<entity>Service.ts`: a class with a singleton export (`export const xService = new XService()`), wrapping the REST endpoints (`/Skill/add`, `/Skill/patch`, `/Skill/delete`, `/Skill/{id}`, and so on)
- `components/<Entity>/<Entity>Form.tsx`: one form taking `mode: "add" | "update"`; the `Add…Form` and `Update…Form` files are thin wrappers that fix the mode. In add mode the form manages a dynamic list of rows; in update mode it loads a single record by id
- `pages/<Entity>/Add…Page.tsx` and `Update…Page.tsx`: set the tab title with `usePageTitle` and render the form

When adding or changing an entity, update all four layers and the routes in `App.tsx`.

**Resume builder (`pages/Builder/ResumeBuilderPage.tsx`, ~1500 lines).** Loads everything via `resumeApiService.getUserResumeDetails()`, lets the user select items per section, then POSTs a `ResumeSelectionRequest` (IDs per section) to `/Resume/get-resume`, which returns the PDF as a `Blob`. It can also save a selection through `savedResumeService` (`/SavedResume/*`). The UI warns above 20 selected items (a recommendation, not enforced). The `order` fields in the selection request are placeholders: hardcoded to 0 or 2 with a TODO, because ordering is not implemented in the UI. A saved resume holds at most 20 responsibilities per experience, which `useSaveResume` checks before sending, and 50 saved resumes per user, which the API enforces.

**Demo page (`pages/Demo/DemoPage.tsx`).** The unauthenticated `/demo` POSTs a `ResumeData` (`types/demoTypes.ts`) built by `buildDemoRequest` (`helpers/demoRequest.ts`) to `/Resume/create-pdf`. The API enforces the demo quota per client IP and answers 429 with a `Retry-After` header; the page stores that as `demoBlockedUntil` (`helpers/demoQuota.ts`) and disables the button until it passes. The local `demoUsageCount` is display only, because clearing site data resets it. The API accepts no more than the page's fixed rows (4 skills, 2 links, 2 experiences with 2 responsibilities, 2 education, 2 certifications, under 32 KB), so adding rows needs a matching change to `DemoResumeLimits` in the backend. Links go through `normaliseLink` (`helpers/linkHelpers.ts`) because the PDF only makes absolute `http(s)` links clickable.

**Styling.** Shared style objects live in `src/styles/constants/*.ts` and are applied as inline `style` props; global CSS is in `src/styles/index.css` and `form.css`.
