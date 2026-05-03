import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface BookingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string
  locale: string
}

const templates = {
  de: {
    clientSubject: 'Ihre Terminbestätigung — Auto-Service',
    clientBody: (d: BookingData) => `
      <h2>Sehr geehrte(r) ${d.firstName} ${d.lastName},</h2>
      <p>Ihr Termin wurde erfolgreich gebucht.</p>
      <p><strong>Datum:</strong> ${new Date(d.date).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
      <p><strong>Telefon:</strong> ${d.phone}</p>
      <p>Wir freuen uns auf Ihren Besuch!</p>
      <p>Mit freundlichen Grüßen,<br/>Ihr Auto-Service Team</p>
    `,
    adminSubject: '🔔 Neuer Termin',
    adminBody: (d: BookingData) => `
      <h2>Neuer Termin eingegangen</h2>
      <p><strong>Name:</strong> ${d.firstName} ${d.lastName}</p>
      <p><strong>Datum:</strong> ${new Date(d.date).toLocaleDateString('de-DE')}</p>
      <p><strong>E-Mail:</strong> ${d.email}</p>
      <p><strong>Telefon:</strong> ${d.phone}</p>
    `,
  },
  ru: {
    clientSubject: 'Подтверждение записи — Автосервис',
    clientBody: (d: BookingData) => `
      <h2>Уважаемый(ая) ${d.firstName} ${d.lastName},</h2>
      <p>Ваша запись успешно создана.</p>
      <p><strong>Дата:</strong> ${new Date(d.date).toLocaleDateString('ru-RU', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
      <p><strong>Телефон:</strong> ${d.phone}</p>
      <p>Ждём вас!</p>
      <p>С уважением,<br/>Команда Автосервиса</p>
    `,
    adminSubject: '🔔 Новая запись',
    adminBody: (d: BookingData) => `
      <h2>Новая запись</h2>
      <p><strong>Имя:</strong> ${d.firstName} ${d.lastName}</p>
      <p><strong>Дата:</strong> ${new Date(d.date).toLocaleDateString('ru-RU')}</p>
      <p><strong>Email:</strong> ${d.email}</p>
      <p><strong>Телефон:</strong> ${d.phone}</p>
    `,
  },
  en: {
    clientSubject: 'Appointment Confirmation — Auto Service',
    clientBody: (d: BookingData) => `
      <h2>Dear ${d.firstName} ${d.lastName},</h2>
      <p>Your appointment has been successfully booked.</p>
      <p><strong>Date:</strong> ${new Date(d.date).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
      <p><strong>Phone:</strong> ${d.phone}</p>
      <p>We look forward to seeing you!</p>
      <p>Best regards,<br/>Auto Service Team</p>
    `,
    adminSubject: '🔔 New Appointment',
    adminBody: (d: BookingData) => `
      <h2>New Appointment</h2>
      <p><strong>Name:</strong> ${d.firstName} ${d.lastName}</p>
      <p><strong>Date:</strong> ${new Date(d.date).toLocaleDateString('en-GB')}</p>
      <p><strong>Email:</strong> ${d.email}</p>
      <p><strong>Phone:</strong> ${d.phone}</p>
    `,
  },
}

export async function sendBookingEmails(data: BookingData) {
  const lang = (data.locale as keyof typeof templates) in templates
    ? (data.locale as keyof typeof templates)
    : 'de'
  const t = templates[lang]

  // Email клиенту
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: data.email,
    subject: t.clientSubject,
    html: t.clientBody(data),
  })

  // Email админу
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.SMTP_USER,
    subject: t.adminSubject,
    html: t.adminBody(data),
  })
}