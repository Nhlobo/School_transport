import { Navbar } from '../components/Navbar';

export default function DriverDashboard() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <h1 className="text-3xl font-bold">Driver Dashboard</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {['Start Route', 'End Route', 'Attendance', 'Route Optimization', 'Fuel Expenses', 'Monthly Income'].map((item) => (
            <div key={item} className="glass rounded-2xl p-5">{item}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
