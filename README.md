# Playwright 1.64 — מה חדש

ערכת שיעור מלאה על החידושים ב-Playwright 1.64: מצגת אינטראקטיבית בעברית, אפליקציית דמו, וטסט שרץ לכל פיצ'ר חדש.

> נבדק עם `@playwright/test` 1.64.1 על Node 22.

## מה יש בריפו

| תיקייה / קובץ | מה זה |
|---|---|
| `presentation/index.html` | המצגת. קובץ HTML אחד שנפתח ישירות בדפדפן |
| `demo-app/` | **PW Shop**: אפליקציית דמו קטנה על Node, בלי ספריות חיצוניות |
| `tests/<חידוש>/with-1-64/` | הטסטים של החידוש, כמו שכותבים אותם ב-1.64 |
| `tests/<חידוש>/before-1-64/` | אותן בדיקות כמו שכתבו אותן לפני 1.64. רצות גם היום, כדי להשוות לפני ואחרי |
| `playwright.config.ts` | פרויקטים עם `default: false`, הקלטת וידאו ב-60fps, צילומי מסך ב-WebP |
| `LESSON_PLAN.md` | מערך השיעור: מבנה, דמואים ומקורות |

## התקנה

```bash
git clone https://github.com/AlexKomanov/playwright-1.64-lesson.git
cd playwright-1.64-lesson
npm install
npx playwright install chromium
```

## הרצה

```bash
npm test               # הפרויקטים שרצים כברירת מחדל: chromium + webmcp
npm run demo           # רק אפליקציית הדמו, בכתובת http://localhost:3164
npm run test:all       # כל הפרויקטים הרגילים, כולל firefox, webkit והקלטות הווידאו
npm run report         # פתיחת ה-HTML report
```

הדמואים של כל חידוש רצים ישירות עם `npx playwright test`:

```bash
npx playwright test within                       # locator.within(), עם 1.64 ולפני
npx playwright test cart-order.spec --project=shuffle --workers=1 --shuffle            # סדר אקראי
npx playwright test cart-order.spec --project=shuffle --workers=1 --shuffle <seed>     # אותו סדר שוב
npx playwright test cart-order-beforeall --project=shuffle --workers=1 --shuffle       # עם beforeAll משותף
npx playwright test without-lock --project=locks --workers=2   # בלי lock: אחד הטסטים נכשל
npx playwright test with-lock --project=locks --workers=2      # עם lock: שניהם עוברים
npx playwright test --project=webmcp             # page.webmcp (Chromium עם --enable-features=WebMCP)
npx @playwright/cli@latest open http://localhost:3164/   # playwright-cli: הדפדפן מהטרמינל (הדגל של WebMCP נקרא מ-.playwright/cli.config.json)
npx @playwright/cli@latest webmcp-list            # אילו כלי WebMCP הדף חושף
npx playwright test --project=video              # וידאו ב-60fps עם עיצוב CSS
npx playwright test --project=video-before       # אותה הקלטה עם האפשרות של לפני 1.64 (fontSize)
npx playwright test before-1-64                  # רק הקוד של לפני 1.64
```

לא צריך להרים את השרת לפני הטסטים, `webServer` בקונפיג עושה את זה לבד.
כדי להריץ את `test:all` נתקין קודם גם את שאר הדפדפנים: `npx playwright install`.
הדמואים של shuffle ושל locks נכשלים בכוונה (זה מה שהם מדגימים), ולכן הם רצים רק בפקודות משלהם ולא ב-`test:all`.

## איזה קובץ מדגים מה

לכל חידוש יש תיקייה ב-`tests/`. בתוכה `with-1-64/` עם הקוד של 1.64, וכשהיה לחידוש תחליף קודם, גם `before-1-64/` עם הקוד הישן.

| חידוש ב-1.64 | איפה |
|---|---|
| `locator.within()` | `tests/within/` |
| `testProject.default` | `playwright.config.ts` |
| `--shuffle` | `tests/shuffle/` (`cart-order.spec.ts` בלי `beforeAll`, `cart-order-beforeall.spec.ts` עם) |
| `test.describe.configure({ lock })` | `tests/locks/` (`with-lock.spec.ts`, ולהשוואה `without-lock.spec.ts`) |
| צילומי מסך ב-WebP, `--update-snapshots=missing` | `tests/snapshots/`, `playwright.config.ts` |
| הקלטת וידאו: `fps`, `style` | `playwright.config.ts` (פרויקט `video`) · לפני: פרויקט `video-before` |
| WebMCP: הגדרת הכלים בצד האתר | `demo-app/public/index.html` |
| WebMCP: `page.webmcp` | `tests/webmcp/` |
| `page.getByRef()` | `tests/get-by-ref/` |
| `page.content({ includeShadow })` | `tests/include-shadow/` |
| cookies ב-`APIRequestContext` | `tests/request-cookies/` |
| `fullConfig.filteredProjects` | `tests/filtered-projects/` (global setup) |
| Breaking Changes: `screen` מהגדרות המכשיר, iframe מוסתר | `tests/breaking-changes/` |

## המצגת

נפתח את `presentation/index.html` בדפדפן.

- `←` או רווח: הצעד הבא. קודם נחשפים האנימציות ושורות הקוד, ואחר כך עוברים שקופית
- `→`: צעד אחורה
- `N`: הערות למציג
- `F`: מסך מלא

## הערות

- צילום המסך השמור (`*.webp`) נוצר על macOS. על Linux או Windows נריץ פעם אחת `npx playwright test --update-snapshots=missing` כדי ליצור צילום למערכת שלנו.
- WebMCP הוא עדיין פיצ'ר ניסיוני. WebKit לא תומך בו.

## מקורות

- [Release notes רשמיים](https://playwright.dev/docs/release-notes)
- [GitHub releases](https://github.com/microsoft/playwright/releases)
- [Currents: Shuffle, Test Locks and Breaking Changes](https://currents.dev/posts/playwright-1-64-shuffle-test-locks-and-breaking-changes)
- [Awesome Testing: Understanding WebMCP with Playwright](https://www.awesome-testing.com/2026/10/understanding-webmcp-with-playwright-and-ai-agents)

---

## English

Lesson kit for **Playwright 1.64**: an interactive Hebrew slide deck (`presentation/index.html`), a zero-dependency demo app (`demo-app/`), and one runnable spec per new feature (`tests/`).

```bash
npm install
npx playwright install chromium
npm test            # chromium + webmcp projects
npm run test:all    # all regular projects incl. firefox/webkit (install all browsers first: npx playwright install)
```

See the tables above for the npm scripts and the feature-to-file map.
