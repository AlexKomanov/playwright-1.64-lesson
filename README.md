# Playwright 1.64 — מה חדש

ערכת שיעור מלאה על החידושים ב-Playwright 1.64: מצגת אינטראקטיבית בעברית, אפליקציית דמו, וטסט שרץ לכל פיצ'ר חדש.

> נבדק עם `@playwright/test` 1.64.1 על Node 22.

## מה יש בריפו

| תיקייה / קובץ | מה זה |
|---|---|
| `presentation/index.html` | המצגת. קובץ HTML אחד שנפתח ישירות בדפדפן |
| `demo-app/` | **PW Shop**: אפליקציית דמו קטנה על Node, בלי ספריות חיצוניות |
| `tests/` | קובץ טסט לכל חידוש |
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
npm run test:shuffle   # טסטים שתלויים זה בזה, בסדר אקראי (כדאי להריץ כמה פעמים)
npm run test:webmcp    # טסטים ל-page.webmcp (Chromium עם --enable-features=WebMCP)
npm run test:video     # הקלטת וידאו ב-60fps עם עיצוב CSS לסימון הפעולות
npm run test:all       # כל הפרויקטים, כולל firefox ו-webkit
npm run report         # פתיחת ה-HTML report
```

לא צריך להרים את השרת לפני הטסטים, `webServer` בקונפיג עושה את זה לבד.
כדי להריץ את `test:all` נתקין קודם גם את שאר הדפדפנים: `npx playwright install`.

## איזה קובץ מדגים מה

| חידוש ב-1.64 | איפה |
|---|---|
| `locator.within()` | `tests/01-within.spec.ts` |
| `testProject.default` | `playwright.config.ts` |
| `--shuffle` | `tests/order-demo/cart-order.spec.ts` |
| `test.describe.configure({ lock })` | `tests/02-locks-a.spec.ts`, `tests/02-locks-b.spec.ts` |
| צילומי מסך ב-WebP, `--update-snapshots=missing` | `playwright.config.ts`, `tests/03-new-apis.spec.ts` |
| הקלטת וידאו: `fps`, `style` | `playwright.config.ts` (פרויקט `video`) |
| WebMCP: הגדרת הכלים בצד האתר | `demo-app/public/index.html` |
| WebMCP: `page.webmcp` | `tests/webmcp.spec.ts` |
| `page.getByRef()`, `content({ includeShadow })`, cookies ב-`APIRequestContext` | `tests/03-new-apis.spec.ts` |
| `fullConfig.filteredProjects` | `tests/global-setup.ts` |
| Breaking Changes: `screen` מהגדרות המכשיר, iframe מוסתר | `tests/04-breaking-changes.spec.ts` |

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
npm run test:all    # every project (install all browsers first: npx playwright install)
```

See the tables above for the npm scripts and the feature-to-file map.
