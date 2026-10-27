# The writing room

A self-paced, practice-heavy article-writing course and personal workbook. No account, database, AI API, or paid runtime service is required.

## Run locally

Use Node.js 20.9 or newer (tested with Node 24).

```sh
npm ci
npm run dev
```

Open <http://localhost:3000>. Keep using the same browser and URL to access the same saved workbook.

For a production run:

```sh
npm run build
npm start
```

## Deploy to Vercel

1. Push this directory to a Git repository and import it as a Vercel project.
2. Select the Next.js framework preset. Use the default build command (`npm run build`) and output settings.
3. Deploy. No environment variables, API keys, or database are needed. Learners can use the deployed website without accounts.

Writing lives in the learner’s browser, not in the deployment. A new domain, browser, port, or device has separate storage: export a backup from the old location and import it at the new one. Vercel hosting management is separate from learner access.

## Course

The course contains 64 individually authored focused lessons, five workshops, six fresh checkpoints, an unassisted baseline, four independent portfolio assignments, and a portfolio review. It progresses by skill rather than time. The 10 teaching areas cover sentences, paragraphs, planning, article structure, explanation, evidence and research, argument, reader interest, style, and revision.

Each focused lesson includes an objective, plain-English explanation, annotated original examples, three varied exercises with hidden hints and samples, skill-specific review questions, revision, optional practice, and a later application. Workshops include planning, drafting, feedback, revision, and reflection. Checkpoints have descriptive rubrics, criterion examples, and targeted practice links. Fictional source packs are explicitly marked. The research workshop and portfolio require learners to find and evaluate real sources themselves; no invented sources are presented as factual research.

Manual completion records activity. There are no automatic quality scores, unlock requirements, mastery claims, streaks, or completion certificates. Feedback requests ask for passage-specific diagnosis and a focused revision attempt before rewritten examples.

Lesson pages open directly with the objective and teaching or assignment. Repeated page routes, preparation boxes, editor instructions, review introductions, and next-step reminders are omitted. Section-level project guidance remains available on the curriculum page.

Follow **Next in the course** for the recommended sequence. **Related practice** contains an optional application link. Browsing does not change the saved course place; writing, marking a page complete, setting the current lesson, or choosing Next does. Continue learning resumes that place or offers its successor after manual completion.

Focused lessons keep short responses beneath their prompts. **Use earlier writing** expands the controls for copying a response or article into the revision area, or carrying ideas into Plan. It appears when earlier writing is available. The source is unchanged, the incoming writing receives a before-revision snapshot, and any displaced current work is preserved in history. Workshops use one main writing area; any older saved step responses remain accessible. Plan, Draft, Feedback, and Reflect retain concise placeholders. **Save revision now** is always visible below the editor.

## Personal practice plan

The **daily checklist** opens directly on Home and at the top of **Practice plan**, with a 90-minute routine or a 30-minute version. Both views share the same saved checks. Practice plan also contains the writing assignments, five training phases, a four-week review, and reading guidance. Decorative examples, introductory slogans, and projected scores are omitted. Phase links lead into the existing curriculum; readiness depends on actual writing rather than elapsed weeks.

Three personal assignments sit alongside the course: revise **Doing Dishes**, write a fresh 250–350-word everyday explanation, and repeat a comparable unassisted explanation every four weeks. They use the same editors, feedback requests, snapshots, and My writing list. Paste the original Doing Dishes or copy it from an existing saved draft; the original text is not bundled. At each four-week review, save dated first-draft and revised snapshots before reusing the writing area. Reviews are initiated by the learner, without scheduled notifications.

Each checklist step opens its working resource: an Orwell essay and a link to the dedicated Writers page, the current lesson, a short writing assignment, the latest main draft, or that draft’s Reflect tab. The Writers page has 38 free reading links arranged across seven writing areas, with search and category filters. Direct lesson links retain the section or writing stage after a reload. The course timetable and course-use instructions expand on request.

Daily checklist entries use the browser’s local calendar date and start fresh the next day. They record activity only and are included in complete backups. The optional `practice` field extends version 1 compatibly: older backups migrate to an empty practice log; malformed practice data is rejected. Imports merge different dates and keep the local entry on a same-date conflict, including an intentional reset. Opening, writing, or completing a personal assignment preserves the curriculum bookmark.

## Saving and recovery

- Working text and Plan / Feedback / Reflect notes autosave immediately to `localStorage` under `writing-room:v1`.
- **Save revision** creates a separate snapshot of all four fields. Comparison shows earlier and current drafts; earlier process notes remain available. Restore first preserves the current working version as a safety snapshot.
- **My writing** opens main drafts, exercises, and optional practice at the correct editor.
- **Backups & storage** exports the complete versioned JSON workbook. Import validates before mutation and merges entries. Conflicting imported working drafts become revision snapshots; local working drafts remain intact.
- Malformed backups are rejected. Unreadable stored data is left intact, with original-data download and explicit recovery from a validated backup. Another tab’s writes pause saving in stale tabs to prevent silent overwrites.
- If browser storage fails or fills, the page warns clearly. In-memory changes can still be downloaded or exported. Keep the tab open until you preserve them. Clearing browser data or private browsing can remove saved work.
- Copy/download produces plain text. A clipboard-denied fallback displays selectable text. A feedback request is only copied; the site does not send it or call an AI service.

Backups are readable, unencrypted files containing personal writing. Store them appropriately. The app makes no analytics or third-party font requests. JavaScript is required for the workbook. This is not an installable offline app; a page must load before local interactions work.

## Checks

```sh
npm run build
npm test
```

The Playwright suite runs against a production server on port 3100 and uses installed Google Chrome. On another machine, install Chrome or run `npx playwright install chromium` and remove `channel: 'chrome'` from `playwright.config.ts` to use Playwright’s browser.

Tests cover content completeness and internal links, all course pages, hidden help, exercise saving and reloads, manual completion and continuation, draft/process snapshots and restoration, feedback request contents, backup round trips and conflict preservation, malformed imports, practice notes, optional-exercise reopening, mobile overflow and keyboard controls, storage failures, corrupted-data recovery, and multi-tab protection. Screenshots are written to ignored `test-results/`.

## Source map

- `content/01-…` through `content/10-…`: the authored lessons, separate from UI.
- `content/studio.ts`: baseline, workshops, fresh checkpoints, and portfolio.
- `content/curriculum.ts`: the learning sequence and index.
- `content/guidance.ts`: optional section-level project guidance for the curriculum.
- `components/Workbook.tsx`: navigation, reading, editors, notebook, and backup UI.
- `lib/workbook.ts`: data schema, backup validation/merge, and feedback-request construction.
- `app/globals.css`: responsive design, reading and focus views, keyboard focus, and print styling.

Content may be edited independently of components. Keep lesson IDs stable so saved writing remains associated with its assignment. When changing the storage schema, add an explicit migration before changing the backup version.

