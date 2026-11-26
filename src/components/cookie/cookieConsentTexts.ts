// src/components/cookie/cookieConsentTexts.ts
// Texts for the cookie banner in all locales at once: vanilla-cookieconsent
// needs every translation registered up front to switch language in place.
// {privacy} / {legal} are replaced with real, localized links.

export type CookieLang = 'de' | 'ru' | 'en'

type Texts = {
  title: string
  description: string
  acceptAll: string
  acceptNecessary: string
  showPreferences: string
  preferencesTitle: string
  save: string
  close: string
  necessaryTitle: string
  necessaryDescription: string
  externalTitle: string
  externalDescription: string
  moreTitle: string
  moreDescription: string
  privacy: string
  legal: string
}

export const COOKIE_TEXTS: Record<CookieLang, Texts> = {
  de: {
    title: 'Cookies & Datenschutz',
    description:
      'Wir verwenden notwendige Cookies für den Betrieb der Website. Mit Ihrer Einwilligung laden wir außerdem externe Medien wie Google Maps. Sie können Ihre Auswahl jederzeit ändern. Mehr dazu in der {privacy} und im {legal}.',
    acceptAll: 'Alle akzeptieren',
    acceptNecessary: 'Nur notwendige',
    showPreferences: 'Einstellungen',
    preferencesTitle: 'Cookie-Einstellungen',
    save: 'Auswahl speichern',
    close: 'Schließen',
    necessaryTitle: 'Notwendige Cookies',
    necessaryDescription:
      'Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden. Sie speichern z. B. Ihre Cookie-Auswahl.',
    externalTitle: 'Externe Medien (Google Maps)',
    externalDescription:
      'Zeigt die Karte mit unserem Standort an. Beim Laden werden Daten, u. a. Ihre IP-Adresse, an Google übertragen. Anbieter: Google Ireland Limited.',
    moreTitle: 'Weitere Informationen',
    moreDescription:
      'Details zur Verarbeitung Ihrer Daten finden Sie in der {privacy}. Anbieterkennzeichnung: {legal}.',
    privacy: 'Datenschutzerklärung',
    legal: 'Impressum',
  },
  ru: {
    title: 'Cookies и конфиденциальность',
    description:
      'Мы используем необходимые cookies для работы сайта. С вашего согласия мы также загружаем внешние медиа, например Google Maps. Вы можете изменить выбор в любой момент. Подробнее — в {privacy} и в {legal}.',
    acceptAll: 'Принять все',
    acceptNecessary: 'Только необходимые',
    showPreferences: 'Настройки',
    preferencesTitle: 'Настройки cookies',
    save: 'Сохранить выбор',
    close: 'Закрыть',
    necessaryTitle: 'Необходимые cookies',
    necessaryDescription:
      'Эти cookies нужны для работы сайта и не могут быть отключены. Например, в них хранится ваш выбор по cookies.',
    externalTitle: 'Внешние медиа (Google Maps)',
    externalDescription:
      'Показывает карту с нашим адресом. При загрузке данные, в том числе ваш IP-адрес, передаются Google. Поставщик: Google Ireland Limited.',
    moreTitle: 'Дополнительная информация',
    moreDescription:
      'Подробности об обработке ваших данных — в {privacy}. Сведения о владельце сайта: {legal}.',
    privacy: 'политике конфиденциальности',
    legal: 'выходных данных (Impressum)',
  },
  en: {
    title: 'Cookies & privacy',
    description:
      'We use necessary cookies to run the website. With your consent we also load external media such as Google Maps. You can change your choice at any time. See our {privacy} and {legal}.',
    acceptAll: 'Accept all',
    acceptNecessary: 'Necessary only',
    showPreferences: 'Settings',
    preferencesTitle: 'Cookie settings',
    save: 'Save selection',
    close: 'Close',
    necessaryTitle: 'Necessary cookies',
    necessaryDescription:
      'These cookies are required for the website to work and cannot be disabled. They store, for example, your cookie choice.',
    externalTitle: 'External media (Google Maps)',
    externalDescription:
      'Shows the map with our location. Loading it sends data, including your IP address, to Google. Provider: Google Ireland Limited.',
    moreTitle: 'More information',
    moreDescription:
      'Details on how we process your data are in our {privacy}. Provider identification: {legal}.',
    privacy: 'privacy policy',
    legal: 'legal notice',
  },
}
