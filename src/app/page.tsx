import Link from 'next/link';
import Image from "next/image";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link href="/about">Go to About</Link>
      {/* <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start"> */}
      <main className="min-h-screen bg-white">
{/* Hero-секция */}
<section className="bg-slate-900 text-white py-20 px-10 text-center">
<h1 className="text-5xl font-bold mb-4">
Автосервис «Auto-Service»
</h1>
<p className="text-xl text-slate-300 mb-8">
Качественный ремонт и обслуживание вашего автомобиля в кратчайшие сроки
</p>
<button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg
transition">
Записаться на сервис
</button>
</section>
{/* Секция услуг (заглушка) */}
<section className="py-16 max-w-6xl mx-auto px-4">
<h2 className="text-3xl font-bold text-center mb-12 text-slate-800">Наши услуги</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{['Диагностика', 'Ремонт двигателя', 'ТО и замена масла'].map((service) => (
<div key={service} className="border p-6 rounded-xl shadow-sm hover:shadow-md transition">
<h3 className="text-xl font-semibold mb-2 text-slate-700">{service}</h3>
<p className="text-slate-600">Профессиональное обслуживание с гарантией качества.</p>
</div>
))}
</div>
</section>
      </main>
    </div>
  );
}
