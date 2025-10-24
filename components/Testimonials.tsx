export default function Testimonials() {
const quotes = [
{ name: 'Riley K.', text: 'Flux turned our side‑ops into a predictable engine.' },
{ name: 'Morgan S.', text: 'Setup was instant, scaling was the easy part.' }
]
return (
<section id="testimonials" className="container-hero py-20">
<h2 className="h2">Loved by operators</h2>
<div className="mt-8 grid gap-6 sm:grid-cols-2">
{quotes.map((q) => (
<figure key={q.name} className="card p-6">
<blockquote className="text-white/90">“{q.text}”</blockquote>
<figcaption className="mt-4 text-sm text-white/60">— {q.name}</figcaption>
</figure>
))}
</div>
</section>
)
}