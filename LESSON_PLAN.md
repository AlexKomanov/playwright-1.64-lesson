# מערך שיעור: מה חדש ב-Playwright 1.64

**פורמט:** סרטון YouTube, כ-28 דקות
**קהל:** אנשי QA ומפתחים שכבר עובדים עם Playwright Test
**גרסה:** 1.64.0 (שוחררה ב-7 באוקטובר 2026), תיקון 1.64.1 (14 באוקטובר 2026). דפדפנים: Chromium 156.0.8078.4, Firefox 157.0, WebKit 27.2

## מטרות השיעור
בסוף השיעור הצופה:
1. ישתמש ב-`locator.within()` כדי לחבר שני לוקייטורים קיימים, כולל שאילתות של עמודה בטבלה.
2. יגדיר פרויקטים עם `default: false`, יריץ `--shuffle` עם seed וישתמש ב-test locks ברמת קובץ.
3. יכתוב טסט "tool contract" לכלי WebMCP בעזרת `page.webmcp`.
4. יכיר את ה-APIs החדשים ואת 4 השינויים השוברים, ויוכל לתכנן שדרוג בטוח.

## הכנה לפני ההקלטה
```bash
git clone https://github.com/AlexKomanov/playwright-1.64-lesson.git
cd playwright-1.64-lesson
npm install
npx playwright install chromium        # נדרש גם firefox/webkit רק כשמריצים את הפרויקטים האלה
npx playwright test                    # ריצת בדיקה: 17 טסטים אמורים לעבור
```
- נפתח את המצגת: `presentation/index.html` בדפדפן (עובד גם מקובץ מקומי). `F` למסך מלא, `N` להערות המנחה עם זמני כל שקופית.
- נפתח את אפליקציית הדמו בטאב נפרד: `npm run demo` ואז http://localhost:3164
- ניווט: `←` / רווח = הצעד הבא (קודם חושף אנימציות ושורות קוד, ואז עובר שקופית), `→` = אחורה.

## מבנה ולוח זמנים

| זמן | שקופיות | נושא | דמו חי |
|---|---|---|---|
| 0:00–1:30 | 1–2 | פתיחה ומבנה השיעור | — |
| 1:30–2:30 | 3–4 | הורדת הריפו, ואפליקציית הדמו PW Shop | `git clone`, `npm install`, `npm run demo`, לעבור על 3 העמודים |
| 2:30–6:00 | 5–8 | **`locator.within()`** | `npx playwright test 01-within --headed` |
| 6:00–7:30 | 9–10 | **`testProject.default`** | `npx playwright test` ואחריו `--project=firefox` |
| 7:30–9:45 | 11–12 | **`--shuffle`** | `npm run test:shuffle` כמה פעמים, שחזור עם `npm run test:shuffle -- <seed>`, ואז `npm run test:shuffle:beforeall` להשוואה |
| 9:45–12:00 | 13–16 | **Test Locks** (`describe.configure({ lock })`) | להוריד את ה-lock משני קבצי 02-locks ולהריץ, ואז להחזיר |
| 12:00–13:00 | 17 | WebP ו-`--update-snapshots=missing` | `npx playwright test 03-new-apis -g banner --update-snapshots=missing` |
| 13:00–16:00 | 18–19 | **הקלטת וידאו** | `npm run test:video` ולפתוח את `video.webm` מ-test-results |
| 16:00–21:00 | 20–23 | **WebMCP** | `npm run test:webmcp` |
| 21:00–23:30 | 24–25 | `getByRef`, `includeShadow`, cookies ב-request, `filteredProjects`, `signCount` | `npx playwright test 03-new-apis` |
| 23:30–26:45 | 26–27 | **4 Breaking Changes** | `npx playwright test 04-breaking-changes` |
| 26:45–28:30 | 28–30 | איך משדרגים בלי הפתעות, מקורות, סגירה (עם קישור לריפו) | — |

## מפת קבצים לפי פיצ'ר

| פיצ'ר | קובץ |
|---|---|
| `locator.within()` | `tests/01-within.spec.ts` |
| `default: false`, video `fps` + `style`, WebP | `playwright.config.ts` |
| `fullConfig.filteredProjects` | `tests/global-setup.ts` |
| Test locks לקובץ שלם + `exclusive` | `tests/02-locks-a.spec.ts`, `tests/02-locks-b.spec.ts` |
| כמה זמן lock על קובץ תופס | `tests/lock-scope/` (פרויקט `lock-scope`, `npm run test:lock-scope:mixed` / `:split`) |
| `--shuffle` | `tests/order-demo/cart-order.spec.ts` ו-`tests/order-demo/cart-order-beforeall.spec.ts` (פרויקט `order-demo`) |
| WebMCP (צד העמוד) | `demo-app/public/index.html` |
| WebMCP (צד הטסט) | `tests/webmcp.spec.ts` (פרויקט `webmcp`) |
| `getByRef`, `includeShadow`, cookies של APIRequestContext, צילום WebP | `tests/03-new-apis.spec.ts` |
| `screen` מתיאור המכשיר, iframe מוסתר | `tests/04-breaking-changes.spec.ts` |

## מה נבדק בפועל (23 באוקטובר 2026, עם @playwright/test 1.64.1 על macOS)
- `npx playwright test`: 17/17 עברו (פרויקטים `chromium` ו-`webmcp`).
- `--project=firefox`: 3/3 עברו. `--project=video`: 3/3 עברו ונוצרו קבצי `video.webm`.
- `--shuffle` (4 טסטים בכל קובץ): בלי `beforeAll` 9 מתוך 10 ריצות נכשלו, ו-seed `519956039` משחזר את הכישלון. עם `beforeAll` משותף 10 מתוך 10 ריצות עברו (27 באוקטובר 2026).
- Locks: בלי ה-lock הטסטים של 02-locks נכשלו ב-3 מתוך 3 ריצות. עם ה-lock עברו 3 מתוך 3.
- lock על קובץ שלם (3 ריצות לכל גרסה, אותן תוצאות): כשהטסטים האיטיים באותו קובץ נעול, הטסט האחר עם אותו lock חיכה 5.4 שניות (ריצה 6.6s). אחרי פיצול לשני קבצים ה-lock תפוס כשנייה (ריצה 4.6s).
- צילום המסך נשמר כ-`promo-banner-looks-right-1-chromium-darwin.webp`. על Linux/Windows הוא ייווצר מחדש בריצה הראשונה עם `--update-snapshots=missing`.

## דברים שגילינו בדרך (כדאי להזכיר בסרטון)
- **shuffle ו-`beforeAll`:** טסטים במצב parallel שחולקים `beforeAll`/`afterAll` נשארים קבוצה אחת ולא מתערבבים ביניהם. ראינו את זה בקוד של `shuffleTestGroups`/`createTestGroups` בחבילה, ולכן יש בדמו שני קבצים: אחד בלי hook ואחד עם `beforeAll`.
- **`test.use({ screen: undefined })` בתוך describe** לא ביטל את ה-screen של ה-device בבדיקה שלנו, והמסך נשאר 1920×1080. ה-opt-out עבד ב-`browser.newContext({ ...devices['Desktop Chrome'], screen: undefined })`. התיעוד מציג את ה-opt-out ברמת הקונפיג.
- **`test.use({ ...devices[...] })` בתוך describe** נכשל עם השגיאה "forces a new worker". מגדירים device ברמת הקובץ או בקונפיג.

## מקורות
- Release notes רשמיים: https://playwright.dev/docs/release-notes (המקור הגולמי: `docs/src/release-notes-js.md` בריפו)
- GitHub releases (v1.64.0, v1.64.1): https://github.com/microsoft/playwright/releases
- תיעוד API: `class-webmcp`, `Locator.within`, `Page.getByRef`, `Credentials`, ו-Test locks ב-`test-parallel`
- הטסטים של Playwright עצמו ל-WebMCP: https://github.com/microsoft/playwright/blob/main/tests/library/webmcp.spec.ts
- Currents, "Playwright 1.64: Shuffle, Test Locks and Breaking Changes": https://currents.dev/posts/playwright-1-64-shuffle-test-locks-and-breaking-changes
- Awesome Testing, "Understanding WebMCP with Playwright and AI Agents": https://www.awesome-testing.com/2026/10/understanding-webmcp-with-playwright-and-ai-agents
- Medium (לא הצלחנו לקרוא את התוכן, השרת החזיר 403; הם ברשימה כי עלו בחיפוש):
  - https://medium.com/@svetlana.tretjakova/playwright-1-64-just-landed-the-new-features-that-actually-matter-for-test-automation-6ec53c8db917
  - https://medium.com/@amol9patil/playwright-1-64-what-changed-why-its-better-and-should-you-use-it-72eb11f7322b
- TestDino: https://testdino.com/blog/playwright-1-64-release (רק הכותרת והתיאור נטענו)
