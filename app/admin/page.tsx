import { Navbar } from '../components/Navbar';

export default function AdminPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {['Approve Parents', 'Manage Routes', 'Manage Payments', 'Ban Users', 'Analytics', 'Vehicle Usage Reports'].map((item) => (
            <div key={item} className="glass rounded-2xl p-5">{item}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
