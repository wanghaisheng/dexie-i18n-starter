好的，这是 Minimal Demo V3 Final 的独立完整代码。我已经将所有部分整合在一起，并确保了命名和结构的一致性。

**项目结构 (回顾):**

```
minimal-dexie-i18n-v3-final/
├── README.md
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── vite-env.d.ts
    ├── types/
    │   └── index.ts
    ├── context/
    │   └── LanguageProvider.tsx
    ├── db.ts
    ├── services/
    │   └── index.ts
    │   └── localizedContentService.ts
    ├── hooks/
    │   └── useInternationalizedQuery.ts
    │   └── useLocalizedView.ts
    ├── components/
    │   ├── common/
    │   │   ├── Button.tsx
    │   │   ├── LoadingSpinner.tsx
    │   │   └── ErrorDisplay.tsx
    │   └── layout/
    │       ├── AppShell.tsx
    │       ├── Header.tsx
    │       └── Navigation.tsx
    ├── features/
    │   ├── home/
    │   │   ├── WelcomeSection.tsx
    │   │   └── MoodsSection.tsx
    │   └── settings/
    │       └── LanguageSettingsSection.tsx
    ├── pages/
    │   ├── HomePage.tsx
    │   └── SettingsPage.tsx
    └── router.tsx
```

---

**1. `README.md`**

```markdown
# Minimal Dexie I18n Demo (V3 - Finalized Structure)

This project demonstrates a type-safe, API-driven (simulated with Dexie.js) internationalization architecture for React applications, emphasizing clear naming, page-level content fetching, and component-based design for optimal team collaboration.

## Core Architecture & Data Flow:

1.  **Language Management (`LanguageProvider`):**
    *   Manages and persists the global `language` state (`en` | `zh`).
    *   Provides `language` and `setLanguage` via `useLanguage` hook.
    *   Does **not** handle translations directly.

2.  **Dexie.js as Mock Backend (`db.ts`):**
    *   Simulates an API data source using IndexedDB.
    *   The `uiLabels` store holds all translatable text records.
    *   `UILabelRecord` includes `scopeKey`, `labelKey`, `languageCode`, `translatedText`.
    *   **Scope Keys:** Organize labels hierarchically:
        *   `globalLayout`: For app shell (header, footer, nav).
        *   `[viewName]View`: For page-level titles and direct content (e.g., `homeView`, `settingsView`).
        *   `[viewName]View.[sectionName]`: For labels specific to a section within a view.

3.  **Services (`localizedContentService.ts`):**
    *   Functions like `fetchHomePageView`, `fetchSettingsPageView`, `fetchGlobalLayoutView`.
    *   Interact with Dexie to retrieve `labels` and `data` for a given `language` and `scopeKey`.
    *   Return a `Promise<LocalizedContent<TDataPayload, TLabelsBundle>>`.
    *   `buildLabelsObject` helper reconstructs nested label objects from flat Dexie records.

4.  **Custom Hook (`useLocalizedView.ts`):**
    *   Built on `useInternationalizedQuery` (generic React Query wrapper).
    *   Simplifies fetching localized content for a view.
    *   Takes a `viewQueryKey` (e.g., "homeViewContent") and the corresponding `fetchViewFn`.
    *   Automatically manages `language` in the React Query `queryKey`.
    *   Returns typed `{ labels, data, isPending, isError, ... }`.

5.  **Type Definitions (`types/index.ts`):**
    *   Centralized, clearly named types.
    *   `LocalizedContent<TData, TLabels>`: Standard service response.
    *   `[PageName]ViewLabelsBundle`, `[PageName]ViewDataPayload`: For view-specific content.
    *   `[FeatureName][SectionName]Labels`: For section-specific labels.

6.  **Page-Level Data Ownership & Props Delegation:**
    *   **Page/View Components (`src/pages/`):**
        *   Act as containers. Use `useLocalizedView` to fetch all content for their view.
    *   **Data Downflow:** Pages pass relevant slices of `labels` and `data` as props to child "Section" components (`src/features/`) and common components.
    *   **Presentational Children:** Section and common components receive all text and data via props.

7.  **Componentization:**
    *   **Layout (`AppShell`, `Header`, `Navigation`):** `AppShell` fetches `GlobalLayoutLabelsBundle`.
    *   **Features/Sections:** Encapsulate distinct UI parts.
    *   **Common:** Reusable, prop-driven components.

## Running the Demo:

1.  `npm install`
    *   Note: If `vite.config.ts` shows type errors for `path` or `__dirname`, you may need to install Node.js types: `npm install --save-dev @types/node`.
    *   The `package.json` includes necessary type definitions like `@types/react`, but ensure your TypeScript server has recognized them after installation. Sometimes a reload of your editor or TS server might be needed if "Cannot find module" errors persist initially for installed packages.
2.  `npm run dev`
3.  Open in browser (usually `http://localhost:5173`).

**Important Notes for Development:**

*   **`index.html`:** This project uses Vite, which requires an `index.html` file in the project root as the entry point.
*   **Dexie DB Population:** The `src/db.ts` includes a mechanism to populate the IndexedDB with sample data. In development, React's `StrictMode` might cause the population function to be called twice. The provided code has a safeguard to prevent duplicate data errors (`ConstraintError`) in this scenario. If you modify this, be mindful of potential re-entrancy.
*   **Favicon:** You might see a 404 error for `favicon.ico` in the browser console. This is harmless and can be resolved by adding a favicon to your project and linking it in `index.html`.
```

---

**2. `package.json`**

```json
{
  "name": "minimal-dexie-i18n-v3-final",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.32.0",
    "dexie": "^3.2.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.23.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@types/react-router-dom": "^5.3.3",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}
```

---

**3. `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

**4. `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "vite.config.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

**5. `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

---

**6. `src/vite-env.d.ts`**

```typescript
/// <reference types="vite/client" />
```

---

**7. `src/index.css`**

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f2f5;
  color: #333;
  line-height: 1.6;
}

#root {
  max-width: 960px;
  margin: 20px auto;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

header {
  padding-bottom: 15px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
}

h1, h2, h3, h4 {
  color: #2c3e50;
  margin-top: 0;
}
h1 { font-size: 1.8em; }
h2 { font-size: 1.5em; margin-bottom: 0.8em; }
h3 { font-size: 1.3em; margin-bottom: 0.6em; color: #34495e; }
h4 { font-size: 1.1em; margin-bottom: 0.5em; color: #7f8c8d; }


nav {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

nav a {
  padding: 8px 15px;
  text-decoration: none;
  color: #3498db;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

nav a:hover {
  background-color: #ecf0f1;
  color: #2980b9;
}

nav a.active {
  background-color: #3498db;
  color: white;
  font-weight: bold;
}

.page-content, section.page-content { /* Allow section to also use page-content style */
  background-color: #fff;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  /* box-shadow: 0 1px 3px rgba(0,0,0,0.05); */
}
section + section { margin-top: 25px; }


hr {
  border: 0;
  height: 1px;
  background-color: #e8e8e8;
  margin: 25px 0;
}

footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid #e8e8e8;
  font-size: 0.9em;
  color: #7f8c8d;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}
li { margin-bottom: 5px; }


/* Common Components */
.button-common {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: background-color 0.2s, opacity 0.2s;
  margin-right: 10px; /* Default spacing for buttons */
}
.button-common:last-child { margin-right: 0; }

.button-common:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.button-primary {
  background-color: #3498db;
  color: white;
}
.button-primary:hover:not(:disabled) {
  background-color: #2980b9;
}
.button-secondary {
  background-color: #95a5a6;
  color: white;
}
.button-secondary:hover:not(:disabled) {
  background-color: #7f8c8d;
}


select {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #bdc3c7;
  margin-right: 10px;
  font-size: 1em;
  background-color: white;
}

.loading-spinner-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 100px;
}
.loading-spinner {
  border: 4px solid #ecf0f1; /* Light grey */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 0.8s linear infinite;
}
.loading-spinner-text { margin-top: 10px; font-style: italic; color: #555; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.error-container {
  border: 1px solid #e74c3c; /* Red */
  padding: 15px;
  border-radius: 5px;
  background-color: #fdedec; /* Light red */
  margin-bottom: 15px;
}
.error-container h3 { color: #c0392b; margin-bottom: 8px;}
.error-text { color: #c0392b; }
.error-code-text { font-size: 0.85em; color: #7f8c8d; margin-top: 5px; }
```

---

**8. `src/types/index.ts`**

```typescript
// src/types/index.ts
export type Language = "en" | "zh";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export interface ApiError extends Error { errorCode?: string; statusCode?: number; }

// Structure for Dexie uiLabels store
export interface UILabelRecord {
  id?: number;
  scopeKey: string; // e.g., "globalLayout", "homeView", "homeView.welcomeSection", "components.button"
  labelKey: string; // e.g., "appTitle", "welcomeMessage", "confirmText"
  languageCode: Language;
  translatedText: string;
}

// --- Generic Localized Content Structure (from services) ---
export interface LocalizedContent<TDataPayload, TLabelsBundle> {
  labels: TLabelsBundle;
  data: TDataPayload | null;
}

// --- Global / Layout Content Types ---
export interface GlobalLayoutLabelsBundle {
  appTitle: string;
  navHome: string;
  navSettings: string;
  footerText: string;
  loadingGeneric: string;
  errorGeneric: string;
}
export type FetchGlobalLayoutViewResult = LocalizedContent<null, GlobalLayoutLabelsBundle>;

// --- Home Page/View Specific Types ---
export interface HomeWelcomeSectionLabels {
  welcomeMessage: string;
}
export interface MoodItem { readonly id: number; readonly name: string; readonly feeling: string; }
export interface HomeMoodsSectionLabels {
  sectionTitle: string;
  noMoodsMessage: string;
  refreshButtonText: string;
}
export interface HomePageViewLabelsBundle {
  pageTitle: string;
  welcomeSection: HomeWelcomeSectionLabels;
  moodsSection: HomeMoodsSectionLabels;
  someActionText: string; // Example of a page-level label for a generic action
}
export interface HomePageViewDataPayload {
  username: string;
  moods: readonly MoodItem[];
}
export type FetchHomePageViewResult = LocalizedContent<HomePageViewDataPayload, HomePageViewLabelsBundle>;

// --- Settings Page/View Specific Types ---
export interface SettingsLanguageSectionLabels {
  sectionTitle: string;
  selectLanguagePrompt: string;
  currentLanguageIs: string;
  langNameEn: string;
  langNameZh: string;
  saveButtonText: string;
  successMessage: string;
}
export interface SettingsPageViewLabelsBundle {
  pageTitle: string;
  languageSection: SettingsLanguageSectionLabels;
}
export type FetchSettingsPageViewResult = LocalizedContent<null, SettingsPageViewLabelsBundle>;
```

---

**9. `src/context/LanguageProvider.tsx`**

```tsx
// src/context/LanguageProvider.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from "react";
import type { Language, LanguageContextType } from "@/types";

const DEFAULT_LANGUAGE: Language = "en";
const LOCAL_STORAGE_KEY = "app_lang_v3_final";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as Language | null;
      return (saved === "en" || saved === "zh") ? saved : DEFAULT_LANGUAGE;
    } catch (e) { console.warn("localStorage access error for language", e); return DEFAULT_LANGUAGE; }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch (e) { console.warn("localStorage write error for language", e); }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);
  const value = { language, setLanguage };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
```

---

**10. `src/db.ts`**

```typescript
// src/db.ts
import Dexie, { Table } from 'dexie';
import type { UILabelRecord } from '@/types';

export class AppDB extends Dexie {
  uiLabels!: Table<UILabelRecord, number>;
  constructor() {
    super('FinalMinimalI18nDB_V3'); // Unique DB name for this version
    this.version(1).stores({
      uiLabels: '++id, scopeKey, labelKey, languageCode, &[scopeKey+labelKey+languageCode]',
    });
  }
}
export const db = new AppDB();

export async function populateDB() {
  const count = await db.uiLabels.count();
  if (count > 0) { /* console.log("DB V3 already populated."); */ return; }
  console.log("Populating Final V3 Dexie DB...");

  const labels: UILabelRecord[] = [
    // GlobalLayout scope
    { scopeKey: 'globalLayout', labelKey: 'appTitle', languageCode: 'en', translatedText: 'App V3 - Consistent' },
    { scopeKey: 'globalLayout', labelKey: 'appTitle', languageCode: 'zh', translatedText: '应用 V3 - 一致性' },
    { scopeKey: 'globalLayout', labelKey: 'navHome', languageCode: 'en', translatedText: 'Home' },
    { scopeKey: 'globalLayout', labelKey: 'navHome', languageCode: 'zh', translatedText: '主页' },
    { scopeKey: 'globalLayout', labelKey: 'navSettings', languageCode: 'en', translatedText: 'Settings' },
    { scopeKey: 'globalLayout', labelKey: 'navSettings', languageCode: 'zh', translatedText: '设定' },
    { scopeKey: 'globalLayout', labelKey: 'footerText', languageCode: 'en', translatedText: '© 2024 Final Demo App' },
    { scopeKey: 'globalLayout', labelKey: 'footerText', languageCode: 'zh', translatedText: '© 2024 最终演示应用' },
    { scopeKey: 'globalLayout', labelKey: 'loadingGeneric', languageCode: 'en', translatedText: 'Loading, one moment...' },
    { scopeKey: 'globalLayout', labelKey: 'loadingGeneric', languageCode: 'zh', translatedText: '加载中，请稍候...' },
    { scopeKey: 'globalLayout', labelKey: 'errorGeneric', languageCode: 'en', translatedText: 'An unexpected error occurred.' },
    { scopeKey: 'globalLayout', labelKey: 'errorGeneric', languageCode: 'zh', translatedText: '发生了一个意外错误。' },

    // homeView scope
    { scopeKey: 'homeView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'My Dashboard' },
    { scopeKey: 'homeView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '我的仪表板' },
    { scopeKey: 'homeView.welcomeSection', labelKey: 'welcomeMessage', languageCode: 'en', translatedText: 'Greetings, {user}! Have a productive day.' },
    { scopeKey: 'homeView.welcomeSection', labelKey: 'welcomeMessage', languageCode: 'zh', translatedText: '你好 {user}，祝你拥有高效的一天！' },
    { scopeKey: 'homeView.moodsSection', labelKey: 'sectionTitle', languageCode: 'en', translatedText: 'Recent Mood Entries' },
    { scopeKey: 'homeView.moodsSection', labelKey: 'sectionTitle', languageCode: 'zh', translatedText: '近期心情记录' },
    { scopeKey: 'homeView.moodsSection', labelKey: 'noMoodsMessage', languageCode: 'en', translatedText: 'No moods logged. Why not add one?' },
    { scopeKey: 'homeView.moodsSection', labelKey: 'noMoodsMessage', languageCode: 'zh', translatedText: '暂无心情记录。要不要添加一条？' },
    { scopeKey: 'homeView.moodsSection', labelKey: 'refreshButtonText', languageCode: 'en', translatedText: 'Refresh Moods' },
    { scopeKey: 'homeView.moodsSection', labelKey: 'refreshButtonText', languageCode: 'zh', translatedText: '刷新心情' },
    { scopeKey: 'homeView', labelKey: 'someActionText', languageCode: 'en', translatedText: 'Perform Action' },
    { scopeKey: 'homeView', labelKey: 'someActionText', languageCode: 'zh', translatedText: '执行操作' },

    // settingsView scope
    { scopeKey: 'settingsView', labelKey: 'pageTitle', languageCode: 'en', translatedText: 'Configuration Panel' },
    { scopeKey: 'settingsView', labelKey: 'pageTitle', languageCode: 'zh', translatedText: '配置面板' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'sectionTitle', languageCode: 'en', translatedText: 'Display Language' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'sectionTitle', languageCode: 'zh', translatedText: '显示语言' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'selectLanguagePrompt', languageCode: 'en', translatedText: 'Select your preferred language:' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'selectLanguagePrompt', languageCode: 'zh', translatedText: '请选择您的偏好语言：' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'currentLanguageIs', languageCode: 'en', translatedText: 'Currently using: {lang}' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'currentLanguageIs', languageCode: 'zh', translatedText: '当前使用：{lang}' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'langNameEn', languageCode: 'en', translatedText: 'English (US)' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'langNameEn', languageCode: 'zh', translatedText: '美式英语' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'langNameZh', languageCode: 'en', translatedText: 'Chinese (Simplified)' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'langNameZh', languageCode: 'zh', translatedText: '简体中文' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'saveButtonText', languageCode: 'en', translatedText: 'Save Preferences' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'saveButtonText', languageCode: 'zh', translatedText: '保存偏好' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'successMessage', languageCode: 'en', translatedText: 'Preferences have been updated!' },
    { scopeKey: 'settingsView.languageSection', labelKey: 'successMessage', languageCode: 'zh', translatedText: '偏好设置已更新！' },
  ];
  await db.uiLabels.bulkAdd(labels);
  console.log("Final V3 DB populated.");
}
```

---

**11. `src/services/index.ts`**

```typescript
// src/services/index.ts
export * from './localizedContentService';
```

---

**12. `src/services/localizedContentService.ts`**

```typescript
// src/services/localizedContentService.ts
import { db } from '@/db';
import type {
  Language, LocalizedContent,
  HomePageViewLabelsBundle, HomePageViewDataPayload, MoodItem,
  SettingsPageViewLabelsBundle,
  GlobalLayoutLabelsBundle,
  UILabelRecord, ApiError,
  FetchHomePageViewResult, FetchSettingsPageViewResult, FetchGlobalLayoutViewResult
} from '@/types';

const SIMULATED_DELAY_MS = 150;

function buildLabelsObject<TLabelsBundle>(records: UILabelRecord[], baseScope: string): TLabelsBundle {
  const labels = {} as any;
  records.forEach(record => {
    let keyPath = record.labelKey;
    if (record.scopeKey.startsWith(baseScope + '.') && record.scopeKey.length > baseScope.length) {
        const sectionPath = record.scopeKey.substring(baseScope.length + 1);
        keyPath = `${sectionPath}.${record.labelKey}`;
    } else if (record.scopeKey !== baseScope) {
        // This label is not directly under baseScope or a direct sub-scope path, might be an issue or intended for a different structure.
        // For this demo, we'll assume labels fetched by getScopedLabels are correctly targeted.
        // console.warn(`Label with key ${record.labelKey} has scope ${record.scopeKey} which is not directly under or part of ${baseScope}`);
    }

    const keys = keyPath.split('.');
    let current = labels;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = record.translatedText;
      } else {
        current[key] = current[key] || {};
        current = current[key];
      }
    });
  });
  return labels as TLabelsBundle;
}

async function getScopedLabels<TLabelsBundle>(baseScopeKey: string, lang: Language): Promise<TLabelsBundle> {
  let labelRecords = await db.uiLabels
    .where('languageCode').equals(lang)
    .and(record => record.scopeKey.startsWith(baseScopeKey))
    .toArray();

  if (!labelRecords.length && lang !== 'en') {
    console.warn(`No '${lang}' labels for scope ${baseScopeKey}, falling back to 'en'`);
    labelRecords = await db.uiLabels
      .where('languageCode').equals('en')
      .and(record => record.scopeKey.startsWith(baseScopeKey))
      .toArray();
  }

  if (!labelRecords.length) {
    const errorMessage = `CRITICAL: No labels found for essential scope ${baseScopeKey} (lang: ${lang} or fallback 'en').`;
    console.error(errorMessage);
    // In a real app, you might throw an error or have a more robust fallback
    return {} as TLabelsBundle;
  }
  return buildLabelsObject<TLabelsBundle>(labelRecords, baseScopeKey);
}

export async function fetchGlobalLayoutView(lang: Language): Promise<FetchGlobalLayoutViewResult> {
  console.log(`SVC_DEXIE: Fetching GLOBAL LAYOUT VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<GlobalLayoutLabelsBundle>('globalLayout', lang);
  return { labels, data: null };
}

export async function fetchHomePageView(lang: Language): Promise<FetchHomePageViewResult> {
  console.log(`SVC_DEXIE: Fetching HOME PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS));
  const labels = await getScopedLabels<HomePageViewLabelsBundle>('homeView', lang);

  const moods: MoodItem[] = [
    { id: 1, name: labels.moodsSection?.sectionTitle || (lang === 'zh' ? '心情' : 'Moods'), feeling: lang === 'zh' ? '专注的' : 'Focused' },
    { id: 2, name: lang === 'zh' ? '锻炼会议' : 'Workout Session', feeling: lang === 'zh' ? '精力充沛的' : 'Energized' },
  ];
  const data: HomePageViewDataPayload = { username: "DevUser", moods };
  return { labels, data };
}

export async function fetchSettingsPageView(lang: Language): Promise<FetchSettingsPageViewResult> {
  console.log(`SVC_DEXIE: Fetching SETTINGS PAGE VIEW for lang: ${lang}`);
  await new Promise(r => setTimeout(r, SIMULATED_DELAY_MS / 2));
  const labels = await getScopedLabels<SettingsPageViewLabelsBundle>('settingsView', lang);
  return { labels, data: null };
}
```

---

**13. `src/hooks/useInternationalizedQuery.ts`**

```typescript
// src/hooks/useInternationalizedQuery.ts
import {
  useQuery,
  type UseQueryOptions,
  type QueryKey,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { ApiError, LocalizedContent } from '@/types';

interface UseInternationalizedQueryResult<TDataPayload, TLabelsBundle, TErrorResponse> {
  data: TDataPayload | undefined | null; // Data can be TDataPayload OR null
  labels: TLabelsBundle | undefined;
  isPending: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: TErrorResponse | null;
  refetch: UseQueryResult<LocalizedContent<TDataPayload, TLabelsBundle>, TErrorResponse>['refetch'];
  status: UseQueryResult<LocalizedContent<TDataPayload, TLabelsBundle>, TErrorResponse>['status'];
  isSuccess: boolean;
}

export function useInternationalizedQuery<
  TLocalizedContent extends LocalizedContent<TDataPayload, TLabelsBundle>,
  TErrorResponse extends Error = ApiError,
  TDataPayload = TLocalizedContent['data'],
  TLabelsBundle = TLocalizedContent['labels'],
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TLocalizedContent, TErrorResponse, TLocalizedContent, TQueryKey>
): UseInternationalizedQueryResult<TDataPayload, TLabelsBundle, TErrorResponse> {
  const {
    data: queryResult,
    isPending,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    status,
    isSuccess,
  } = useQuery<TLocalizedContent, TErrorResponse, TLocalizedContent, TQueryKey>(options);

  return {
    data: queryResult?.data, // queryResult can be undefined during initial fetch
    labels: queryResult?.labels,
    isPending,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    status,
    isSuccess,
  };
}
```

---

**14. `src/hooks/useLocalizedView.ts`**

```typescript
// src/hooks/useLocalizedView.ts
import { useLanguage } from '@/context/LanguageProvider';
import { useInternationalizedQuery } from './useInternationalizedQuery';
import type { ApiError, Language, LocalizedContent } from '@/types';
import { QueryKey, UseQueryOptions } from '@tanstack/react-query';

export function useLocalizedView<
  TDataPayload,
  TLabelsBundle
>(
  viewQueryKey: QueryKey,
  fetchViewFn: (lang: Language) => Promise<LocalizedContent<TDataPayload, TLabelsBundle>>,
  options?: Omit<UseQueryOptions<LocalizedContent<TDataPayload, TLabelsBundle>, ApiError, LocalizedContent<TDataPayload, TLabelsBundle>, QueryKey>, 'queryKey' | 'queryFn'>
) {
  const { language } = useLanguage();
  const fullQueryKeyWithLang: QueryKey = Array.isArray(viewQueryKey)
    ? [...viewQueryKey, language]
    : [viewQueryKey, language];

  return useInternationalizedQuery<
    LocalizedContent<TDataPayload, TLabelsBundle>,
    ApiError,
    TDataPayload,
    TLabelsBundle
  >({
    queryKey: fullQueryKeyWithLang,
    queryFn: () => fetchViewFn(language),
    enabled: !!language && (options?.enabled === undefined || options.enabled),
    ...options,
  });
}
```

---

**15. `src/components/common/Button.tsx`**

```tsx
// src/components/common/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  loadingText = "Loading...",
  ...props
}) => {
  const baseStyle = "button-common";
  const variantStyle = variant === 'primary' ? "button-primary" : "button-secondary";
  return (
    <button className={`${baseStyle} ${variantStyle}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? loadingText : children}
    </button>
  );
};
export default Button;
```

---

**16. `src/components/common/LoadingSpinner.tsx`**

```tsx
// src/components/common/LoadingSpinner.tsx
import React from 'react';
// CSS for this will be in src/index.css

const LoadingSpinner: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner"></div>
      {text && <p className="loading-spinner-text">{text}</p>}
    </div>
  );
};
export default LoadingSpinner;
```

---

**17. `src/components/common/ErrorDisplay.tsx`**

```tsx
// src/components/common/ErrorDisplay.tsx
import React from 'react';
import type { ApiError } from '@/types';
import Button from './Button'; // Use our common Button

interface ErrorDisplayProps {
  error: ApiError | Error | null;
  title?: string;
  messageTemplate?: string;
  onRetry?: () => void;
  retryButtonText?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title = "Error", // Fallback title
  messageTemplate = "Details: {message}",
  onRetry,
  retryButtonText = "Try Again",
}) => {
  if (!error) return null;

  const errorMessage = error.message || "An unknown error occurred.";
  const finalMessage = messageTemplate.replace('{message}', errorMessage);
  const errorCode = (error as ApiError)?.errorCode;
  const statusCode = (error as ApiError)?.statusCode;

  return (
    <div className="error-container" role="alert">
      <h3>{title}</h3>
      <p className="error-text">{finalMessage}</p>
      {errorCode && <p className="error-code-text">Error Code: {errorCode}</p>}
      {statusCode && <p className="error-code-text">Status Code: {statusCode}</p>}
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" style={{ marginTop: '10px' }}>
          {retryButtonText}
        </Button>
      )}
    </div>
  );
};
export default ErrorDisplay;
```

---

**18. `src/components/layout/Header.tsx`**

```tsx
// src/components/layout/Header.tsx
import React from 'react';
import type { GlobalLayoutLabelsBundle } from '@/types';

interface HeaderProps {
  labels: GlobalLayoutLabelsBundle | undefined;
  isFetching?: boolean;
}

const Header: React.FC<HeaderProps> = ({ labels, isFetching }) => {
  // Provide a minimal fallback if labels are still undefined during initial render pass
  const title = labels?.appTitle || "App Loading...";

  return (
    <header style={{ opacity: isFetching ? 0.7 : 1 }}>
      <h1>
        {title}
        {isFetching && labels && <small style={{ marginLeft: '10px', fontStyle: 'italic', color: '#555' }}>(syncing layout...)</small>}
      </h1>
    </header>
  );
};
export default Header;
```

---

**19. `src/components/layout/Navigation.tsx`**

```tsx
// src/components/layout/Navigation.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import type { GlobalLayoutLabelsBundle } from '@/types';

interface NavigationProps {
  labels: GlobalLayoutLabelsBundle | undefined;
}

const Navigation: React.FC<NavigationProps> = ({ labels }) => {
  // Provide fallbacks for label properties
  const navHomeText = labels?.navHome || "Home";
  const navSettingsText = labels?.navSettings || "Settings";

  if (!labels) { // Can show a minimal loading state or just render with fallbacks
    return <nav>Loading navigation...</nav>;
  }

  return (
    <nav>
      <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>{navHomeText}</NavLink>
      <NavLink to="/settings" className={({isActive}) => isActive ? 'active' : ''}>{navSettingsText}</NavLink>
    </nav>
  );
};
export default Navigation;
```

---

**20. `src/components/layout/AppShell.tsx`**

```tsx
// src/components/layout/AppShell.tsx
import React, { ReactNode } from 'react';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchGlobalLayoutView } from '@/services';
import Header from './Header';
import Navigation from './Navigation';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import type { GlobalLayoutLabelsBundle, ApiError } from '@/types';

interface AppShellProps { children: ReactNode; }

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    labels: globalLabels, isPending, isError, error, isFetching, refetch
  } = useLocalizedView<null, GlobalLayoutLabelsBundle>(
    'globalLayoutViewContent', // Unique query key for this "view"
    fetchGlobalLayoutView
  );

  if (isPending && !globalLabels) {
    // Use a very generic loading text if global labels themselves are not available
    return <LoadingSpinner text={globalLabels?.loadingGeneric || "Initializing Application..."} />;
  }

  if (isError || !globalLabels) { // Critical error if global labels fail
    return (
      <div style={{ padding: '20px' }}>
        <ErrorDisplay
          error={error} // Error from the hook
          title={globalLabels?.appErrorHeading || "Application Shell Error"}
          messageTemplate={globalLabels?.appErrorGeneralMessage || "Core UI failed. Details: {message}"}
          onRetry={refetch}
          retryButtonText="Retry Loading Shell"
        />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header labels={globalLabels} isFetching={isFetching && !!globalLabels}/> {/* Pass fetching only if labels are loaded */}
      <Navigation labels={globalLabels} />
      <hr />
      <main>{children}</main>
      <hr />
      <footer style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em', color: '#7f8c8d' }}>
        <p>{globalLabels.footerText || "App Footer"}</p>
      </footer>
    </div>
  );
};
export default AppShell;
```

---

**21. `src/features/home/WelcomeSection.tsx`**

```tsx
// src/features/home/WelcomeSection.tsx
import React from 'react';
import type { HomeWelcomeSectionLabels } from '@/types';

interface WelcomeSectionProps {
  labels: HomeWelcomeSectionLabels | undefined;
  username: string | undefined;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ labels, username }) => {
  if (!labels || username === undefined) {
    return <p className="loading-text" style={{ fontStyle: 'italic' }}>Initializing welcome message...</p>;
  }
  const welcomeText = labels.welcomeMessage.replace('{user}', username);
  return <p>{welcomeText}</p>;
};
export default WelcomeSection;
```

---

**22. `src/features/home/MoodsSection.tsx`**

```tsx
// src/features/home/MoodsSection.tsx
import React from 'react';
import type { HomeMoodsSectionLabels, MoodItem } from '@/types';
import Button from '@/components/common/Button';

interface MoodsSectionProps {
  labels: HomeMoodsSectionLabels | undefined;
  moods: readonly MoodItem[] | undefined; // Made readonly in type
  onRefresh: () => void;
  isFetching?: boolean;
}

const MoodsSection: React.FC<MoodsSectionProps> = ({ labels, moods, onRefresh, isFetching }) => {
  if (!labels) {
    return <p className="loading-text" style={{ fontStyle: 'italic' }}>Loading moods section...</p>;
  }

  return (
    <section className="page-content" style={{marginTop: '20px'}}> {/* Use class for styling */}
      <h4>{labels.sectionTitle}</h4> {/* Use h4 for sections within a page normally */}
      {moods && moods.length > 0 ? (
        <ul>
          {moods.map(mood => (
            <li key={mood.id}>{mood.name}: <strong>{mood.feeling}</strong></li>
          ))}
        </ul>
      ) : (
        <p>{labels.noMoodsMessage}</p>
      )}
      <Button onClick={onRefresh} isLoading={isFetching} loadingText="Refreshing...">
        {labels.refreshButtonText}
      </Button>
    </section>
  );
};
export default MoodsSection;
```

---

**23. `src/features/settings/LanguageSettingsSection.tsx`**

```tsx
// src/features/settings/LanguageSettingsSection.tsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import type { Language, SettingsLanguageSectionLabels } from '@/types';
import Button from '@/components/common/Button';

interface LanguageSettingsSectionProps {
  labels: SettingsLanguageSectionLabels | undefined;
  isUpdatingPage?: boolean; // Indicates if the parent page is fetching new labels
}

const LanguageSettingsSection: React.FC<LanguageSettingsSectionProps> = ({ labels, isUpdatingPage }) => {
  const { language, setLanguage } = useLanguage();
  const [selectedLocalLang, setSelectedLocalLang] = useState<Language>(language);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setSelectedLocalLang(language); // Sync with global changes
    if (showSuccess) setShowSuccess(false); // Hide success if global lang changes elsewhere
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); // Only re-sync local if global language changes

  if (!labels) {
    return <p className="loading-text" style={{ fontStyle: 'italic' }}>Loading language settings...</p>;
  }

  const handleSave = () => {
    if (selectedLocalLang !== language) {
      setLanguage(selectedLocalLang); // This will trigger page label refetch
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    }
  };

  const currentLangDisplay = labels.currentLanguageIs.replace('{lang}', language.toUpperCase());

  return (
    <section> {/* Sections could also use page-content class if desired */}
      <h4>{labels.sectionTitle}</h4>
      <p>{currentLangDisplay}</p>
      <div>
        <label htmlFor="lang-select-component" style={{ marginRight: '8px' }}>{labels.selectLanguagePrompt}</label>
        <select
          id="lang-select-component"
          value={selectedLocalLang}
          onChange={e => {
            setSelectedLocalLang(e.target.value as Language);
            if (showSuccess) setShowSuccess(false);
          }}
          disabled={isUpdatingPage}
        >
          <option value="en">{labels.langNameEn}</option>
          <option value="zh">{labels.langNameZh}</option>
        </select>
      </div>
      <Button
        onClick={handleSave}
        disabled={isUpdatingPage || selectedLocalLang === language}
        style={{marginTop: '15px'}}
        variant="primary"
      >
        {labels.saveButtonText}
      </Button>
      {showSuccess && <p style={{ color: 'green', marginTop: '10px', fontStyle:'italic' }}>{labels.successMessage}</p>}
    </section>
  );
};
export default LanguageSettingsSection;
```

---

**24. `src/pages/HomePage.tsx`**

```tsx
// src/pages/HomePage.tsx
import React from 'react';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchHomePageView } from '@/services';
import WelcomeSection from '@/features/home/WelcomeSection';
import MoodsSection from '@/features/home/MoodsSection';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import Button from '@/components/common/Button'; // Example of using common button
import type { HomePageViewDataPayload, HomePageViewLabelsBundle, ApiError } from '@/types';

const HomePage: React.FC = () => {
  const {
    data: pageData, labels: pageLabels, isPending, isError, error, refetch, isFetching
  } = useLocalizedView<HomePageViewDataPayload, HomePageViewLabelsBundle>(
    'homePageViewContent',
    fetchHomePageView
  );

  if (isPending && !pageLabels) { // Full page initial load
    return <LoadingSpinner text="Loading Home Page Content..." />;
  }

  if (isError && !pageLabels) { // Critical: Page labels failed
    return (
      <div className="page-content">
        <ErrorDisplay error={error} title="Home Page Error" onRetry={refetch} />
      </div>
    );
  }

  // If labels are partially/fully loaded, but an error occurred or still pending data
  // We can render the page shell with what we have.
  const isLoadingData = isPending || (isFetching && !pageData); // True if data is still being fetched/refetched

  return (
    <div className="page-container"> {/* Optional container for page styling */}
      <h2>{pageLabels?.pageTitle || "Dashboard"}</h2>

      <WelcomeSection labels={pageLabels?.welcomeSection} username={pageData?.username} />

      <MoodsSection
        labels={pageLabels?.moodsSection}
        moods={pageData?.moods}
        onRefresh={refetch}
        isFetching={isFetching}
      />

      {/* Example of a page-level button using a page-level label */}
      {pageLabels?.someActionText && (
        <Button onClick={() => alert('Action Confirmed!')} style={{marginTop: '20px'}}>
          {pageLabels.someActionText}
        </Button>
      )}

      {/* Show specific data error if labels loaded but data part failed */}
      {isError && pageData === undefined && pageLabels && (
         <ErrorDisplay
            error={error}
            title={pageLabels.moodsSection?.sectionTitle || "Data Fetch Error"}
            messageTemplate="Could not load mood data. Details: {message}"
            onRetry={refetch}
         />
       )}
       {isLoadingData && pageLabels && ( // Show spinner for data if labels are present
           <LoadingSpinner text="Fetching latest data..." />
       )}
    </div>
  );
};
export default HomePage;
```

---

**25. `src/pages/SettingsPage.tsx`**

```tsx
// src/pages/SettingsPage.tsx
import React from 'react';
import { useLocalizedView } from '@/hooks/useLocalizedView';
import { fetchSettingsPageView } from '@/services';
import LanguageSettingsSection from '@/features/settings/LanguageSettingsSection';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import type { SettingsPageViewLabelsBundle, ApiError } from '@/types';

const SettingsPage: React.FC = () => {
  const {
    labels: pageLabels, isPending, isError, error, refetch, isFetching
  } = useLocalizedView<null, SettingsPageViewLabelsBundle>(
    'settingsPageViewContent',
    fetchSettingsPageView
  );

  if (isPending && !pageLabels) { // Full page initial load
    return <LoadingSpinner text="Loading Settings Page Content..." />;
  }

  if (isError || !pageLabels) { // Critical: Page labels failed
     return (
      <div className="page-content">
        <ErrorDisplay
          error={error}
          title={pageLabels?.pageTitle || "Settings Load Error"}
          messageTemplate="Could not load settings. Details: {message}"
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="page-content"> {/* Using class for consistent page styling */}
      <h2>{pageLabels.pageTitle || "Settings"}</h2>
      <LanguageSettingsSection
        labels={pageLabels.languageSection}
        isUpdatingPage={isFetching && !!pageLabels} // Page is fetching if labels are present but still fetching
      />
      {/* Other settings sections would be added here */}
    </div>
  );
};
export default SettingsPage;
```

---

**26. `src/router.tsx`**

```tsx
// src/router.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Lazy load page components
const HomePage = lazy(() => import('@/pages/HomePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading view..." />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} /> {/* Fallback route */}
      </Routes>
    </Suspense>
  );
};
export default AppRouter;
```

---

**27. `src/App.tsx`**

```tsx
// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LanguageProvider } from '@/context/LanguageProvider';
import { populateDB } from '@/db';
import AppShell from '@/components/layout/AppShell';
import AppRouter from '@/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false, // Personal preference for demos
      retry: 1, // Retry failed queries once
    },
  },
});

const App: React.FC = () => {
  useEffect(() => {
    // Populate Dexie DB on app start for development
    if (import.meta.env.DEV) { // Vite specific dev check
      populateDB().catch(err => {
        console.error("Failed to populate Dexie DB:", err);
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <AppShell> {/* AppShell fetches global layout labels and provides overall structure */}
            <AppRouter /> {/* AppRouter handles page-specific content and routing */}
          </AppShell>
        </BrowserRouter>
      </LanguageProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};
export default App;
```

---

**28. `src/main.tsx`**

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Global styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

This V3 Final version provides a clean, well-structured, and type-safe foundation. The README clearly outlines the architecture, making it suitable for team collaboration. Key improvements include refined naming, a dedicated `useLocalizedView` hook, and clearer separation of concerns with page components fetching all necessary content and delegating rendering to feature-specific sections.