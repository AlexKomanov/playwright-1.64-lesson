# מערך שיעור: מה חדש ב-Playwright 1.64

**פורמט:** סרטון YouTube, כ-27 דקות
**קהל:** אנשי QA ומפתחים שכבר עובדים עם Playwright Test
**גרסה:** 1.64.0 (שוחררה ב-7 באוקטובר 2026), תיקון 1.64.1 (14 באוקטובר 2026). דפדפנים: Chromium 156.0.8078.4, Firefox 157.0, WebKit 27.2

## מטרות השיעור
בסוף השיעור הצופה:
1. ישתמש ב-`locator.within()` כדי לחבר שני לוקייטורים קיימים, כולל שאילתות של עמודה בטבלה.
2. יגדיר פרויקטים עם `default: false`, יריץ `--shuffle` עם seed, ישתמש ב-test locks, ויבין מה השתנה בצילומי מסך (`missing`, WebP).
3. יכתוב טסט "tool contract" לכלי WebMCP בעזרת `page.webmcp`.
4. יכיר את ה-APIs החדשים ואת 4 השינויים השוברים, ויוכל לתכנן שדרוג בטוח.

## הכנה לפני ההקלטה
```bash
git clone https://github.com/AlexKomanov/playwright-1.64-lesson.git
cd playwright-1.64-lesson
npm install
npx playwright install chromium        # נדרש גם firefox/webkit רק כשמריצים את הפרויקטים האלה
npx playwright test                    # ריצת בדיקה: 19 טסטים אמורים לעבור
```
- נפתח את המצגת: `presentation/index.html` בדפדפן (עובד גם מקובץ מקומי). `F` למסך מלא, `N` להערות המנחה עם זמני כל שקופית.
- נפתח את אפליקציית הדמו בטאב נפרד: `npm run demo` ואז http://localhost:3164
- ניווט: `←` / רווח = הצעד הבא (קודם חושף אנימציות ושורות קוד, ואז עובר שקופית), `→` = אחורה.

## מבנה ולוח זמנים

| זמן | שקופיות | נושא | דמו חי |
|---|---|---|---|
| 0:00–1:30 | 1–2 | פתיחה ומבנה השיעור | — |
| 1:30–4:00 | 3–6 | התקנה ושדרוג (ולמה צריך להוריד דפדפנים), הורדת הריפו, ואפליקציית הדמו PW Shop | `git clone`, `npm install`, `npm run demo`, לעבור על 3 העמודים |
| 4:00–6:45 | 7–10 | **`locator.within()`** | `npx playwright test within --headed` |
| 6:45–8:15 | 11–12 | **`testProject.default`** | `npx playwright test` ואחריו `--project=firefox` |
| 8:15–10:15 | 13–14 | **`--shuffle`** | `npx playwright test cart-order.spec --project=shuffle --workers=1 --shuffle` כמה פעמים, שחזור עם ה-seed, ואז `cart-order-beforeall` להשוואה |
| 10:15–12:00 | 15–16 | **Test Locks** (`describe.configure({ lock })`) | `npx playwright test without-lock --project=locks --workers=2` ואז `with-lock` |
| 12:00–14:00 | 17–19 | WebP, הריצה הראשונה של טסט עם צילום (השינוי ב-`missing`), ואיך עובדים עם תמונות שמורות | לשנות זמנית $50 ל-$40 ב-`widgets.html`, להריץ `npx playwright test snapshots` (נכשל), `npx playwright show-report` (expected / actual / diff), להחזיר |
| 14:00–16:00 | 20–22 | **הקלטת וידאו** (כולל פריים אמיתי שמראה point / highlight / title) | `npx playwright test --project=video` ולפתוח את `video.webm` מ-test-results |
| 16:00–20:30 | 23–27 | **WebMCP** ו-`getByRef` | `npx playwright test --project=webmcp`, `npx @playwright/cli@latest webmcp-list`, `getTools()` ב-DevTools |
| 20:30–22:45 | 28–29 | `includeShadow`, cookies ב-request, `filteredProjects`, `signCount` | `npx playwright test include-shadow request-cookies` |
| 22:45–25:30 | 30–31 | **4 Breaking Changes** | `npx playwright test breaking-changes` |
| 25:30–27:15 | 32–34 | איך משדרגים בלי הפתעות, מקורות, סגירה (עם קישור לריפו) | — |

## מפת קבצים לפי פיצ'ר

לכל חידוש יש תיקייה ב-`tests/` עם `with-1-64/`, ולכל חידוש שהיה לו קודם תחליף גם `before-1-64/` עם הקוד הישן שרץ (within, getByRef, includeShadow, cookies). לוידאו יש פרויקט `video-before`. WebMCP ו-`signCount` הם APIs חדשים לגמרי.

| פיצ'ר | קובץ |
|---|---|
| `locator.within()` | `tests/within/` |
| `default: false`, video `fps` + `style`, WebP | `playwright.config.ts` |
| `fullConfig.filteredProjects` | `tests/filtered-projects/` |
| Test locks לקובץ שלם | `tests/locks/` (פרויקט `locks`) |
| `--shuffle` | `tests/shuffle/` (פרויקט `shuffle`) |
| WebMCP (צד העמוד) | `demo-app/public/index.html` |
| WebMCP (צד הטסט) | `tests/webmcp/` (פרויקט `webmcp`) |
| `getByRef`, `includeShadow`, cookies של APIRequestContext, צילום WebP | `tests/get-by-ref/`, `tests/include-shadow/`, `tests/request-cookies/`, `tests/snapshots/` |
| `screen` מתיאור המכשיר, iframe מוסתר | `tests/breaking-changes/` |

## מה נבדק בפועל (2 בנובמבר 2026, עם @playwright/test 1.64.1 על macOS; 19/19, 31/31, 5/5 ו-tsc נבדקו שוב ב-8 בנובמבר 2026)
- `npx playwright test`: 19/19 עברו (פרויקטים `chromium` ו-`webmcp`). `npm run test:all`: 31/31. `npx playwright test before-1-64`: 5/5. `tsc --noEmit`: בלי שגיאות.
- `--project=firefox`: 3/3 עברו. `--project=video`: 3/3 עברו ונוצרו קבצי `video.webm`.
- `--shuffle` (4 טסטים בכל קובץ): בלי `beforeAll` 9 מתוך 10 ריצות נכשלו, ו-seed `354875837` משחזר את הכישלון (התפוח עובר, 4 ו-3 נכשלים, הבננה עוברת). עם `beforeAll` משותף 10 מתוך 10 ריצות עברו.
- Locks (`without-lock` / `with-lock`, 2 workers): בלי lock אחד משני הטסטים נכשל בכל אחת מ-5 ריצות. עם lock שניהם עברו בכל 5 הריצות. גם בלי שום המתנה בקוד ההתנגשות קורית, כי שני הטסטים מתחילים באותו רגע.
- צילומי מסך: בלי דגל, טסט בלי תמונה שמורה נכשל ("A snapshot doesn't exist ... writing actual"); עם `--update-snapshots=missing` הוא עובר. תמונה שמורה שלא תואמת לא נדרסת עם `missing`. שינוי של $50 ל-$40 בבאנר נותן "42 pixels (ratio 0.01 of all image pixels) are different" ו-expected / actual / diff ב-test-results. `--update-snapshots` מעדכן אותה והריצה הבאה עוברת.
- WebMCP: `npx @playwright/cli@latest webmcp-list` (גרסה 0.1.23; ל-`playwright-cli` הגלובלי הישן, 0.1.6, אין את הפקודה) מחזיר את 3 הכלים. ב-Google Chrome 156 עם `--enable-features=WebMCP --no-first-run`, `document.modelContext.getTools()` מחזיר אותם; בלי הדגל אין `modelContext`.
- `getByRef`: ה-ref של Subscribe הוא `e27` בכל ריצה, ו-`getByRef` עובד רק אחרי `ariaSnapshot({ mode: 'ai' })`.
- צילום המסך נשמר כ-`promo-banner-looks-right-1-chromium-darwin.webp`. על Linux/Windows הוא ייווצר מחדש בריצה הראשונה עם `--update-snapshots=missing`.

## דברים שגילינו בדרך (כדאי להזכיר בסרטון)
- **shuffle ו-`beforeAll`:** טסטים במצב parallel שחולקים `beforeAll`/`afterAll` נשארים קבוצה אחת ולא מתערבבים ביניהם. ראינו את זה בקוד של `shuffleTestGroups`/`createTestGroups` בחבילה, ולכן יש בדמו שני קבצים: אחד בלי hook ואחד עם `beforeAll`.
- **`test.use({ screen: undefined })` בתוך describe** לא ביטל את ה-screen של ה-device בבדיקה שלנו, והמסך נשאר 1920×1080. ה-opt-out עבד ב-`browser.newContext({ ...devices['Desktop Chrome'], screen: undefined })`. התיעוד מציג את ה-opt-out ברמת הקונפיג.
- **`test.use({ ...devices[...] })` בתוך describe** נכשל עם השגיאה "forces a new worker". מגדירים device ברמת הקובץ או בקונפיג.

## מקורות
- Release notes רשמיים: https://playwright.dev/docs/release-notes (המקור הגולמי: `docs/src/release-notes-js.md` בריפו)
- GitHub releases (v1.64.0, v1.64.1): https://github.com/microsoft/playwright/releases
- תיעוד API: `class-webmcp`, `Locator.within`, `Page.getByRef`, `Credentials`, ו-Test locks ב-`test-parallel`
- WebAuthn, signature counter: https://www.w3.org/TR/webauthn-2/#signature-counter
- Playwright CLI: https://www.npmjs.com/package/@playwright/cli
- הטסטים של Playwright עצמו ל-WebMCP: https://github.com/microsoft/playwright/blob/main/tests/library/webmcp.spec.ts
- Currents, "Playwright 1.64: Shuffle, Test Locks and Breaking Changes": https://currents.dev/posts/playwright-1-64-shuffle-test-locks-and-breaking-changes
- Awesome Testing, "Understanding WebMCP with Playwright and AI Agents": https://www.awesome-testing.com/2026/10/understanding-webmcp-with-playwright-and-ai-agents
- Medium (לא הצלחנו לקרוא את התוכן, השרת החזיר 403; הם ברשימה כי עלו בחיפוש):
  - https://medium.com/@svetlana.tretjakova/playwright-1-64-just-landed-the-new-features-that-actually-matter-for-test-automation-6ec53c8db917
  - https://medium.com/@amol9patil/playwright-1-64-what-changed-why-its-better-and-should-you-use-it-72eb11f7322b
- TestDino: https://testdino.com/blog/playwright-1-64-release (רק הכותרת והתיאור נטענו)
