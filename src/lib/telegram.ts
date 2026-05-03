interface BookingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string
  locale: string
}

const messages = {
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
  const lang = (data.locale as keyof typeof messages) in messages
    ? (data.locale as keyof typeof messages)
    : 'de'

  const text = messages[lang](data)

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