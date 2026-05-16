import { Navbar } from '../components/Navbar';

const routes = ['Naledi → Pimville Primary', 'Orlando West → Morris Isaacson', 'Meadowlands → Emhlabeni Primary', 'Dube → Thabisang Primary'];

export default function RoutesPage() {
  return <main className="min-h-screen bg-slate-50 text-slate-900"><Navbar /><section className="mx-auto max-w-5xl px-4 py-10"><h1 className="text-3xl font-bold">Soweto Routes</h1><div className="mt-4 grid gap-3">{routes.map((r)=> <div key={r} className="rounded-lg border bg-white p-4 text-sm">{r}</div>)}</div></section></main>;
}
