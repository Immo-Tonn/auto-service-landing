// ─── Booking notification ─────────────────────────────────────────────────────

interface BookingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string
  locale: string
}

const bookingMessages = {
  de: (d: BookingData) => `
🔔 *Neuer Termin*

👤 *Name:* ${d.firstName} ${d.lastName}
📅 *Datum:* ${new Date(d.date).toLocaleDateString('de-DE')}
📧 *E-Mail:* ${d.email}
📱 *Telefon:* ${d.phone}
  `,
  ru: (d: BookingData) => `
🔔 *Новая запись*

👤 *Имя:* ${d.firstName} ${d.lastName}
📅 *Дата:* ${new Date(d.date).toLocaleDateString('ru-RU')}
📧 *Email:* ${d.email}
📱 *Телефон:* ${d.phone}
  `,
  en: (d: BookingData) => `
🔔 *New Appointment*

👤 *Name:* ${d.firstName} ${d.lastName}
📅 *Date:* ${new Date(d.date).toLocaleDateString('en-GB')}
📧 *Email:* ${d.email}
📱 *Phone:* ${d.phone}
  `,
}

export async function sendTelegramNotification(data: BookingData) {
  const lang =
    (data.locale as keyof typeof bookingMessages) in bookingMessages
      ? (data.locale as keyof typeof bookingMessages)
      : 'de'

  const text = bookingMessages[lang](data)

  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
      }),
    }
  )
}

// ─── Callback notification ────────────────────────────────────────────────────

interface CallbackData {
  name: string
  phone: string
  locale: string
}

const callbackMessages = {
  de: (d: CallbackData) => `
📞 *Rückrufanfrage*

👤 *Name:* ${d.name}
📱 *Telefon:* ${d.phone}
  `,
  ru: (d: CallbackData) => `
📞 *Обратный звонок*

👤 *Имя:* ${d.name}
📱 *Телефон:* ${d.phone}
  `,
  en: (d: CallbackData) => `
📞 *Callback Request*

👤 *Name:* ${d.name}
📱 *Phone:* ${d.phone}
  `,
}

export async function sendCallbackNotification(data: CallbackData) {
  const lang =
    (data.locale as keyof typeof callbackMessages) in callbackMessages
      ? (data.locale as keyof typeof callbackMessages)
      : 'de'

  const text = callbackMessages[lang](data)

  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
      }),
    }
  )
}

// ─── Contact notification ─────────────────────────────────────────────────────

interface ContactData {
  name: string
  email: string
  phone: string
  message: string
  locale: string
}

const contactMessages = {
  de: (d: ContactData) => `
✉️ *Neue Kontaktanfrage*

👤 *Name:* ${d.name}
📧 *E-Mail:* ${d.email}
📱 *Telefon:* ${d.phone}
💬 *Nachricht:* ${d.message}
  `,
  ru: (d: ContactData) => `
✉️ *Новое сообщение*

👤 *Имя:* ${d.name}
📧 *Email:* ${d.email}
📱 *Телефон:* ${d.phone}
💬 *Сообщение:* ${d.message}
  `,
  en: (d: ContactData) => `
✉️ *New Contact Request*

👤 *Name:* ${d.name}
📧 *Email:* ${d.email}
📱 *Phone:* ${d.phone}
💬 *Message:* ${d.message}
  `,
}

export async function sendContactNotification(data: ContactData) {
  const lang =
    (data.locale as keyof typeof contactMessages) in contactMessages
      ? (data.locale as keyof typeof contactMessages)
      : 'de'

  const text = contactMessages[lang](data)

  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
      }),
    }
  )
}

// interface BookingData {
//   firstName: string
//   lastName: string
//   email: string
//   phone: string
//   date: string
//   locale: string
// }

// const messages = {
//   de: (d: BookingData) => `
// 🔔 *Neuer Termin*

// 👤 *Name:* ${d.firstName} ${d.lastName}
// 📅 *Datum:* ${new Date(d.date).toLocaleDateString('de-DE')}
// 📧 *E-Mail:* ${d.email}
// 📱 *Telefon:* ${d.phone}
//   `,
//   ru: (d: BookingData) => `
// 🔔 *Новая запись*

// 👤 *Имя:* ${d.firstName} ${d.lastName}
// 📅 *Дата:* ${new Date(d.date).toLocaleDateString('ru-RU')}
// 📧 *Email:* ${d.email}
// 📱 *Телефон:* ${d.phone}
//   `,
//   en: (d: BookingData) => `
// 🔔 *New Appointment*

// 👤 *Name:* ${d.firstName} ${d.lastName}
// 📅 *Date:* ${new Date(d.date).toLocaleDateString('en-GB')}
// 📧 *Email:* ${d.email}
// 📱 *Phone:* ${d.phone}
//   `,
// }

// export async function sendTelegramNotification(data: BookingData) {
//   const lang = (data.locale as keyof typeof messages) in messages
//     ? (data.locale as keyof typeof messages)
//     : 'de'

//   const text = messages[lang](data)

//   await fetch(
//     `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         chat_id: process.env.TELEGRAM_CHAT_ID,
//         text,
//         parse_mode: 'Markdown',
//       }),
//     }
//   )
// }