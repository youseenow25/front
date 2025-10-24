export default function Stats() {
return (
<section className="container-hero py-10">
<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
{[
{ k: '35,000+', v: 'Happy Resellers' },
{ k: '120+', v: 'Store Templates' },
{ k: '99%', v: 'Success Rate' }
].map((s) => (
<div key={s.k} className="card p-6 text-center">
<div className="text-3xl font-semibold">{s.k}</div>
<div className="mt-2 text-sm text-white/60">{s.v}</div>
</div>
))}
</div>
</section>
)
}