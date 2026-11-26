# Frontend Audit — auto-service-landing

**Дата:** 2026-11-26 · **Ветка:** `dev` · **Цель совместимости:** Baseline Widely Available
**Проверено:** код в `src/` + живой сайт https://auto-service-landing-five.vercel.app/de

> Ничего не изменено. Бизнес-логика (Prisma, `src/app/api/**`, Telegram/Email, NextAuth, `proxy.ts`) и переводы
> вне рамок аудита. Пункты, которым нужны **новые ключи перевода**, помечены 🔑 — решение за тобой.

Приоритет: **H** — заметно влияет на Lighthouse/UX, **M** — желательно, **L** — полировка.

---

## 0. Базовая линия (сделать ДО изменений)

- PageSpeed Insights / Lighthouse (mobile + desktop) для `/de`: Performance, Accessibility, Best Practices, SEO,
  а также LCP, CLS, TBT. Сохранить скриншоты/JSON в `audit/baseline/`.
- После каждого блока — повторный замер на Vercel Preview.

---

## 1. Изображения и Core Web Vitals

### 1.1 [H] Неверные пропорции Hero-изображения → CLS
`src/app/[locale]/page.tsx:41-48`
- Файл `public/E500.avif` = **3840×1664** (≈2.31:1), а в коде `width={1920} height={1080}` (16:9).
  Браузер резервирует место по 16:9, после загрузки высота уменьшается → сдвиг контента (CLS).
- **Решение:** `width={3840} height={1664}` (или пропорциональные `1920×832`).

### 1.2 [H] `priority` устарел в Next.js 16
`src/app/[locale]/page.tsx:46`
- По документации `node_modules/next/dist/docs/.../image.md`: `priority` deprecated, рекомендуется
  `loading="eager"` + `fetchPriority="high"` (или `preload`).
- **Решение:** заменить `priority` на `loading="eager" fetchPriority="high"`.

### 1.3 [M] Hero сдвигается через `-translate-y-[30..60px]`
`src/app/[locale]/page.tsx:33-40`
- Отрицательный translate «прячет» верх картинки под шапку. Это не CLS, но на разных брейкпоинтах
  обрезает разное количество изображения. Лучше обрезать сам файл (или `object-position`) и убрать translate.
- Риск визуальных изменений — проверить глазами.

### 1.4 [H] Тяжёлые исходники в `public/`
| Файл | Размер | Разрешение | Где используется |
|---|---|---|---|
| `geometry.png` | 2.4 MB | 1448×1086 | галерея |
| `visitors.png` | 2.5 MB | 1448×1086 | галерея |
| `mainhall.JPG` | 1.1 MB | 2304×1728 | галерея |
| `office.JPG` | 654 KB | 2390×1792 | галерея |
| `E500.avif` | 299 KB | 3840×1664 | Hero |
| `mainhall_1.png` | **5.9 MB** | 2390×1792 | **не используется** |
| `clientroom.JPG` | 890 KB | 2304×1728 | **не используется** |

- `next/image` оптимизирует на лету, но первый запрос к оптимизатору на Vercel медленный, а исходники тратят лимит
  Image Optimization. **Решение:** пережать фото в AVIF/WebP ≤ 1920px по длинной стороне (цель < 200 KB),
  неиспользуемые файлы удалить из `public/`.

### 1.5 [H] `mechaniker.jfif` идёт мимо оптимизатора
`src/components/AboutSection.tsx:16` (`unopt: true`), используется в `:130-137` и лайтбоксе `:174-181`
- На живом сайте отдаётся как оригинал `/mechaniker.jfif` без srcset. Файл — обычный JPEG (1024×688).
- **Решение:** конвертировать в `mechaniker.webp` (или переименовать в `.jpg`), убрать `unopt` и проп `unoptimized`.

### 1.6 [M] Слайдер услуг использует `<img>` вместо `next/image`
`src/components/ServicesSection.tsx:152-156`; слайды `:11`, `:16` (включая `maintenance_4_en.jfif` — тоже JPEG)
- Нет srcset/lazy/оптимизации; при смене слайда контейнер фиксирован `height: 420px` (`:136`), поэтому CLS нет,
  но трафик лишний.
- **Решение:** `next/image` с `fill` + `sizes="(max-width: 768px) 100vw, 768px"`; `.jfif` → `.webp`.
  Учесть горизонтальный скролл на мобильных (`w-auto max-w-none`) — возможно оставить `object-cover` везде.

### 1.7 [L] Иконки в `public/icons`
- `HeroButtons.tsx:488-496, 513-520` — плавающие кнопки, `<img>` 90×90 SVG. Для SVG это нормально,
  `next/image` не нужен. Только alt — см. 4.2.

---

## 2. Модальные окна и мобильное меню

**Ключевой вывод:** все модалки **самописные** (Framer Motion + `div`), HeroUI Modal не используется.
У них нет: `role="dialog"`/`aria-modal`, ловушки фокуса, закрытия по Escape (кроме лайтбокса), возврата фокуса
на кнопку, блокировки скролла `body`, «инертности» фона. Переход на нативный `<dialog>` здесь даёт **реальную
пользу** (всё это браузер делает сам) и лучше, чем ручное дописывание.

| Компонент | Файл | Escape | Фокус | role |
|---|---|---|---|---|
| Termin buchen / Rückruf | `HeroButtons.tsx:20-66` (Modal), `:188-228` | ❌ | ❌ | ❌ |
| Kontakt-Modal | `ContactSection.tsx:16-47` (копия Modal) | ❌ | ❌ | ❌ |
| Mehr erfahren (слайдер) | `ServicesSection.tsx:80-195` | ❌ | ❌ | ❌ |
| Лайтбокс галереи | `AboutSection.tsx:149-214` | ✅ только если фокус внутри (`tabIndex=-1`, но фокус туда не ставится) | ❌ | ❌ |
| Success-оверлеи | `HeroButtons.tsx:70-86`, `ContactSection.tsx:58-74`, `BookingForm.tsx:79-93` | ❌ | ❌ | ❌ |
| Мобильное меню | `Header.tsx:213-333` | ❌ | ❌ | — |

### 2.1 [H] Общий компонент `components/ui/Dialog.tsx` на `<dialog>`
- Один компонент вместо двух копий `Modal` (`HeroButtons`, `ContactSection`) + переиспользовать в слайдере и лайтбоксе.
- Схема: `ref.current.showModal()` / `close()` по пропу `open`; событие `cancel`/`close` → `onClose`;
  клик по `::backdrop` = клик по самому `<dialog>` (`e.target === e.currentTarget`); `aria-labelledby` на `<h2>`.
- Блокировка скролла: `html:has(dialog[open]) { overflow: hidden; }` (`:has()` — Widely Available с 06.2026).
- **Анимация:** `<dialog>` + Framer Motion `AnimatePresence` конфликтуют при закрытии (элемент уходит в top layer
  и исчезает сразу). Варианты:
  a) CSS-переходы на `opacity/transform` + `@starting-style` + `transition-behavior: allow-discrete` —
     ⚠️ это **Baseline Newly Available**, использовать только как прогрессивное улучшение (без них просто нет анимации);
  b) оставить Framer Motion только для внутреннего контейнера и вызывать `close()` в `onExitComplete`.
- Логика `BookingForm`/`CallbackForm`/`ContactForm` и вызовы `/api/bookings`, `/api/callback`, `/api/contact` не меняются —
  меняется только оболочка.

### 2.2 [M] Success-оверлей внутри `BookingForm`
`src/components/BookingForm.tsx:79-93`
- Рисуется `fixed`-оверлеем **изнутри** модалки и с другим стилем (белый), чем остальные (тёмные). При переходе на
  `<dialog>` fixed-элемент внутри top layer будет вести себя иначе. **Решение:** поднять success-состояние наверх
  (`onSuccess` как у `CallbackForm`) и показывать единый `SuccessDialog`. Логику отправки не трогать.
- Добавить `role="status"`/`aria-live="polite"` для текста успеха.

### 2.3 [M] Мобильное меню
`src/components/Header.tsx:201-207, 213-333`
- Бургер: нет `aria-expanded`, `aria-controls`. Панель `<aside>` без имени и фокуса; Escape не закрывает.
- Popover API — Newly Available (январь 2025), не подходит под цель. **Решение:** тот же `<dialog>`
  (модальный, выезжает справа) — получаем Escape, фокус и inert-фон бесплатно; либо минимум: `aria-expanded`,
  перевод фокуса в панель, Escape-обработчик.
- `useEffect` с `resize` (`:102-108`) можно заменить на `matchMedia('(min-width: 900px)')` — меньше вызовов.

### 2.4 [M] Кликабельные `div`
- `ServicesSection.tsx:29-36` — карточка с `onClick` на `div`: недоступна с клавиатуры. → `<button type="button">`
  (для карточек без слайдов — `disabled` / обычный `div` без курсора).
- `AboutSection.tsx:124-128` — плитки галереи на `div` с `onClick`. → `<button>` с `aria-label={t(alt)}`.

---

## 3. Современный CSS и адаптивность (Tailwind v4)

### 3.1 [H] Карточки «Unsere Leistungen» с фиксированной шириной
`src/components/ServicesSection.tsx:38-46, 208`
- Inline `width: 260px; minHeight: 280px` + `justify-items-center` → на 320–360px экранах карточка не растягивается,
  на планшетах между колонками неровные поля; высота плавает при длинных заголовках (DE-тексты длиннее RU/EN).
- **Решение:**
  - сетка: `grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))]` — без брейкпоинтов;
  - выравнивание заголовка и «Mehr erfahren» по строкам: карточка `grid grid-rows-subgrid row-span-2`
    (`subgrid` — Widely Available с 03.2026);
  - карточка — `@container`, размер шрифта заголовка через `@[16rem]:text-sm` вместо `text-[11px] sm:text-xs lg:text-[13px]`.
- Inline-градиенты (`:41-42`, `:69-72`) вынести в `@theme`/утилиты — легче поддерживать.

### 3.2 [M] Плавная типографика через `clamp()`
- Hero `h1` `page.tsx:62-65`: `text-2xl sm:text-3xl md:text-4xl lg:text-4xl` → `text-[clamp(1.5rem,1rem+2.5vw,2.25rem)]`.
- Подзаголовок `page.tsx:68-71`, заголовки секций (`ServicesSection.tsx:205`, `ContactSection.tsx:215`),
  цифры статистики (`AboutSection.tsx:108`) — аналогично.
- Можно задать токены в `globals.css` `@theme { --text-hero: clamp(...) }` → утилита `text-hero`.

### 3.3 [M] Блок статистики
`src/components/AboutSection.tsx:105-117`
- Работает, но `grid-cols-2 lg:grid-cols-4` — на 900–1023px всё ещё 2 колонки. Container query по ширине блока
  (`@container` + `@3xl:grid-cols-4`) точнее. Значения — в `clamp()` (см. 3.2).
- Семантика: это список пар «значение—подпись» → `<dl>`/`<dt>`/`<dd>` (без визуальных изменений).

### 3.4 [H] About-блок: 12 медиазапросов «по пикселям»
`src/components/AboutSection.tsx:54-92`
- `[@media(768px<=width<784px)]:w-[49.5%]` … до `946px` — хрупко, сломается при любом изменении текста.
- **Решение:** CSS Grid с наложением (`grid-cols-[minmax(0,2fr)_minmax(0,3fr)]`, фото и карточка в одной области
  `[grid-area:1/1]` со смещением), или `@container` на обёртке и 2–3 точки вместо 12. Средний риск — требует
  визуальной проверки на 768–1000px.

### 3.5 [L] Галерея
`src/components/AboutSection.tsx:120-145`
- Горизонтальный скролл со `snap-x` — хорошо. Размер плиток inline `280×220` → `w-70 aspect-[14/11]`.
- Добавить `scroll-padding`/`overscroll-behavior-x: contain`.

### 3.6 [L] globals.css
`src/app/globals.css`
- `scroll-behavior: smooth` для всех — обернуть в `@media (prefers-reduced-motion: no-preference)`.
- `body { font-family: Arial }` — можно заменить на `next/font` (self-hosted, без CLS), опционально.
- Dark-mode переменные `--background/--foreground` фактически не используются (секции задают свой фон) — почистить.

---

## 4. Доступность (A11y) и Lighthouse

### 4.1 [H] Поля форм без `<label>`
`BookingForm.tsx:111-151`, `CallbackForm.tsx:49-82`, `ContactSection.tsx:129-170`
- Только `placeholder` — Lighthouse снимает баллы, скринридеры читают плохо, подсказка исчезает при вводе.
- **Решение:** `<label htmlFor>` с классом `sr-only` (визуально без изменений), тексты — те же ключи, что в placeholder.
- Обернуть в `<form onSubmit>` + кнопка `type="submit"` (Enter отправляет форму, `type="button"` для Reset).
  Обработчики `handleSubmit` остаются, только `e.preventDefault()`.
- Ошибки (`BookingForm.tsx:153`, `CallbackForm.tsx:84`) — `role="alert"`; поля — `aria-invalid`, `required`.

### 4.2 [M] alt-тексты
- `HeroButtons.tsx:490, 514` — у плавающих кнопок уже есть `aria-label`, поэтому `<img>` внутри должен быть `alt=""`
  (сейчас «termin buchen» дублируется).
- `AboutSection.tsx:18` — `photo5` = `"office"` в `de.json` (не переведено) 🔑.
- `page.tsx:44` — `alt="Auto Service Workshop"` захардкожен на английском 🔑 (ключ `hero.imgAlt`).
- Декоративные SVG в `Header.tsx` (Clock/Phone/Burger) и соцсетях — добавить `aria-hidden="true"`.
- Иконки в `ContactSection.tsx:249,260,268` с `alt=""` — ✅ верно.

### 4.3 [H] Фокус: `focus:outline-none` без замены
- Инпуты: `focus:outline-none focus:border-yellow-400` — только смена цвета рамки (слабо на тёмном фоне).
- Кнопки/ссылки не имеют своих стилей фокуса.
- **Решение (одно место):** в `globals.css` `@layer base { :focus-visible { outline: 2px solid var(--color-yellow-400); outline-offset: 2px; } }`
  и заменить `focus:outline-none` → `focus-visible:outline-*` в инпутах.

### 4.4 [M] Кнопки без доступного имени / неправильная семантика
- `ServicesSection.tsx:129-132` — кнопка «×» без `aria-label`; `:162, :171` — стрелки слайдера без `aria-label`.
- `ServicesSection.tsx:186-188` — точки: `aria-label="Bild N"` захардкожен по-немецки 🔑; добавить `aria-current`.
- `AboutSection.tsx:167, 191, 203` — `aria-label` Close/Previous/Next на английском при DE-странице 🔑.
- `BookingCalendar.tsx:42-66` — выбранная дата: `aria-pressed={isSelected}`; занятая — уже `disabled` ✅.
- Переключатель языка `Header.tsx:180-197, 286-299` — `aria-current="true"` для активного, `lang`+`hrefLang` на подписях.
  Лучше `<Link>` из `@/i18n/navigation` вместо `router.push` — индексируемые ссылки на другие локали.

### 4.5 [M] Хардкод текстов и локали (вне переводов) 🔑
- `BookingCalendar.tsx:32` «Laden...», `:57,60` `toLocaleDateString('de-DE')` — на RU/EN даты по-немецки
  (заменить на `useLocale()`/`useFormatter()` из next-intl — без новых ключей).
- `BookingForm.tsx:50,57,89,169`, `HeroButtons.tsx:82` — немецкие строки в RU/EN-версиях.
- Требуют новых ключей → сделать отдельной задачей, если решишь.

### 4.6 [M] Семантика и навигация
- Нет skip-link «Zum Inhalt springen» перед шапкой → `<a href="#main" class="sr-only focus:not-sr-only">` 🔑, `<main id="main">`.
- `Header.tsx:158` — `<nav>` без `aria-label` (их два на странице с Footer'ом — у Footer уже есть ✅).
- Sticky-шапка 64px перекрывает якоря `#services/#about` → `scroll-margin-top: 5rem` на секциях (`scroll-mt-20`).
- Иерархия заголовков h1→h2→h3 ✅ (проверено на живом сайте).
- `html lang={locale}` ✅ (`src/app/[locale]/layout.tsx`).

### 4.7 [L] Контраст
- `ServicesSection.tsx:57` — «Mehr erfahren» `text-[9px] text-yellow-600/60` на тёмном градиенте: и размер, и контраст
  ниже WCAG AA. → минимум 12px, `text-yellow-400/80`.
- Карточки без слайдов `opacity-60` (`:34`) — текст на них проваливает контраст; лучше пометка «скоро» и полная яркость.
- `text-slate-500` на `zinc-900` (подписи, «Klicken Sie irgendwo…») — проверить в DevTools, вероятно < 4.5:1.

### 4.8 [L] Reduced motion
- Framer Motion анимации везде. Обернуть приложение в `<MotionConfig reducedMotion="user">`
  (например, в отдельный клиентский провайдер в `layout.tsx`).

---

## 5. Прочее (замечено попутно)

- [L] `ContactSection.tsx:238` iframe OSM: `loading="lazy"` ✅, `title` на английском 🔑.
- [L] Соцсети `href="#"` (`Header.tsx:310-312`, Footer) — для портфолио ок, но Lighthouse SEO может ругаться
  на «non-crawlable links» → либо реальные URL, либо `<span>`.
- [L] `CLAUDE.md` устарел (раздел «Packages Still to Install», API `notify-ready`, версия Next 16.2.3) —
  обновить, чтобы агент не путался.

---

## Предлагаемый порядок внедрения

| # | Блок | Пункты | Риск |
|---|---|---|---|
| 1 | Hero + изображения | 1.1, 1.2, 1.4, 1.5 | низкий |
| 2 | Фокус + label + aria без новых ключей | 4.1, 4.2 (кроме 🔑), 4.3, 4.4 (кроме 🔑), 4.6 scroll-mt | низкий |
| 3 | `<dialog>`-компонент и миграция модалок | 2.1, 2.2, 2.4 | средний |
| 4 | Мобильное меню | 2.3 | средний |
| 5 | Сетка услуг, clamp, статистика | 3.1, 3.2, 3.3 | средний (визуал) |
| 6 | About-блок | 3.4 | средний (визуал) |
| 7 | Ключи перевода 🔑 | 4.5 и все 🔑 | низкий, но трогает `messages/*.json` |

Каждый блок — отдельный коммит в ветке `audit/modern-web`, проверка `npm run lint && npm run build`,
Vercel Preview + Lighthouse.
